function point(r, angle, center) {
    return {
        x: r*Math.cos(angle)+center.x,
        y: r*Math.sin(angle)+center.y
    };
}
function upTheta(){
    if(thetaA > Math.PI*2){
        thetaA = 0;
    }
    else if(thetaB > Math.PI*2){
        thetaB = 0;
    }
    else {
        thetaA += 0.0174533;
        thetaB += (0.0174533*2);
    }
}

var thetaA = 0;
var thetaB = 0;
var c=document.getElementById("stage");
var ctx=c.getContext("2d");


setInterval(function() {
    updatePosition(thetaB, thetaA)
}, 10);

function updatePosition(valA, valB){
    ctx.clearRect(0, 0, 600, 600)
    upTheta();

    var b = point(60, -valA, {x:100,y:75});
    var p = point(60, valB, {x:250,y:75});

    ctx.beginPath();
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(b.x,b.y,10,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(250,75,50,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x,p.y,10,0,2*Math.PI);
    ctx.stroke();
    // if (val > Math.PI){
    //     clearInterval()
    // }
}
