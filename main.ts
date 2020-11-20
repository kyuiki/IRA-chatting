import * as express from "express";
import * as path from "path";

var md = require('markdown-it')({
    html: false,
    linkify: true,
    typographer: true,
    breaks:true
  });

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const users = {};

io.on('connection', async (socket) => {
    
    //welcome and not welcome
    socket.on('new-connect',(n)=>{
        users[socket.id] = n.replace(/\s/gi, "_");
        socket.broadcast.emit("system-msg", {content : `${users[socket.id]} Bergabung. Selamat datang!`});
    });

    //message
    socket.on('send-message', (msg) => {
        console.log(users, ` is joining...`);
        if(!msg.content) return io.to(socket.id).emit("system-bot-msg",{timestamp:new Date().getTime(),name:"Red-Creeper",content:"Your message wasnt send! you were sending the blank message!"});
        socket.broadcast.emit('send-message', {name:(users[socket.id]?users[socket.id]:"Anonymous"),timestamp: new Date(),content:md.render(msg["content"])});
    });
    socket.on('is-typing',d=>{
        users[socket.id] = d.name.replace(/\s/gi, "_");
        socket.broadcast.emit('is-typing', `${d.name.replace(/\s/gi, "_")} is typing...`);
    });
    //ping
    socket.on("ping-send",d=>{
        if(!d["time"] || typeof d["time"] != 'number' || d["time"].toString().length > 100 || (d["time"] - new Date().getTime()) > 100000) return io.to(socket.id).emit("system-bot-msg",{timestamp:new Date().getTime(),name:"Red-Creeper",content:`Invalid Ping Date range! Time Lagged out ${d["time"] - new Date().getTime()} ms behind`});
        io.to(socket.id).emit("ping-send",d);
    })
    
    socket.on("disconnect", ()=> {
        if(!users[socket.id]) return;
        socket.broadcast.emit("system-msg", {content:`${users[socket.id]} Keluar. Sampai jumpa`});
        delete users[socket.id]
    });
});

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res)=>{
    res.render("index.ejs")
});
app.get("*", (req, res) => {
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ&hmm=too_curious_huh")
})

server.listen((process.env.PORT||"6942"), ()=>{console.log("Ok its running!")})

interface usersData {
    name : string,
    id : string,
    theme : {
        boxColor: string|number,
        nickColor: string|number
    }
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}