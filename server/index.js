const express = require('express')
const http = require('node:http')
const { Server } = require('socket.io')
const cors = require('cors')
const app = express()

const PORT = 5000
const route = require('./route')
const { addUser, findUser, getRoomUsers, removeUser } = require('./users')

app.use(cors({ origin: '*' }))
app.use(route)

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', socket => {
	// коннектимся к сокету и забираем данные
	socket.on('join', ({ name, room }) => {
		// подключаемся с помощью метода join к комнате
		socket.join(room)

		const { user, isExist } = addUser({ name, room })
		const userMessage = !isExist
			? `Добро пожаловать ${user.name}`
			: `С возвращением ${user.name}`

		// далее делаем emit на сторону клиента
		socket.emit('message', {
			data: {
				user: { name: 'Admin' },
				message: userMessage,
			},
		})

		// отправляем admin сообщения не только в чат вошедшего пользователя, но и в чаты других участников
		socket.broadcast.to(user.room).emit('message', {
			data: {
				user: { name: 'Admin' },
				message: `К чату присоединился ${user.name}`,
			},
		})

		io.to(user.room).emit('room', {
			data: { users: getRoomUsers(user.room) },
		})
	})

	socket.on('sendMessage', ({ message, params }) => {
		const user = findUser(params)

		if (user) {
			io.to(user.room).emit('message', { data: { user, message } })
		}
	})

	socket.on('leftRoom', ({ params }) => {
		const user = removeUser(params)

		if (user) {
			const { room, name } = user

			io.to(room).emit('message', {
				data: {
					user: { name: 'Admin' },
					message: `${name} покинул(а) чат`,
				},
			})

			io.to(room).emit('room', {
				data: { users: getRoomUsers(room) },
			})
		}
	})

	io.on('disconnect', () => {
		console.log('Disconnect')
	})
})

server.listen(PORT, () => {
	console.log('Server is running')
})
