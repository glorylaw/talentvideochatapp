const express = require("express")
const http = require("http")
const app = express()
const cors = require("cors");
const server = http.createServer(app)
//const socket = require("socket.io")

app.use(cors());

const io = require("socket.io")(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    socket.emit("me", socket.id)
    console.log(`User Connected: ${socket.id}`);

    socket.on("disconnect", ()=> {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data)=> {
        io.to(data.userToCall).emit("callUser", { signal:data.signalData, from:data.from, name:data.name})
    })

    socket.on("answerCall", (data)=> {
        io.to(data.to).emit("callAccepted", data.signal)
    })

    socket.on("endCall", ({ id }) => {
        io.to(id).emit("endCall");
      });
    
      socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
    
      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });
    
      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });

    

})


server.listen(5500, ()=> console.log("server is running on port 5500"))