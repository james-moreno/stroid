(function() {
    var id = 0;

    class Stage {
        constructor(width, height) {
            this.circles = [new Circle(50, 100, 100, 5, 5)];
            this.width = width;
            this.height = height;
            this.context = null;
            this.isClient = false;

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
            if (!this.image) {
                this.image = new Image();
                this.image.src = source;

                this.image.onload = function() {
                    this.image.height = this.context.canvas.height;
                    this.image.width = this.context.canvas.width;

                    this.context.drawImage(this.image, 0, 0, this.context.canvas.width, this.context.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
                    this.image.isLoaded = true;
                }.bind(this);
            } else if (this.image.isLoaded) {
                this.context.drawImage(this.image, 0, 0, this.context.canvas.width, this.context.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
            }
        }

        updatePositions(callback) {
            if (this.isClient) {
            }

            for (var c in this.circles) {
                this.horizontalMovement(this.circles[c]);
                this.verticalMovement(this.circles[c]);

                if (this.isClient) {
                    this.draw(this.circles[c]);
                }

                for (var p in this.circles[c].players) {
                    var pointOnOuterCircle = this.pointOnCircle(this.circles[c].r+10, this.circles[c].players[p].theta, {x:this.circles[c].x, y:this.circles[c].y});
                    this.circles[c].players[p].updatePosition(pointOnOuterCircle);
                    this.circles[c].players[p].updateTheta();

                    if (this.isClient) {
                        this.draw(this.circles[c].players[p]);
                    }

                }
            }

            for (var i = 0; i < this.circles.length-1; i++) {
                for (var j = i+1; j < this.circles.length; j++) {
                    this.collision(this.circles[i], this.circles[j]);
                }
            }

            if (callback) {
                callback(function() {
                    this.generateBackground()
                    this.updatePositions(callback);
                }.bind(this));
            }
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

            if (circle.isSelected) {
                this.context.fillStyle = 'green';
                this.context.lineWidth = 2;
                this.context.strokeStyle = '#003300';
            }

            this.context.beginPath();

            this.context.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
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
