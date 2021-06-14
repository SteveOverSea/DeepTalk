const Countdown = require("./Countdown");
const config = require("./config/config");

module.exports = class Room {

    constructor(roomName, chat) {
        this.name = roomName;
        this.members = [];
        this.chat = chat;
        this.timer = new Countdown(config.TIMER_MINS, config.TIMER_SECS);
    }

    add(...clients) {
        clients.forEach(c => {
            const client = this.chat.findClient(c.socket.id);
            this.members.push(client);
            client.rooms.push(this.name);
            client.socket.join(this.name);
        });   
    }

    remove(...clients) {
        clients.forEach(client => {
            this.members = this.members.filter(m => m.socket.id != client.socket.id);
            client.socket.leave(this.name);
        }); 
    }

    kickout() {
        const members = this.members;
        this.remove(...this.members);
        return members;
    }

    getMemberIds() {
        return this.members.map(member => member.socket.id);
    }

    startTimer() {
        this.timer.start();
        this.timer.intervalCallback = () => 
            this.chat.server.to(this.name)
                .emit("countdown", this.timer.minutes, this.timer.seconds);
        this.timer.endCallback = () => this.chat.server.to(this.name).emit("countdown-end");
    
    }

    stopTimer() {
        this.timer.stop();
        this.chat.server.to(this.name).emit("countdown-end");
    }
}