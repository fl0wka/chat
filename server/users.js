const { trimStr } = require('./utils')

let users = []

const findUser = user => {
	const userName = trimStr(user.name)
	const userRoom = trimStr(user.room)

	// Делаем проверку на наличие пользователя в нашем массиве users
	return users.find(
		u => trimStr(u.name) === userName && trimStr(u.room) === userRoom
	)
}

const addUser = user => {
	const isExist = findUser(user)

	!isExist && users.push(user)

	const currentUser = isExist || user

	// "!!" возвращает всегда булево значение
	return { isExist: !!isExist, user: currentUser }
}

const getRoomUsers = room => users.filter(u => u.room === room)

const removeUser = user => {
	const found = findUser(user)

	if (found) {
		users = users.filter(
			({ room, name }) => found.room === room && found.name !== name
		)
	}

	return found
}

module.exports = { addUser, findUser, getRoomUsers, removeUser }
