
$(function(){
        var socket = io();
        var md = window.markdownit();
        
        if(!localStorage["username"]){
            localStorage.setItem("username",prompt("Whats your name? :D"))
        }
        $('#oldName-show').text(localStorage["username"])
        
        socket.emit('new-connect',localStorage["username"])
        $('form#send-message').submit(e=>sendMessage(e, socket));
        $('textarea.textarea').on('keypress',function(e) {
            if(e.which == 13 && !e.shiftKey) {sendMessage(e, socket)};
        });

        //ping
        socket.on("ping-send", function(stat){
            $("p#typing-stat").text(stat.count+" Connected");
            var ping1 = new Date().getTime();
            $("#net-stat").text(Math.abs(ping1 - stat.time))
            $("#signal-phone").attr({src:"assets/img/"+signal(Math.abs(ping1 - stat.time)/400)});
        })
        socket.on('send-message', function(msg){
            appendMsg(0, msg)
            $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
        })
        socket.on('system-bot-msg', function(msg){
            appendMsg(2, msg)
            $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
        })
        socket.on('system-msg', function(msg){
            console.log("ok")
            $(".chatting-pool").append($("<div class=\"bubble-chat system-msg\">").text(`${msg.content}`));
            $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
        });
        var isRunning = false;
        socket.on('is-typing', function(nu){
            $("p#typing-stat").text(nu);
            if(isRunning) return false
            isRunning = true
            setTimeout(()=>{
                $("p#typing-stat").text("Connected");
                isRunning =false;
            },500)
        })
        sendPings();
        function sendPings(){
            function pinging(){
                var sendPing = new Date().getTime();
                socket.emit("ping-send",{time:sendPing});
            }
            pinging()
            setInterval(()=>pinging(),2000);
        }
    });
    

function timestamp(timestamp){
    var time = new Date(timestamp);
    console.log(time);
    return `${time.getHours().toString().length<2?"0"+time.getHours():time.getHours()}:${time.getMinutes().toString().length<2?"0"+time.getMinutes():time.getMinutes()}`
}
function appendMsg(type,msg){
    let msgClass = "";
    if(type==1) msgClass = "your-message";
    if(type==2) msgClass = "bot-message";
    $(".chatting-pool").append($("<div class=\"w-100\">")
    .append($(`<div class="bubble-chat ${msgClass}">`)
    .append($("<div class=\"header\">").html(`<img class="delete_btn cool-shadow-sm" onclick="$(this).parent().parent().parent().remove()" src="assets/img/del_gui.png">`)
    .append($("<span>").append($("<b>").text(msg.name+" ")))
    .append($("<span>").text(timestamp(msg.timestamp)))
    .append($("<div class=\"content\">").append($("<p>").html(msg.content)))))
    );
    $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
}
function signal(strength){
    let out = "sinyal_3";
    switch (Math.floor(strength)) {
        case 0:
            out = "sinyal_0"
            break;
        case 1:
            out = "sinyal_1"
            break;
        case 2:
            out = "sinyal_2"
            break;
        default:
            break;
    }
    return out + ".png"
}