import { Navigate } from 'react-router-dom'
import Main from './pages/Main'
import Chat from './pages/Chat'

export const routes = [
	{ path: '/', element: <Main></Main> },
	{ path: 'chat', element: <Chat></Chat> },
	{ path: '*', element: <Navigate to='/' /> },
]
