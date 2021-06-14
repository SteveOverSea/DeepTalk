const io = require("./socketServer");
const Chat = require("./Chat");
const Client = require("./Client");

const chat = new Chat(io);

const waitingRoom = chat.createRoom("waitingroom");

io.on("connection", clientSocket => {

    const client = new Client(clientSocket);

    chat.addClient(client);
    console.log(`user id ${client.socket.id} connected`);
      
    waitingRoom.add(client);

    // join chat room if ready to chat
    clientSocket.on("ready-to-chat", id => {
        console.log(`${id} is ready to chat`);

        if (chat.readyClients.length) {
            chat.setupChatroomWith(id);
        } else {
            chat.findClient(id).canChat = true;
        }
    });
    
    // listen to chat messages if in chatroom
    clientSocket.on("chat-message", msg => {
        client.sendMessage(msg);
    });

    // leave chat room and join waiting room again if leave
    clientSocket.on("abort-chat", () => {
        const chatpartners = client.chatroom.kickout();
        waitingRoom.add(...chatpartners);
    });

    clientSocket.on("disconnect", () => {
        console.log(`user id ${client.id} disconnected`);
        chat.removeClient(client);
    });
});