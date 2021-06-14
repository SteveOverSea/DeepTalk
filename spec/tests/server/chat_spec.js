const Chat = require("../../../src/server/Chat");
require("../../../src/server/appServer");
const socketServer = require("../../../src/server/socketServer");
const ioClient = require("socket.io-client");

describe("Testing Socket Connection", () => {
    let chat, browserSocket, clientSocket;

    beforeAll(() => {
        socketServer.on("connection", (client) => {
            console.log(`${client.id}`);
            clientSocket = client;
        });
    })

    beforeEach((done) => {        
        chat = new Chat(socketServer);

        browserSocket = ioClient.connect('http://localhost:3000');

        browserSocket.on('connect', function() {
            console.log("connected...");
            done();
        });

        browserSocket.on('disconnect', function() {
            console.log('disconnected...');
            done();
        });
    })

    it("should add client to chat class", () => {
        chat.addClient(clientSocket);
        expect(chat.clients.length).toBe(1);
    })

    it("should remove client from chat class", () => {
        chat.addClient(clientSocket);
        expect
        chat.removeClient(clientSocket);
        expect(chat.clients.length).toBe(0);
    })

    it("should find client by id", () => {
        clientSocket.id = "99";
        chat.addClient(clientSocket);
        const foundClient = chat.findClient("99");
        expect(foundClient.socket).toBe(clientSocket);
    })

    it("should add client to chatroom", () => {
        const name = "chatroom";
        chat.createRoom(name).add(clientSocket);
        expect(clientSocket.rooms.has(name)).toBe(true);
    })
})