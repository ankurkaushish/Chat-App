const express = require('express');
const Filter = require('bad-words');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const {generateMessage, generatelocationMessage} = require('./utils/message')
const { addUser, removeUser, getUser,  getUsersInRoom } = require('./utils/users')
const app = express();
const server = http.createServer(app)
const publicDir = path.join(__dirname, '../public');
const io = socketio(server);

app.use(express.static(publicDir))
const port = process.env.PORT || 3000 ;

let count =0;
io.on('connection', (socket)=>{
    console.log("New Connection");

    // socket.emit("countUpdated",count);

    // socket.on('increment',()=>{
    //     // socket.emit("countUpdated",++count); // Emit the event to the Single client

    //     io.emit("countUpdated",++count);
    // })

    socket.on('join', ({username,room},callback)=>{
        const {error, user} = addUser({id:socket.id, username,room})

        if(error)
        {
            return callback(error)
        }

        socket.join(user.room);
        socket.emit('message', generateMessage("Admin",'Welcome!'))
         socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))

         io.to(user.room).emit('roomData',{
             room:user.room,
             users : getUsersInRoom(user.room)
         })
        callback()

    })


    socket.on('sendMessage',(m,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(m))
        {
            return callback("Bad Words not allowed");
        }
        io.to(user.room).emit('message',generateMessage(user.username,m));
        callback()
    })

    socket.on('send-location',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generatelocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on("disconnect", ()=>{

        const user = removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',generateMessage(`${user.username} has disconnect.`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users : getUsersInRoom(user.room)
            })
        }
    })
})  

server.listen(port, ()=>{
    console.log(`Port Listening at ${port}`)
})