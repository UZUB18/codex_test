const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Circle {
  constructor(x, y, vx, vy, r, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const circles = [];
const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];
const NUM = 10;

for (let i = 0; i < NUM; i++) {
  const r = 20 + Math.random() * 30;
  let x = r + Math.random() * (width - 2 * r);
  let y = r + Math.random() * (height - 2 * r);
  let vx = (Math.random() - 0.5) * 4;
  let vy = (Math.random() - 0.5) * 4;
  circles.push(new Circle(x, y, vx, vy, r, colors[i % colors.length]));
}

function update() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];

    // move
    c.x += c.vx;
    c.y += c.vy;

    // bounce off walls
    if (c.x - c.r < 0 && c.vx < 0) c.vx *= -1;
    if (c.x + c.r > width && c.vx > 0) c.vx *= -1;
    if (c.y - c.r < 0 && c.vy < 0) c.vy *= -1;
    if (c.y + c.r > height && c.vy > 0) c.vy *= -1;

    // bounce with other circles
    for (let j = i + 1; j < circles.length; j++) {
      let c2 = circles[j];
      let dx = c2.x - c.x;
      let dy = c2.y - c.y;
      let dist = Math.hypot(dx, dy);
      if (dist < c.r + c2.r) {
        // normalize
        let nx = dx / dist;
        let ny = dy / dist;
        // relative velocity
        let dvx = c.vx - c2.vx;
        let dvy = c.vy - c2.vy;
        // dot product
        let p = 2 * (dvx * nx + dvy * ny) / 2; // masses equal
        c.vx -= p * nx;
        c.vy -= p * ny;
        c2.vx += p * nx;
        c2.vy += p * ny;
        // push apart to prevent sticking
        const overlap = c.r + c2.r - dist;
        c.x -= nx * overlap / 2;
        c.y -= ny * overlap / 2;
        c2.x += nx * overlap / 2;
        c2.y += ny * overlap / 2;
      }
    }

    c.draw();
  }
  requestAnimationFrame(update);
}

update();
