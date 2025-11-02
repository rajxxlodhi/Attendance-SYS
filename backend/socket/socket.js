import http from "http"
import express from "express"
let app = express()
import { Server } from "socket.io"

const server = http.createServer(app)

const io = new Server( server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
})

export const userSocketMap = {}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!=undefined){
        userSocketMap[userId]=socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    

socket.on("disconnect",()=>{
    delete io.emit("getOnlineUsers",Object.keys(userSocketMap))
})

})




export {app, server}