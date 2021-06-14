const Room = require("./Room");

module.exports = class Chat {
    
    constructor(serverSocket) {
        this.server = serverSocket;
        this.clients = [];
        this.rooms = [];

        this._setupRoomListeners();
        this.chatCount = 1;
    }

    addClient(client) {
        client.authenticate();
        this.clients.push(client);
    }

    removeClient(client) {
        this.removeFromRooms(client);
        this.clients = this.clients.filter(c => c.socket.id != client.socket.id);
    }

    removeFromRooms(...clients) {
        clients.forEach(client => {
            this.findClient(client.socket.id).rooms.forEach(room => this.findRoom(room).remove(client));
        });
    }

    setupChatroomWith(id) {
        const client1 = this.findClient(id);
        const client2 = this.readyClients.shift();

        this.removeFromRooms(client1, client2);

        const chatroom = this.createChatroom();
        client1.chatroom = chatroom;
        client2.chatroom = chatroom;

        chatroom.add(client1, client2);

        chatroom.startTimer();
    }

    createChatroom() {
        const newRoom = new Room(`chatroom${this.chatCount++}`, this);
        this.rooms.push(newRoom);
        return newRoom;
    }

    createRoom(name) {
        const newRoom = new Room(name, this);
        this.rooms.push(newRoom);
        return newRoom;
    }

    findClient(id) {
        return this.clients.find(client => client.socket.id == id);
    }

    findRoom(name) {
        return this.rooms.find(room => room.name == name);
    }

    _setupRoomListeners() {
        this.server.of("/").adapter.on("join-room", (room, id) => {
            console.log(`socket ${id} has joined room ${room}`);
            
            if (this.findRoom(room))
                this.server.to(room).emit(`join`, id, room, this.findRoom(room).getMemberIds());
        });

        this.server.of("/").adapter.on("leave-room", (room, id) => {
            console.log(`socket ${id} has left room ${room}`);
            
            if (this.findRoom(room))
                this.server.to(room).emit(`leave`, id, room);
        });
    }

    get readyClients() {
        return this.clients.filter(client => client.canChat);
    }
}