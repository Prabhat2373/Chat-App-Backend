const { Server } = require("socket.io");
const http = require("http");
const express = require("express")
const app = express();
const server = app.listen(8000);
const io = new Server(server);
console.log('server is live on :', server.address().port);
const users = {};

io.on('connection', socket => {
    //If Any New User Joins, Let Other users Connected to the server Know!
    socket.on('new-user-joined', name => {
        console.log('new-user-joined', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    // If Someone sends a message, Broadcast it to all people Which are live on the Server!
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    // If someone leaves the Chat, Let Other users Connected to the server Know!
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});