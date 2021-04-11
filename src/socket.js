import io from "socket.io-client";
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const ENDPOINT = "https://protected-chamber-35794.herokuapp.com";
let socket;

const connectSocket = () => {
  socket = io.connect(ENDPOINT, connectionOptions);
};
export { socket, connectSocket };
