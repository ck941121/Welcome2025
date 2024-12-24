const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d'); 
let cw = window.innerWidth, ch = window.innerHeight; 
let fireworks = [], particles = [], hue = 120; 
let limiterTick = 0, timerTick = 0, mousedown = false, mx, my; 

canvas.width = cw; 
canvas.height = ch; 

const random = (min, max) => Math.random() * (max - min) + min; 
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1); 

class Firework { 
  constructor(sx, sy, tx, ty) { 
    Object.assign(this, { x: sx, y: sy, sx, sy, tx, ty }); 
    this.distanceToTarget = distance(sx, sy, tx, ty); 
    this.coordinates = Array.from({ length: 3 }, () => [sx, sy]); 
    this.angle = Math.atan2(ty - sy, tx - sx); 
    this.speed = 1.2; 
    this.acceleration = 1.02; 
    this.brightness = random(50, 70); 
    this.targetRadius = 1; 
  } 

  update(index) { 
    this.coordinates.pop(); 
    this.coordinates.unshift([this.x, this.y]); 
    this.speed *= this.acceleration; 
    const vx = Math.cos(this.angle) * this.speed; 
    const vy = Math.sin(this.angle) * this.speed; 
    this.x += vx; 
    this.y += vy; 

    if (distance(this.sx, this.sy, this.x, this.y) >= this.distanceToTarget) { 
      createParticles(this.tx, this.ty); 
      fireworks.splice(index, 1); 
    } 
  } 

  draw() { 
    ctx.beginPath(); 
    ctx.moveTo(this.coordinates[2][0], this.coordinates[2][1]); 
    ctx.lineTo(this.x, this.y); 
    ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`; 
    ctx.stroke(); 

    ctx.beginPath(); 
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2); 
    ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`; 
    ctx.stroke(); 

    this.targetRadius = this.targetRadius < 8 ? this.targetRadius + 0.3 : 1; 
  } 
} 

class Particle { 
  constructor(x, y) { 
    Object.assign(this, { 
      x, y, 
      coordinates: Array.from({ length: 5 }, () => [x, y]), 
      angle: random(0, Math.PI * 2), 
      speed: random(1, 10), 
      friction: 0.95, 
      gravity: 1, 
      hue: random(hue - 20, hue + 20), 
      brightness: random(50, 80), 
      alpha: 1, 
      decay: random(0.015, 0.03) 
    }); 
  } 

  update(index) { 
    this.coordinates.pop(); 
    this.coordinates.unshift([this.x, this.y]); 
    this.speed *= this.friction; 
    this.x += Math.cos(this.angle) * this.speed; 
    this.y += Math.sin(this.angle) * this.speed + this.gravity; 
    this.alpha -= this.decay; 

    if (this.alpha <= this.decay) particles.splice(index, 1); 
  } 

  draw() { 
    ctx.beginPath(); 
    ctx.moveTo(this.coordinates[4][0], this.coordinates[4][1]); 
    ctx.lineTo(this.x, this.y); 
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`; 
    ctx.stroke(); 
  } 
} 

const createParticles = (x, y) => { 
  for (let i = 0; i < 30; i++) particles.push(new Particle(x, y)); 
}; 

let animationFrame = 0;

const loop = () => { 
  requestAnimationFrame(loop); 
  hue += 0.5; 

  ctx.globalCompositeOperation = 'destination-out'; 
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
  ctx.fillRect(0, 0, cw, ch); 

  ctx.globalCompositeOperation = 'lighter'; 
  fireworks.forEach((f, i) => (f.update(i), f.draw())); 
  particles.forEach((p, i) => (p.update(i), p.draw())); 

  if (!mousedown && ++timerTick >= 80) { 
    fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2))); 
    timerTick = 0; 
  } 

  if (mousedown && ++limiterTick >= 5) { 
    fireworks.push(new Firework(cw / 2, ch, mx, my)); 
    limiterTick = 0; 
  } 

  // Animate text coming from upward direction and in different colors
  ctx.font = "30px Arial";
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.textAlign = "center";
  ctx.fillText("Wishing You A very Happy New Year!!!", cw / 2, Math.min(animationFrame, 50));

  ctx.font = "20px Arial";
  ctx.fillStyle = `hsl(${hue + 180}, 100%, 50%)`;
  ctx.textAlign = "right";
  ctx.fillText("Chandan Kumar", cw - 20, Math.min(ch - 20, ch - 20 + animationFrame));

  animationFrame += 2; // Adjust speed of animation
}; 

canvas.addEventListener('mousemove', e => ([mx, my] = [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop])); 
canvas.addEventListener('mousedown', e => (e.preventDefault(), mousedown = true)); 
canvas.addEventListener('mouseup', e => (e.preventDefault(), mousedown = false)); 

window.addEventListener('resize', () => { 
  canvas.width = cw = window.innerWidth; 
  canvas.height = ch = window.innerHeight;
}); 

loop(); 
