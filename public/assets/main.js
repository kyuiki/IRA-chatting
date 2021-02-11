
$(function(){
    var socket = io();
    var timePhone = setInterval(function(){
        $("#time-phone").html(timeClock());
        if(!socket.connected) {
            $("#signal-phone").attr({src:"assets/img/sinyal_4.png"});
            $("p#typing-stat").text("❌ Disconnected!");
    }
    },1000);
    $(".textarea").on("input",(e)=>{
        socket.emit('is-typing', {name:localStorage["username"]});
    })
    try{
    navigator.getBattery().then(function(bt) {
        batteryUpdate();
        bt.addEventListener('levelchange', function(){
            batteryUpdate()
        })
        function batteryUpdate(){
            $("#battery-phone").attr({src:"assets/img/"+battery(bt.level *4)});
        }
      
      });
    }catch(err){
        alert(err)
    }
});

function timeClock(){
    var time = new Date();
    return `${time.getHours().toString().length<2?"0"+time.getHours():time.getHours()}:${time.getMinutes().toString().length<2?"0"+time.getMinutes():time.getMinutes()}`
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
function battery(strength){
    let out = "baterai_3";
    switch (Math.floor(strength)) {
        case 4:
        case 3:
            out = "baterai_0"
            break;
        case 2:
            out = "baterai_1"
            break;
        case 1:
            out = "baterai_2"
            break;
        default:
            break;
    }
    return out + ".png"
}

function sendMessage(e, socket){
    e.preventDefault(); // prevents page reloading
    var name = localStorage["username"];
    var time = new Date();
    socket.emit('send-message', { name : name ,content : $('.textarea').val()});
    appendMsg(1,{name:"You",content:window.markdownit({ html: false, linkify: true, typographer: true, breaks:true }).render($('.textarea').val()),timestamp:time})
    $('.textarea').val('');
}
function changeData(type,id){
    localStorage[type] = $(id).val();
}
function changeCSS(id, styleobj){
/* var newStyleElement = $("head").children(':last');
 newStyleElement.html(`${data} {}`);*/
 $(id).css(styleobj)

}