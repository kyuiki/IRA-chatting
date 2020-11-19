import * as express from "express";
import * as path from "path";
import * as http from "http";

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on('connection', (socket) => {
    console.log("User Connected");
    socket.emit("system-msg", {content : 'Seseorang Connected'});

    socket.on('send-message', (msg) => {socket.broadcast.emit('send-message', {name:(msg["name"]||"Anonymous"),timestamp: new Date(),content:msg["content"]});});
    socket.on("disconnect", ()=> {socket.emit("system-msg", {content:"Seseorang Disconnect"})});

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