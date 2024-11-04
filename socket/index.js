const socket = require("socket.io")
const http = require('http')
const { server } = require('socket.io')
const onlineUsers = [];
const rooms = {};

const addUser = (user, room, socketId) => {
    if (!user || !room) return { error: "User and room are required" };
    const exists = onlineUsers.findIndex((item) => item.uid === user.uid);
    if (exists !== -1 && onlineUsers[exists].room === room) {
        onlineUsers.splice(exists, 1);
        const roomUserIndex = rooms[room].findIndex((item) => item.uid === user.uid);
        rooms[room].splice(roomUserIndex, 1);
    }
    user.socketId = socketId;
    if (!rooms[room]) {
        rooms[room] = [];
    }
    rooms[room].push(user);
    user.room = room;
    onlineUsers.push(user);
};
const socketInit = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
    })
    io.on("connection", (socket) => {
        console.log('A user connected:', socket.id);
        socket.on("join_room", (user, room) => {
            addUser(user, room.room, socket.id)
            console.log("user was connected", user.displayName)
            socket.join(room.room)
            io.in(room.room).emit("USER_ADDED", onlineUsers)
        });
        socket.on("SEND_MSG", (msg, room) => {
            console.log("Message received: ", msg)
            io.in(room.room).emit("RECEIVED_MSG", msg)
        })
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}

module.exports = socketInit
