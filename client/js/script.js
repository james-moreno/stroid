var socket = io()

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});


class Circle {
    constructor(r, x, y, vx, vy) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
//        this.vx = 0, this.vy = 0
        this.players = [];
        this.isSelected = false;
        this.id = id++;
    }
}
class Player {
    constructor(data){
        this.x = data.x;
        this.y = data.y;
        this.r = 10;
        this.theta = data.theta;
        this.isPlayer = true;
        this.isSelected = true;
        this.id = id++;
    }

    updateTheta(){
        if(this.theta > Math.PI*2){
            this.theta = 0;
        }
        else {
            this.theta += 0.0174533;
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
    if(circle.r + circle.x >= window.innerWidth*3 || -circle.r + circle.x <= 0){
        circle.vx = -circle.vx;
    }
    if(circle.r + circle.x <= window.innerWidth*3 || circle.r + circle.x >= 0){
        circle.x += circle.vx;
    }
}
function verticalMovement(circle){
    if(circle.r + circle.y >= window.innerHeight*3 || -circle.r + circle.y <= 0){
        circle.vy = -circle.vy;
    }
    if(circle.r + circle.y <= window.innerHeight*3 || circle.r + circle.y >= 0){
        circle.y += circle.vy;
    }
}

function randomInt(upperBound) {
    return Math.floor(Math.random()*upperBound)+1
}

var circles = [];
var id = 0

for (var i = 0; i < 35; i++) {
//    for (var j = 0; j < 10; j++) {
    for (var j = 0; j < 2; j++) {
        circles.push(new Circle(50, i*75+55+(j*500), i*75+55, randomInt(6), randomInt(6)))
    }

}
var c=document.getElementById("stage");
c.width = window.innerWidth*3;
c.height = window.innerHeight*3;
var ctx=c.getContext("2d");


for (var i in circles) {
    circles[i].players.push(new Player({theta:0}));
    circles[i].players.push(new Player({theta:1}));
    circles[i].players.push(new Player({theta:2}));
    circles[i].players.push(new Player({theta:3}));
    circles[i].players.push(new Player({theta:4}));
    circles[i].players.push(new Player({theta:5}));
    circles[i].players.push(new Player({theta:6}));
}

window.requestAnimationFrame(function() {
    updatePosition();
});

function collision(circleA, circleB){
    var tmp;
    var colliding = isCollision(circleA, circleB);

    if (colliding && (circleA.isPlayer || circleB.isPlayer) && !(circleA.isPlayer && circleB.isPlayer)) {
        var player = circleA.isPlayer ? circleA : circleB;
        var planet = !circleA.isPlayer ? circleA : circleB;
        
        player.theta = Math.atan2((player.y-planet.y),(player.x-planet.x));
        planet.players.push(circles.splice(circles.indexOf(player), 1)[0])
    } else if (colliding){
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

function updatePosition(){
    ctx.clearRect(0, 0, window.innerWidth*3, window.innerHeight*3);

    for (c in circles) {
        horizontalMovement(circles[c]);
        verticalMovement(circles[c]);

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

        if (circles[c].isSelected) {
            ctx.fillStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#003300';
        }

        ctx.beginPath();

        ctx.arc(circles[c].x,circles[c].y,circles[c].r,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        for (var p in circles[c].players) {
            var pointOnOuterCircle = point(circles[c].r+10, circles[c].players[p].theta, {x:circles[c].x,y:circles[c].y});
            circles[c].players[p].updatePosition(pointOnOuterCircle);

            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

            if (circles[c].players[p].isSelected) {
                ctx.fillStyle = 'green';
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#003300';
            }

            ctx.beginPath();
            ctx.arc(pointOnOuterCircle.x,pointOnOuterCircle.y,10,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        for (var p in circles[c].players) {
            circles[c].players[p].updateTheta();
        }
    }
    for (var i = 0; i < circles.length-1; i++) {
        for (var j = i+1; j < circles.length; j++) {
            collision(circles[i], circles[j]);
        }
    }

    window.requestAnimationFrame(function() {
        updatePosition();
    });
}

function selectCircle(event) {
    var canvas = document.getElementById('stage').getBoundingClientRect()
    var x = event.clientX - canvas.left
    var y = event.clientY - canvas.top


    for (c in circles) {
        if (isCollision(circles[c], {x:x,y:y,r:0})) {
            circles[c].isSelected = !circles[c].isSelected;
        } else {
            circles[c].isSelected = false;
        }


        for (var p in circles[c].players) {
            if (isCollision(circles[c].players[p], {x:x,y:y,r:0})) {
                circles[c].players[p].isSelected = !circles[c].players[p].isSelected;
            } else {
                circles[c].players[p].isSelected = false;
            }
        }
    }

}

function isCollision(circleA, circleB) {
    var dx = circleA.x - circleB.x;
    var dy = circleA.y - circleB.y;

    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circleA.r + circleB.r
}

window.onkeydown = function(event) {
    if (event.keyCode == 32 && event.target == document.body) {
        event.preventDefault();
        console.log('space bar hit');
    //    socket.emit('launch', { socket:socket, young:"iggin" });
    socket.emit('launch', { "socket":socket.id });

        for (var c in circles) {
            var p = 0;
            while (circles[c].players && p < circles[c].players.length) {
                if (circles[c].players[p].isSelected) {
                    circles[c].players[p].vy = 10*Math.sin(circles[c].players[p].theta);
                    circles[c].players[p].vx = 10*Math.cos(circles[c].players[p].theta);
                    circles.push(circles[c].players.splice(p,1)[0])
                } else {
                    p++;
                }
            }
        }
    }
}

