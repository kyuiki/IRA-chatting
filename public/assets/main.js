$(function(){
    var timePhone = setInterval(function(){
        $("#time-phone").html(timeClock())
    },1000);
    if(!localStorage["username"]){
        localStorage.setItem("username",prompt("Tolong masukan nama kamu :D"))
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