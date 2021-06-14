// Identify socket connection with client-saved-id or create a new one

const io = require("./socketServer");
const uuidv4 = require("uuid").v4;

io.use((socket, next) => {
    // coming from the local storage on the client side
    const id = socket.handshake.auth.id;
    
    if (!id)
        socket.id = uuidv4();
    else
        socket.id = id;
    next();
});