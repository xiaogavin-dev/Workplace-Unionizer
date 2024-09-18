const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

port = 4000

app.get('/', (req, res, next) => {
    console.log("we hit this endpoint!")
    res.status(200).json({ message: "request received" })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})