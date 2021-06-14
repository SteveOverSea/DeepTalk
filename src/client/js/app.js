import socket from "./socket.js";
import * as dom from "./dom.js";
import Countdown from "./Countdown.js";


let countdownTimer; // too public?

document.addEventListener("DOMContentLoaded", startApp);

function startApp() {

    dom.init();

    // Socket Authentication via localstorage.id 
    // (can be empty - new id will be created)
    socket.auth = { id: localStorage.id }
    socket.connect();

    socket.on("authenticate", id => {
        localStorage.setItem("id", id);
    });

    // dom waiting list is just for debugging!
    socket.on("join", (joinedId, joinedRoom, roomMembers) => {
        if (joinedRoom == "waitingroom") {
            console.log(`${joinedId} joined waiting room.`);
    
            if (joinedId == socket.id) {
                dom.disableChatForm();
                socket.ready = false;
    
                // add self to waiting list
                dom.appendWaiting(socket.id, true);
                // add others already waiting to waiting list
                if(roomMembers)
                    roomMembers.filter(id => id != socket.id).forEach(id => dom.appendWaiting(id, false));
    
            } else {
                // add new joined user to list if not already
                if (dom.getWaitingUsers().map(el => el.textContent).indexOf(joinedId) == -1) {
                    dom.appendWaiting(joinedId, false);
                }
            }
    
            // check if enough users and ask if ready
            if (!socket.ready && roomMembers && roomMembers.length >= 2)
                checkReadyToChat();

        } else if (joinedRoom.includes("chatroom")) {
            console.log(`${joinedId} joined chat room.`);
            if(joinedId == socket.id) {
                // enable form and show leave button
                dom.enableFormAndShowLeaveButton();
            }
        }
    });

    let countdown;

    socket.on("countdown", (minutes, seconds) => {
        dom.setCountdownText(minutes, seconds);
    });

    socket.on("countdown-end", () => {
        socket.emit("abort-chat");
    });

    // other sockets leave waiting room
    socket.on("leave", (leftId, leftRoom) => {
        if (leftRoom == "waitingroom") {
            console.log(`${leftId} left waiting room`);
            dom.removeFromWaitingList(leftId);
        } else if (leftRoom.includes("chatroom")) {
            dom.reset();
        }
    });

    socket.on("new-chat-message", msg => dom.appendMessage(msg, false));    

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });
}

function checkReadyToChat() {
    let isReady = prompt("Ready to chat? (Say \"ok\")");

    if(isReady === "ok") {
        socket.ready = true;
        socket.emit("ready-to-chat", socket.id);
    }
}