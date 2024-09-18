const express = require('express')
const app = express()

port = 4000

app.get('/', (req, res, next) => {
    console.log("we hit this endpoint!")
    res.send('Getting workplace info!')
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})