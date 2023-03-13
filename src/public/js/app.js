const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const nickname = document.getElementById("nickname");
const room = document.getElementById("room");

nickname.hidden = true;
room.hidden = true;

let roomName;

function addMessage(message, type) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.classList.add(type);
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`나: ${value}`, "my");
    });
    input.value = "";
}

function handleNickNameSubmit(event) {
    event.preventDefault();
    const input = nickname.querySelector("form input");
    document.querySelector("h2").textContent = `닉네임: ${input.value}`;
    socket.emit("nickname", input.value, roomName, showRoom);
}

function showRoom() {
    nickname.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.textContent = `Room Name: ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function showNickName() {
    welcome.hidden = true;
    nickname.hidden = false;
    const nickNameForm = nickname.querySelector("form");
    nickNameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enter_room", input.value, showNickName);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`-- ${user} 님이 입장하였습니다. 부대 차렷!! --`, "server");
});

socket.on("bye", (left) => {
    addMessage(`-- ${left} 님이 떠났습니다. ㅠㅠ --`, "server");
});

socket.on("new_message", (msg) => {
    addMessage(msg, "you")
});
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