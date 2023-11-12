const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();

const PORT = 5000;
const route = require('./route');
const { addUser } = require('./users');

app.use(cors({ origin: '*' }));
app.use(route);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // коннектимся к сокету и забираем данные
  socket.on('join', ({ name, room }) => {
    // подключаемся с помощью метода join к комнате
    socket.join(room);

    const { user } = addUser({ name, room });
    console.log(user.name);

    // далее делаем emit на сторону клиента
    socket.emit('message', {
      data: {
        user: { name: 'Admin' },
        message: `Добро пожаловать ${user.name}`,
      },
    });

    // отправляем admin сообщения не только в чат вошедшего пользователя, но и в чаты других участников
    socket.broadcast.to(user.room).emit('message', {
      data: {
        user: { name: 'Admin' },
        message: `К чату присоединился ${user.name}`,
      },
    });
  });

  io.on('disconnect', () => {
    console.log('Disconnect');
  });
});

server.listen(PORT, () => {
  console.log('Server is running');
});
