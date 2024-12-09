const socket = require("socket.io");

// Global variables
global.rooms = new Map();
global.onlineUsers = new Map();

const addUser = (user, roomId, socketId) => {
    if (!user || !roomId) return { error: "User and room are required" };

    // Ensure the room exists in the global.rooms Map
    if (!global.rooms.has(roomId)) {
        global.rooms.set(roomId, []);
    }

    // Get the room's user list
    const roomUsers = global.rooms.get(roomId);

    // Check if the user is already in the room
    const existingUserIndex = roomUsers.findIndex((item) => item.uid === user.uid);
    if (existingUserIndex !== -1) {
        // Remove the user from the room if they already exist
        roomUsers.splice(existingUserIndex, 1);
    }

    // Add the user to the room and the onlineUsers Map
    user.socketId = socketId;
    roomUsers.push(user);
    global.rooms.set(roomId, roomUsers);
    global.onlineUsers.set(socketId, user);
};

const removeUser = (socketId) => {
    const user = global.onlineUsers.get(socketId);
    if (!user) return { error: "User not found" };

    // Remove the user from the specific room
    const roomId = user.roomId;
    if (global.rooms.has(roomId)) {
        const roomUsers = global.rooms.get(roomId).filter((item) => item.socketId !== socketId);
        global.rooms.set(roomId, roomUsers);

        // Clean up the room if it's empty
        if (roomUsers.length === 0) {
            global.rooms.delete(roomId);
        }
    }

    // Remove the user from the global.onlineUsers Map
    global.onlineUsers.delete(socketId);

    return { success: true, userRemoved: user };
};

const socketInit = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:3000", credentials: true, methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_room", (user, room) => {
            addUser(user, room.room.id, socket.id);

            console.log("User joined room:", room.room.id, '\nSocketId: ', socket.id);

            socket.join(room.room.id);

            // Emit the updated list of users in the room
            const roomUsers = global.rooms.get(room.room.id) || [];
            io.in(room.room.id).emit("USER_ADDED", roomUsers);
        });

        socket.on("SEND_MSG", (msg, room) => {
            console.log("Message received:", msg);
            io.in(room.room.id).emit("RECEIVED_MSG", msg);
        });
        socket.on("union_join_notification", (unionId) => {
            socket.emit()
        })
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);

            // Remove the user from global variables
            const result = removeUser(socket.id);
            if (result.success) {
                console.log("User removed:", result.userRemoved);
                const roomId = result.userRemoved.roomId;

                // Emit updated user list in the room
                const roomUsers = global.rooms.get(roomId) || [];
                io.in(roomId).emit("USER_REMOVED", roomUsers);
            } else {
                console.log("Error removing user:", result.error);
            }
        });
    });
};

module.exports = socketInit;
