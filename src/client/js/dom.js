import socket from "./socket.js";

let msgContainer, waitingContainer, form, input, sendButton, leaveButton, countdown;

export function init() {
    form = document.getElementById("chat-form");
    input = document.getElementById("message-input");
    sendButton = document.getElementById("send-button");
    leaveButton = document.getElementById("leave-button");
    countdown = document.getElementById("countdown");
    waitingContainer = document.getElementById("waiting-room-container");
    msgContainer = document.getElementById("chat-messages-container");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const message = input.value;
        socket.emit("chat-message", message);
        appendMessage(message, true);
        input.value = "";

    });

    leaveButton.addEventListener("click", e => {
        socket.emit("abort-chat");
    });
}

export function reset() {
    const ps = document.querySelector("#waiting-room-container p")
    
    for (let i=0; i<ps.length; i++) {
        ps[i].remove();
    }
    resetCountdownText();
}

export function disableChatForm() {
    sendButton.disabled = true;
    input.value = "waiting for chat partner...";
    input.disabled = true;
    document.querySelector("#waiting-room-container h3").textContent = "waiting room";
    msgContainer.innerHTML = "";
    leaveButton.hidden = true;
}

export function enableFormAndShowLeaveButton() {
    sendButton.disabled = false;
    input.value = "";
    input.disabled = false;
    leaveButton.hidden = false;
    document.querySelector("#waiting-room-container h3").textContent = "start chatting!";
}

export function setCountdownText(mins, seconds) {
    if (seconds > 9)
        countdown.textContent = `${mins}:${seconds}`;
    else 
        countdown.textContent = `${mins}:0${seconds}`;
}

export function resetCountdownText() {
    countdown.textContent = "";
}

export function appendWaiting(id, isSelf) {
    const idEl = document.createElement("p");
    idEl.textContent = id;
    if (isSelf) idEl.classList.add("self-waiting");
    else idEl.classList.add("other-waiting");
    waitingContainer.append(idEl);
}

export function appendMessage(msg, isSelf) {
    const msgEl = document.createElement("p");
    msgEl.textContent = msg;
    if (isSelf) msgEl.classList.add("self-message");
    else msgEl.classList.add("other-message");
    msgContainer.append(msgEl);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

export function removeFromWaitingList(id) {
    getWaitingUsers().find(el => el.textContent == id).remove();
}

export function getWaitingUsers() {
    return Array.from(document.querySelectorAll("#waiting-room-container p")) || [];
}
