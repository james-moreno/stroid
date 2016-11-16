var c=document.getElementById("stage");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(100,75,50,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(40,75,10,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(250,75,50,0,2*Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(250,75,60,0,2*Math.PI);
ctx.stroke();

var p = point(60, Math.PI/3, {x:250,y:75})

ctx.beginPath();
ctx.arc(p['x'],p['y'],10,0,2*Math.PI);
ctx.stroke();

function point(r, angle, center) {
    return {
        x: r*Math.cos(angle)+center['x'],
        y: r*Math.sin(angle)+center['y']
    }
}
