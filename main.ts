import * as express from "express";
import * as path from "path";

var md = require('markdown-it')({
    html: false,
    linkify: true,
    typographer: true
  });

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const users = {};

io.on('connection', (socket) => {
    //welcome and not welcome
    socket.on('new-connect',(n)=>{
        users[socket.id] = n;
        socket.broadcast.emit("system-msg", {content : `${users[socket.id]} Bergabung. Selamat datang!`});
    });
    socket.on("disconnect", ()=> {
        console.log(socket.id)
        socket.broadcast.emit("system-msg", {content:`${users[socket.id]} Keluar. Sampai jumpa`});
        delete users[socket.id];
    });

    //message
    socket.on('is-typing',()=>{socket.broadcast.emit('is-typing', {n:users[socket.id]});})

    socket.on('send-message', (msg) => {
        if(!msg.content) return null;
        socket.broadcast.emit('send-message', {name:(users[socket.id]?users[socket.id]:"Anonymous"),timestamp: new Date(),content:md.render(msg["content"])});
    });

    setInterval(()=> {
        socket.emit("ping-stat",{time:new Date().getTime()})
    },1000);
});

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res)=>{
    res.render("index.ejs")
});

server.listen((process.env.PORT||"6942"), ()=>{console.log("Ok its running!")})