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
function horizontalMovement(r, x){
    if(r + x >= 600){
        horizontal = false;
    }
    else if(-r + x <= 0){
        horizontal = true;
    }
    if(r + x <= 600 && horizontal === true){
        x += 4;
    }
    else if(r + x >= 0 && horizontal === false){
        x -= 2;
    }
    return x;
}
function verticalMovement(r, y){
    if(r + y >= 600){
        vertical = false;
    }
    else if(-r + y <= 0){
        vertical = true;
    }
    if(r + y <= 600 && vertical === true){
        y += 2;
    }
    else if(r + y >= 0 && vertical === false){
        y -= 3;
    }
    return y;
}
var vertical = true;
var horizontal = true;
var z = 250;
var t = 75;
var thetaA = 0;
var thetaB = 0;
var c=document.getElementById("stage");
var ctx=c.getContext("2d");

function animation(){
    updatePosition(thetaB, thetaA);
}
setInterval(function() {
    updatePosition(thetaB, thetaA)
}, 10);

function updatePosition(valA, valB){
    ctx.clearRect(0, 0, 600, 600)
    upTheta();
    z = horizontalMovement(50, z);
    t = verticalMovement(50, t);

    var b = point(60, -valA, {x:100,y:75});
    var p = point(60, valB, {x:z,y:t});

    ctx.beginPath();
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(b.x,b.y,10,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(z,t,50,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x,p.y,10,0,2*Math.PI);
    ctx.stroke();
    // if (val > Math.PI){
    //     clearInterval()
    // }
    requestanimationframe(updatePosition);
}
