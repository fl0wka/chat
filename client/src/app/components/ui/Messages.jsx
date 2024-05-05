import React from 'react'

import styles from '../../assets/styles/Messages.module.css'

function Messages({ messages, name }) {
	return (
		<div className={styles.messages}>
			{messages.map(({ message, user }) => {
				const itsMe =
					user.name.trim().toLowerCase() === name.trim().toLowerCase()
				const className = itsMe ? styles.me : styles.user

				return (
					<div key={message} className={`${styles.message} ${className}`}>
						<span className={styles.user}>{user.name}</span>
						<div className={styles.text}>{message}</div>
					</div>
				)
			})}
		</div>
	)
}

export default Messages
