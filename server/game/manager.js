(function() {
    var id = 0;

    class Stage {
        constructor(width, height, vwidth, vheight) {
            this.circles = [new Circle(50, 100, 100, 5, 5)];
            this.width = width;
            this.height = height;
            this.vwidth = vwidth;
            this.vheight = vheight;
            this.context = null;
            this.isClient = false;
            this.selection = null;

            this.camera = {};

            for (var i in this.circles) {
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 0));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 1));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 2));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 3));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 4));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 5));
                this.circles[i].players.push(new Player(undefined, undefined, undefined, 6));
            }
            /*
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 2; j++) {
                    this.circles.push(new Circle(50, i*75+55+(j*500), i*75+55, randomInt(6), randomInt(6)))
                }
            }
            */
        }
        generateBackground(source){
            var drawImage = function() {
                this.context.drawImage(this.image, this.camera.x, this.camera.y, this.vwidth, this.vheight, 0, 0, this.vwidth, this.vheight);
            }.bind(this);

            if (!this.image) {
                this.image = new Image();
                this.image.src = source;

                this.image.onload = function() {
                    this.image.height = this.height;
                    this.image.width = this.width;
                    console.log(this.height,this.width,this.image);
                    drawImage();
                    this.image.isLoaded = true;
                }.bind(this);
            } else if (this.image.isLoaded) {
                drawImage();
            }

        }

        setCameraOn(circle) {
            this.selected = circle;
            var x,y
            
            x = circle.x-this.vwidth/2;
            x = x < 0 ? 0 : x;
            x = x+this.vwidth > this.width ? this.width-this.vwidth : x;
            
            y = circle.y-this.vheight/2;
            y = y < 0 ? 0 : y;
            y = y+this.vheight > this.height ? this.height-this.vheight : y;

            this.camera.x = x;
            this.camera.y = y; 
        }

        updateCamera() {
            this.setCameraOn(this.selected);
        }

        updatePositions() {
            for (var c in this.circles) {
                this.horizontalMovement(this.circles[c]);
                this.verticalMovement(this.circles[c]);

                for (var p in this.circles[c].players) {
                    var pointOnOuterCircle = this.pointOnCircle(this.circles[c].r+10, this.circles[c].players[p].theta, {x:this.circles[c].x, y:this.circles[c].y});
                    this.circles[c].players[p].updatePosition(pointOnOuterCircle);
                    this.circles[c].players[p].updateTheta();
                }
            }

            for (var i = 0; i < this.circles.length-1; i++) {
                for (var j = i+1; j < this.circles.length; j++) {
                    this.collision(this.circles[i], this.circles[j]);
                }
            }
        }
       
        drawUpdatedPositions(callback) {
            for (var c in this.circles) {
                this.draw(this.circles[c]);
                for (var p in this.circles[c].players) {
                    this.draw(this.circles[c].players[p]);
                }
            }

            window.requestAnimationFrame(callback);
        }


        collision(circleA, circleB){
            var tmp;
            var colliding = this.isCollision(circleA, circleB);

            if (colliding && (circleA.isPlayer || circleB.isPlayer)) {
                var player = circleA.isPlayer ? circleA : circleB;
                var planet = !circleA.isPlayer ? circleA : circleB;

                player.theta = Math.atan2((player.y-planet.y),(player.x-planet.x));
                planet.players.push(this.circles.splice(this.circles.indexOf(player), 1)[0])
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

        isCollision(circleA, circleB) {
            var dx = circleA.x - circleB.y;
            var dy = circleA.y - circleB.y;

            var distance = Math.sqrt(dx*dx + dy*dy);
            return distance < circleA.r + circleB.r;
        }

        horizontalMovement(circle) {
            if(circle.r + circle.x >= this.width || -circle.r + circle.x <= 0){
                circle.vx = -circle.vx;
            }
            if(circle.r + circle.x <= this.width || circle.r + circle.x >= 0){
                circle.x += circle.vx;
            }
        }

        verticalMovement(circle) {
            if(circle.r + circle.y >= this.height || -circle.r + circle.y <= 0){
                circle.vy = -circle.vy;
            }
            if(circle.r + circle.y <= this.height || circle.r + circle.y >= 0){
                circle.y += circle.vy;
            }
        }

        pointOnCircle(r, angle, center) {
            return {
                x: r*Math.cos(angle)+center.x,
                y: r*Math.sin(angle)+center.y
            }
        }

        draw(circle) {
            this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

            this.context.beginPath();

            if (circle.isSelected) {
                this.context.fillStyle = 'green';
                this.context.lineWidth = 2;
                this.context.strokeStyle = '#003300';
            }

            this.context.arc(circle.x-this.camera.x, circle.y-this.camera.y, circle.r, 0, 2*Math.PI);//TODO:filter out objects or partially draw objects if not within viewport

            this.context.stroke()
            this.context.fill()
            this.context.closePath()
        }

        clearCanvas() {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }

    class Circle {
        constructor(r, x, y, vx, vy) {
            this.r = r;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.players = [];
            this.isSelected = false;
            this.id = id++;
        }
    }

    class Player {
        constructor(r, x, y, theta) {
            this.x = x;
            this.y = y;
            this.r = r || 10;
            this.theta = theta;
            this.isPlayer = true;
            this.isSelected = false;
            this.id = id++;
        }

        updateTheta() {
            if (this.theta > Math.PI*2) {
                this.theta = 0;
            } else {
                this.theta += 0.0174533;
            }
        }

        updatePosition(point) {
            this.x = point.x;
            this.y = point.y;
        }
    }

    function randomInt(upperBound) {
        return Math.floor(Math.random()*upperBound)+1;
    }


    if (typeof window == 'undefined') {
        module.exports = {
            Stage: Stage,
            Circle: Circle,
            Player: Player,
        }
    } else {
        window.Stage = Stage;
        window.Circle = Circle;
        window.Player = Player;
    }
})()