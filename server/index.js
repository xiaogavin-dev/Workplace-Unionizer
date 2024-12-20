require('dotenv').config({ path: `${process.cwd()}/.env` })
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const http = require('http');
const socketInit = require("./socket/index")

// ROUTERS
const unionRouter = require('./route/unionRoute')
const userRouter = require('./route/userRoute')
const messageRouter = require('./route/messageRoute')
const chatRouter = require('./route/chatRoute')
const formRoute = require('./route/formRoute');
const workplaceRoutes = require('./route/workplaceRoute');
const inviteRoutes = require("./route/inviteRoute");
const pollRoute = require('./route/pollRoute');
const app = express();
app.use(express.json());
app.use(cors());


const server = http.createServer(app);

const port = process.env.PORT || 5000;


app.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Query the database for the user
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [username]);

    // Check if the user exists
    if (result.rowCount === 0) {
      console.log("User not found");
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare the submitted password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If login is successful, respond with success
    console.log("Login successful");
    return res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Use the unionRouter for all routes starting with /union
app.use('/union', unionRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter)
app.use('/chat', chatRouter)
app.use('/form', formRoute);
app.use('/workplace', workplaceRoutes);
app.use("/api/invites", inviteRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/polls', pollRoute);

// Catch-all 404 route
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "route not found"
  });
});

server.listen(port, () => {
  socketInit(server)
  console.log(`App is listening on port ${port}`);
});
