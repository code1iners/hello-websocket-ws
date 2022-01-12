import http from "http";
import express from "express";
import WebSocket from "ws";
import cons from "consolidate";

const sockets = [];

const app = express();

app.engine("html", cons.swig);
app.set("views", `${__dirname}/views`);
app.set("view engine", "html");
app.use("/public", express.static(`${__dirname}/public`));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const onListen = () => {};
const onConnection = (socket) => {
  sockets.push(socket);

  // Send all.
  sockets.forEach((s) => {
    s.send(
      JSON.stringify({
        message: `Someone Logged in.`,
      })
    );
  });

  // Init listeners.
  socket.on("close", (s) => {
    console.log("disconnected", s);
  });

  // Message listener.
  socket.on("message", (message) => {
    sockets.forEach((s) => {
      s.send(
        JSON.stringify({
          message: message?.toString(),
        })
      );
    });
  });
};

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", onConnection);

server.listen(3000, onListen);
