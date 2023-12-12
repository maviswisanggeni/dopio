import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import io from 'socket.io-client';

const transportOptions = {
  polling: {
    extraHeaders: {
      token: null,
    },
  },
};

const socketInstance = io(process.env.SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  transportOptions: transportOptions,
  secure: true,
  transports: ['polling', 'websocket'],
  // transports: ['websocket', 'polling'],
});

Vue.use(
  new VueSocketIO({
    debug: process.env.DEV,
    connection: socketInstance,
  }),
);
