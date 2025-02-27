var W = window.innerWidth, H = window.innerHeight;

window.onload = function() {

var c = document.getElementById('c');
c.width = W; c.height = H;
var ctx = c.getContext('2d');

ctx.fillStyle = 'rgba(10,20,30,0.08)';
ctx.strokeStyle = 'green';


var orbits = [];
var amount = 20;

var wave = { t:Date.now(), r:0 };

function addOrbit(a, b, c) {
  orbits.push({a:a, b:b, c:c});
}

addOrbit(0, 0, 0);
addOrbit(Math.PI/2, -Math.PI/2, 0);
addOrbit(Math.PI/2, 0, 0);

function update() {
  for(var i = 0; i < orbits.length; i++) {
    orbits[i].a += Math.PI / 120 /3;
    orbits[i].b += Math.PI / 80 /3;
    orbits[i].c += Math.PI / (400 + 100*Math.sin(Date.now()/1e3));
  }
  wave.r += 1;
}

function orbitDots(o) {
  var dots = [];
  for(var i = 0; i < amount; i++) {
    var a = 2 * Math.PI * i / amount + o.c;
    var x = Math.cos(a) * Math.cos(o.a);
    var y = Math.sin(a);
    var z = 0.5 + Math.cos(a) * Math.sin(o.a)/8;
    var rx = x*Math.cos(o.b) - y*Math.sin(o.b);
    var ry = x*Math.sin(o.b) + y*Math.cos(o.b);
    var xy = apply(rx, ry);
    dots.push(xy[0], xy[1], z);
  }
  return dots;
}

function drawOrbit(o) {
  var dots = orbitDots(o);
  for(var i = 0; i < dots.length; i += 3) {
    ctx.beginPath();
    ctx.arc(W/2+dots[i]*W/3.5, H/2+dots[i+1]*W/3.5, 20*dots[i+2], 0, 2*Math.PI);
    ctx.stroke();
  }
}

(function loop() {
  window.requestAnimationFrame(loop);
  update();
  
  updateStrokeStyle();
  
  ctx.fillRect(0, 0, W, H);
  orbits.map(drawOrbit);
})();

function updateStrokeStyle() {
  var t = 0.5 + Math.sin(Date.now()/1e3)/2;
  var r = ~~(255*t*(1-t));
  var g = ~~(255 - 50*t);
  var b = ~~(255*t*t);
  ctx.strokeStyle = 'rgb('+r+','+g+','+b+')';
}

function apply(x, y) {
  var d = Math.hypot(x, y);
  var a = (d - wave.r)/80;
  d = 1 + Math.sin(a) / d;
  return [x*d, y*d];
}

}