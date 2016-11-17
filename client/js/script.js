class Circle {
    constructor(r, x, y, vx, vy) {
        this.r = r
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }
}

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
function horizontalMovement(circle){
    if(circle.r + circle.x >= 600){
        horizontal = false;
    }
    else if(-circle.r + circle.x <= 0){
        horizontal = true;
    }
    if(circle.r + circle.x <= 600 && horizontal === true){
        circle.x += circle.vx;
    }
    else if(circle.r + circle.x >= 0 && horizontal === false){
        circle.x -= circle.vx;
    }
    return circle.x;
}
function verticalMovement(circle){
    if(circle.r + circle.y >= 600){
        vertical = false;
    }
    else if(-circle.r + circle.y <= 0){
        vertical = true;
    }
    if(circle.r + circle.y <= 600 && vertical === true){
        circle.y += circle.vy;
    }
    else if(circle.r + circle.y >= 0 && vertical === false){
        circle.y -= circle.vy;
    }
    return circle.y;
}

var circles = []

var vertical = true;
var horizontal = true;
circles.push(new Circle(50, 100, 75, 6, 6))
circles.push(new Circle(50, 250, 75, 2, 8))
var thetaA = 0;
var thetaB = 0;
var c=document.getElementById("stage");
var ctx=c.getContext("2d");

window.requestAnimationFrame(function() {
    updatePosition(thetaB, thetaA)
})

function updatePosition(valA, valB){
    ctx.clearRect(0, 0, 600, 600)
    upTheta();

    for (c in circles) {
        //console.log(circles[c].x,circles[c].y,circles[c].r)
        horizontalMovement(circles[c]);
        verticalMovement(circles[c]);

        ctx.beginPath();
        ctx.arc(circles[c].x,circles[c].y,circles[c].r,0,2*Math.PI);
        ctx.stroke();

        var b = point(circles[c].r+10, -valA, {x:circles[c].x,y:circles[c].y});

        ctx.beginPath();
        ctx.arc(b.x,b.y,10,0,2*Math.PI);
        ctx.stroke();
        //console.log(b)
    }
    window.requestAnimationFrame(function() {
        updatePosition(thetaB, thetaA)
    })
}
