// the server the socket is running on

const config = require("./config/config");


const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: `${config.URL}:${config.SERVER_PORT}`
    }
});

server.listen(config.SOCKET_PORT, () =>
  console.log(`Socket-Server listening at ${config.URL}:${config.SOCKET_PORT}`)
);

module.exports = io;