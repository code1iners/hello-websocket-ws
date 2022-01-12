const socket = new WebSocket(`ws://${window.location.host}`);
const chatContainer = document.querySelector(".chat__container");

let myId;

socket.addEventListener("open", () => {
  console.log("Connected with server.");
});

socket.addEventListener("message", (message) => {
  createNewChat(JSON.parse(message?.data));
});

socket.addEventListener("close", () => {
  console.log("Disconnected with server.");
});

const createNewChat = ({ message }) => {
  // Create new chat element by li tag.
  const li = document.createElement("li");
  li.innerText = `${message}`;

  // Append child element.
  chatContainer.appendChild(li);

  window.scrollTo(0, document.body.scrollHeight);
};

const chatForm = document.querySelector(".chat__form");

const onSubmit = (event) => {
  event.preventDefault();

  const input = event.target.querySelector("input");
  // Send text to Web socket.
  socket.send(input?.value);
  // Clear input value.
  input.value = "";
};

chatForm.addEventListener("submit", onSubmit);
