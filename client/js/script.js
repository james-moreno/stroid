var socket = io()
var stage

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

httpGetAsync('/stage', function(data) {
    data = JSON.parse(data);
    functions = data.functions;
    stage = data.stage;

    stage = objToClass('Stage', stage);

    for (var c in stage.circles) {
        stage.circles[c] = objToClass('Circle', stage.circles[c]);
        for (var p in stage.circles[c].players) {
            stage.circles[c].players[p] = objToClass('Player', stage.circles[c].players[p]);
        }
    }

    cvs = document.getElementById("stage");
    cvs.width = stage.width;
    cvs.height = stage.height;
    stage.context = cvs.getContext("2d");
    stage.isClient = true;

    stage.generateBackground("img/galaxy.jpg")
    window.requestAnimationFrame(function() {
        stage.generateBackground()
        stage.updatePositions(window.requestAnimationFrame);
    });
});

function objToClass(className, ObjectInstance) {
    var obj = new window[className]();
    for (attr in ObjectInstance) {
        obj[attr] = ObjectInstance[attr];
    }

    return obj;
}

/*
window.onkeydown = function(event) {
    if (event.keyCode == 32 && event.target == document.body) {
        event.preventDefault();
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
*/

// function selectCircle(event) {
//     var canvas = document.getElementById('stage').getBoundingClientRect()
//     var x = event.clientX - canvas.left
//     var y = event.clientY - canvas.top
//
//
//     for (c in stage.circles) {
//         if (stage.isCollision(stage.circles[c], {x:x,y:y,r:0})) {
//             stage.circles[c].isSelected = !stage.circles[c].isSelected;
//         } else {
//             stage.circles[c].isSelected = false;
//         }
//
//
//         for (var p in stage.circles[c].players) {
//             if (stage.isCollision(stage.circles[c].players[p], {x:x,y:y,r:0})) {
//                 stage.circles[c].players[p].isSelected = !stage.circles[c].players[p].isSelected;
//             } else {
//                 stage.circles[c].players[p].isSelected = false;
//             }
//         }
//     }
//
// }
