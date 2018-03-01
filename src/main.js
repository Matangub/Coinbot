// Start coding here

import express from 'express';
import mainController from '../controllers/main'

const port = process.env.PORT || 3000
const app = express()

app.use('/', express.static('public'))
app.use('/main', mainController)

app.listen(port)

console.log(`server listening @ http://localhost:${port}`)
