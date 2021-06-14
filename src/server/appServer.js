// the server the frontend is running on

const express = require("express");
const app = express();
//const server = require("http").createServer(app);

const config = require("./config/config");

app.use(express.static("src/client"));

app.listen(config.SERVER_PORT, () => {
    console.log(`App-Server listening on ${config.URL}:${config.SERVER_PORT}`);
});