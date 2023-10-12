import { io } from "socket.io-client";
import environment from "../environment";

// "undefined" means the URL will be computed from the `window.location` object

const socket = io(
  `${
    // environment.baseUrl
    environment.changableSocketUrl
  }`,
  {
    path: "/api/ws",
    autoConnect: false,
  }
);

export default socket;
