const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

function backendDone(msg) {
    console.log(`msg: `, msg);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, backendDone);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
// websocket 사용 시
// const messageList = document.querySelector('ul');
// const nickForm = document.querySelector('#nick');
// const messageForm = document.querySelector('#message');
// const h2 = document.querySelector('h2');

// function makeMessage(type, payload) {
//     const msg = { type, payload };
//     return JSON.stringify(msg);
// }

// const url = window.location.host
// const socket = new WebSocket(`ws://${url}`);

// function handleOpen() {
//     console.log('Connected to Server 😀');
// }

// socket.addEventListener('open', handleOpen);

// socket.addEventListener('message', (message) => {
//     const li = document.createElement('li');
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener('close', () => {
//     console.log('Disconnected from Server ❌');
// });

// function handleSubmit(event) {
//     event.preventDefault();
//     const input = messageForm.querySelector('input');
//     socket.send(makeMessage('new_message', input.value));
//     const li = document.createElement('li');
//     li.innerText = `You: ${input.value}`;
//     messageList.append(li);
//     input.value = '';
// }

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector('input');
//     socket.send(makeMessage('nickname', input.value));
//     h2.textContent = input.value;
//     input.value = '';
// }

// messageForm.addEventListener('submit', handleSubmit);
// nickForm.addEventListener('submit', handleNickSubmit);