import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import EmojiPicker from 'emoji-picker-react'
import Messages from '../components/ui/Messages'

import icon from '../assets/image/emoji.svg'
import styles from '../assets/styles/Chat.module.css'

const socket = io.connect('http://localhost:5000')

const Chat = () => {
	const { search } = useLocation()
	const navigate = useNavigate()
	const [params, setParams] = useState({ room: '', user: '' })
	const [state, setState] = useState([])
	const [message, setMessage] = useState('')
	const [isOpen, setOpen] = useState(false)
	const [usersNum, setUsersNum] = useState(0)

	useEffect(() => {
		// Преобразуем строку search в объект
		const searchParams = Object.fromEntries(new URLSearchParams(search))
		setParams(searchParams)

		// Передаем на бэк параметры (юзер, комната)
		socket.emit('join', searchParams)
	}, [search])

	useEffect(() => {
		socket.on('message', ({ data }) => {
			// префикс "_" говорит нам, что эти элементы считаются приватными и должны использоваться только внутри своей области видимости.
			setState(_state => [..._state, data])
		})
	}, [])

	useEffect(() => {
		socket.on('room', ({ data: { users } }) => {
			setUsersNum(users.length)
		})
	}, [])

	const leftRoom = () => {
		socket.emit('leftRoom', { params })
		// Редирект на main page
		navigate('/')
	}
	const handleChange = ({ target: { value } }) => {
		setMessage(value)
	}
	const handleSubmit = e => {
		e.preventDefault()

		if (!message) return

		socket.emit('sendMessage', { message, params })

		setMessage('')
	}
	const handleEmojiClick = ({ emoji }) => {
		setMessage(`${message} ${emoji}`)
	}
	const handleClick = () => {
		setOpen(!isOpen)
	}

	return (
		<div className={styles.wrap}>
			<div className={styles.header}>
				<div className={styles.title}>{params.room}</div>
				<div className={styles.title}>{usersNum} user in this room</div>
				<button className={styles.left} onClick={leftRoom}>
					Left the room
				</button>
			</div>
			<div className={styles.messages}>
				<Messages messages={state} name={params.name} />
			</div>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.input}>
					<input
						type='text'
						name='message'
						value={message}
						placeholder='Your message'
						onChange={handleChange}
						autoComplete='off'
						required
					/>
				</div>
				<div className={styles.emoji}>
					<img src={icon} alt='icon' onClick={handleClick} />

					{isOpen && (
						<div className={styles.emojies}>
							<EmojiPicker onEmojiClick={handleEmojiClick} />
						</div>
					)}
				</div>
				<div className={styles.button}>
					<input type='submit' value='Send a message' />
				</div>
			</form>
		</div>
	)
}

export default Chat
