
$(function(){
        var socket = io();
        
        if(!localStorage["username"]){
            localStorage.setItem("username",prompt("Siapa namamu? :D"))
        }
        socket.emit('new-connect',localStorage["username"])

        $('form#send-message').submit(e=>sendMessage(e, socket));
        $('textarea.textarea').on('keypress',function(e) {
            if(e.which == 13) {sendMessage(e, socket)};
        });

        socket.on("ping-stat", function(stat){
            var ping1 = new Date().getTime();
            $("#net-stat").text(Math.abs(ping1 - stat.time))
            $("#signal-phone").attr({src:"assets/img/"+signal(Math.abs(ping1 - stat.time)/250)});
        })
        socket.on('send-message', function(msg){
            appendMsg(0, msg)
            $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
        })
        socket.on('system-msg', function(msg){
            $(".chatting-pool").append($("<div class=\"bubble-chat system-msg\">").text(`${msg.content}`));
            $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
        });
        var isRunning = false;
        socket.on('is-typing', function(n){
            $("p#typing-stat").text(n+" is Typing...");
            if(isRunning) return false
            isRunning = true
            setTimeout(()=>{
                $("p#typing-stat").text("Connected");
                isRunning =false;
            },250)
        })
    });
    

function timestamp(timestamp){
    var time = new Date(timestamp);
    console.log(time);
    return `${time.getHours().toString().length<2?"0"+time.getHours():time.getHours()}:${time.getMinutes().toString().length<2?"0"+time.getMinutes():time.getMinutes()}`
}
function appendMsg(type,msg){
    let msgClass = "";
    if(type==1) msgClass = "your-message";
    $(".chatting-pool").append($("<div class=\"w-100\">")
    .append($(`<div class="bubble-chat ${msgClass}">`)
    .append($("<div class=\"header\">").append($("<span>").append($("<b>").text(msg.name+" ")))
    .append($("<span>").text(timestamp(msg.timestamp)))
    .append($("<div class=\"content\">").append($("<p>").html(msg.content)))))
    );
    $(".chatting-pool").scrollTop(function() { return this.scrollHeight; });
}