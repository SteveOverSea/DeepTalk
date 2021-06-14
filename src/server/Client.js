module.exports = class Client {
    
    constructor(clientSocket) {
        this.socket = clientSocket;
        this.rooms = [];
        this.chatroom = null;
        this.canChat = false;
        this.inChat = false;
    }

    authenticate() {
        this.socket.emit("authenticate", this.socket.id);
    }

    sendMessage(msg) {
        this.socket.to(this.chatroom.name).emit("new-chat-message", msg);
    }

    toString() {
        return `socket-id: ${this.socket.id}`;
    }
}

