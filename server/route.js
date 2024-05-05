const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	// для CORS
	res.setHeader('Access-Control-Allow-Origin', '*')

	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	)

	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

	res.send('Ответ с сервера')
})

module.exports = router
