// initialise socket and make available

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

export default socket;