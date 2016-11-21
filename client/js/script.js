class Circle {
    constructor(r, x, y, vx, vy, up, right) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.players = []
    }
}
class Player {
    constructor(data){
        this.x = data.x;
        this.y = data.y;
        this.hitbox = 5;
        this.theta = data.theta;
    }

    updateTheta(){
        if(this.theta > Math.PI*2){
            this.theta = 0;
        }
        else {
            this.theta += 0.0174533;
            //thetaB += (0.0174533*2);
        }
    }

    updatePosition(point) {
        this.x = point.x;
        this.y = point.y;
    }
}

function point(r, angle, center) {
    return {
        x: r*Math.cos(angle)+center.x,
        y: r*Math.sin(angle)+center.y
    };
}

function horizontalMovement(circle){
    if(circle.r + circle.x >= 800 || -circle.r + circle.x <= 0){
        circle.vx = -circle.vx;
    }
    if(circle.r + circle.x <= 800 || circle.r + circle.x >= 0){
        circle.x += circle.vx;
    }
}
function verticalMovement(circle){
    if(circle.r + circle.y >= 800 || -circle.r + circle.y <= 0){
        circle.vy = -circle.vy;
    }
    if(circle.r + circle.y <= 800 || circle.r + circle.y >= 0){
        circle.y += circle.vy;
    }
}

var circles = [];

circles.push(new Circle(50, 250, 450, 4, 3));
circles.push(new Circle(50, 250, 75, 3, 5));
circles.push(new Circle(50, 300, 275, 3, 2));
var thetaA = 0;
var thetaB = 0;
var c=document.getElementById("stage");
var ctx=c.getContext("2d");

circles[0].players.push(new Player({theta:0}));
circles[0].players.push(new Player({theta:1}));
circles[0].players.push(new Player({theta:2}));

// var player = new Circle(5, )

window.requestAnimationFrame(function() {
    updatePosition(thetaB, thetaA);
});

function collision(circleA, circleB){
    var dx = circleA.x - circleB.x;
    var dy = circleA.y - circleB.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var tmp;
    if (distance < circleA.r + circleB.r){
        if((circleA.vy > 0 && circleB.vy < 0) || (circleA.vy < 0 && circleB.vy > 0)){
            tmp = circleA.vy;
            circleA.vy = circleB.vy;
            circleB.vy = tmp;
        }
        if((circleA.vy > 0 && circleB.vy > 0) || (circleA.vy < 0 && circleB.vy < 0)){
            tmp = circleA.vy;
            circleA.vy = circleB.vy;
            circleB.vy = tmp;
        }
        if((circleA.vx > 0 && circleB.vx < 0) || (circleA.vx < 0 && circleB.vx > 0)){
            tmp = circleA.vx;
            circleA.vx = circleB.vx;
            circleB.vx = tmp;
        }
        if((circleA.vx > 0 && circleB.vx > 0) || (circleA.vx < 0 && circleB.vx < 0)){
            tmp = circleA.vx;
            circleA.vx = circleB.vx;
            circleB.vx = tmp;
        }
    }
}

function updatePosition(valA, valB){
    ctx.clearRect(0, 0, 2400, 2400);

    for (c in circles) {
        horizontalMovement(circles[c]);
        verticalMovement(circles[c]);

        ctx.beginPath();
        ctx.arc(circles[c].x,circles[c].y,circles[c].r,0,2*Math.PI);
        ctx.stroke();

        for (var p in circles[c].players) {
            var pointOnOuterCircle = point(circles[c].r+10, circles[c].players[p].theta, {x:circles[c].x,y:circles[c].y});

            ctx.beginPath();
            ctx.arc(pointOnOuterCircle.x,pointOnOuterCircle.y,10,0,2*Math.PI);
            ctx.stroke();

            circles[c].players[p].updateTheta();
            circles[c].players[p].updatePosition(pointOnOuterCircle);
        }
    }
    for (var i = 0; i < circles.length-1; i++) {
        for (var j = i+1; j < circles.length; j++) {
            if (i !== j) {
                collision(circles[i], circles[j]);
            }
        }
    }

    window.requestAnimationFrame(function() {
        updatePosition(thetaB, thetaA);
    });
}
