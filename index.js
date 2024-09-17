const express = require('express')
const app = express()

port = 3000

app.get('/', (req, res, next) => {
    res.send('Getting workplace info!')
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})