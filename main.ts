import * as express from "express";
import * as path from "path";
import * as mdiv from "markdown-it-video";
const f = require("./lib/badword.ts");
const Database = require("@replit/database");
const db = new Database()



var md = require('markdown-it')({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true
}).use(mdiv, {
  youtube: { width: 640, height: 390 },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 }
});

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const users = {};
const cooldown = {};
var countUser = 0;
io.on('connection', async (socket) => {

    //welcome and not welcome
    socket.on('new-connect', (n) => {
        users[socket.id] = n.replace(/([^A-Za-z0-9])/g, "X").replace(/\s/gi, "_");
        countUser++;
        socket.broadcast.emit("system-msg", {
            content: `${users[socket.id]} Joined the Group! ${countUser} users Connected!`
        });
    });

    //message
    socket.on('send-message', (msg) => {
        users[socket.id] = msg.name.replace(/([^A-Za-z0-9])/g, "X").replace(/\s/gi, "_");
        var detect = f.detectBadWord(msg.content);
        if (!msg.content || cooldown[socket.id]) return io.to(socket.id).emit("system-bot-msg", {
            timestamp: new Date().getTime(),
            name: "Red-Creeper",
            content: cooldown[socket.id] ? "Your message wasnt send! You were sending message too fast! 0.5 Second Cooldown" : "Your message wasnt send! you were sending the blank message!"
        });
        if (detect.bool) return io.to(socket.id).emit("system-bot-msg", {
            timestamp: new Date().getTime(),
            name: "Red-Creeper",
            content: `Your message wasnt send! You was tried to say "${detect.output}" which isnt allowed`
        });
        cooldown[socket.id] = true;
        socket.broadcast.emit('send-message', {
            name: (users[socket.id] ? users[socket.id] : "Anonymous"),
            timestamp: new Date(),
            content: md.render(msg["content"])
        });
        setTimeout(() => delete cooldown[socket.id], 500)
    });
    socket.on('is-typing', d => {
        socket.broadcast.emit('is-typing', `${d.name.replace(/([^A-Za-z0-9])/g, "X").replace(/\s/gi, "_")} is typing...`);
    });
    //ping
    socket.on("ping-send", d => {
        if (!d["time"] || typeof d["time"] != 'number' || d["time"].toString().length > 100 || (d["time"] - new Date().getTime()) > 100000) return io.to(socket.id).emit("system-bot-msg", {
            timestamp: new Date().getTime(),
            name: "Red-Creeper",
            content: `Invalid Ping Date range! Time Lagged out ${d["time"] - new Date().getTime()} ms behind`
        });
        d["count"] = countUser;
        io.to(socket.id).emit("ping-send", d);
    })

    socket.on("disconnect", () => {
        if (!users[socket.id]) return;
        countUser--;
        socket.broadcast.emit("system-msg", {
            content: `${users[socket.id]} left the group! ${countUser} users Connected!`
        });
        delete users[socket.id];
    });
});

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    console.log(req.ip)
    res.render("index.ejs")
});
app.get("*", (req, res) => {
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ&hmm=too_curious_huh")
})

server.listen((process.env.PORT || 6942), () => {
    console.log("Ok its running! " +(process.env.PORT || 6942))
})

interface usersData {
    name: string,
        id: string,
        theme: {
            boxColor: string | number,
            nickColor: string | number
        }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}