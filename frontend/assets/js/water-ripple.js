/**
 * Water Ripple & Splash Cursor Effect
 * Tái tạo hiệu ứng sóng nước và vũng nước lan tỏa sinh động khi rê chuột và nhấp chuột.
 * Hoạt động mượt mà 60fps bằng Canvas API, tự động ngắt khi chuột dừng để tiết kiệm 100% CPU.
 */
(function () {
  let canvas, ctx;
  let ripples = [];
  let droplets = [];
  let lastX = 0, lastY = 0;
  let isRunning = false;
  let throttleTimer = 0;

  function initCanvas() {
    canvas = document.createElement("canvas");
    canvas.id = "water-ripple-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize, { passive: true });
  }

  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  // Lớp gợn sóng nước hình tròn lan tỏa đa tầng
  class WaterRipple {
    constructor(x, y, maxRadius = 52, speed = 1.35, isSplash = false) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = maxRadius;
      this.speed = speed;
      this.isSplash = isSplash;
      this.rings = isSplash ? [0, -12, -24, -36] : [0, -10, -20];
    }

    update() {
      this.radius += this.speed;
      return this.radius < this.maxRadius;
    }

    draw(ctx) {
      const progress = this.radius / this.maxRadius;
      const baseOpacity = Math.max(0, (1 - progress) * (this.isSplash ? 0.75 : 0.5));
      if (baseOpacity <= 0) return;

      ctx.save();
      for (let i = 0; i < this.rings.length; i++) {
        const offset = this.rings[i];
        const r = this.radius + offset;
        if (r > 2) {
          const ringProgress = r / this.maxRadius;
          const ringOpacity = baseOpacity * Math.max(0, 1 - ringProgress);

          ctx.beginPath();
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);

          // Hiệu ứng phản chiếu ánh sáng mặt nước (sắc vàng champagne & xanh ngọc nước trong)
          if (i % 2 === 0) {
            ctx.strokeStyle = `rgba(194, 142, 92, ${ringOpacity * 0.9})`; // Ánh kim Clothique
          } else {
            ctx.strokeStyle = `rgba(125, 211, 252, ${ringOpacity * 0.75})`; // Ánh nước lam nhạt
          }

          ctx.lineWidth = Math.max(0.8, (1 - ringProgress) * 2.2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  // Lớp hạt nước bắn tung tóe khi click vào màn hình
  class WaterDroplet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.2;
      this.radius = 1.2 + Math.random() * 2.2;
      this.opacity = 0.85;
      this.gravity = 0.14;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.opacity -= 0.026;
      return this.opacity > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(194, 142, 92, ${this.opacity})`;
      ctx.shadowColor = "rgba(125, 211, 252, 0.5)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }
  }

  function addRipple(x, y, maxRadius, speed, isSplash = false) {
    ripples.push(new WaterRipple(x, y, maxRadius, speed, isSplash));
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  function addSplash(x, y) {
    // Vòng sóng nước lớn nhiều tầng khi click
    addRipple(x, y, 95, 2.2, true);
    addRipple(x, y, 65, 1.6, false);

    // Hạt nước bắn li ti
    for (let i = 0; i < 10; i++) {
      droplets.push(new WaterDroplet(x, y));
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Vẽ & cập nhật gợn sóng
    for (let i = ripples.length - 1; i >= 0; i--) {
      const active = ripples[i].update();
      if (active) {
        ripples[i].draw(ctx);
      } else {
        ripples.splice(i, 1);
      }
    }

    // Vẽ & cập nhật hạt nước
    for (let i = droplets.length - 1; i >= 0; i--) {
      const active = droplets[i].update();
      if (active) {
        droplets[i].draw(ctx);
      } else {
        droplets.splice(i, 1);
      }
    }

    if (ripples.length > 0 || droplets.length > 0) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
    }
  }

  function handleMove(x, y) {
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const now = Date.now();

    // Giới hạn tần suất tạo sóng khi di chuột để nước chuyển động tự nhiên, không bị đặc
    if (dist > 22 && now - throttleTimer > 45) {
      addRipple(x, y, 48, 1.3, false);
      lastX = x;
      lastY = y;
      throttleTimer = now;
    }
  }

  // Khởi chạy khi tài liệu sẵn sàng
  function start() {
    initCanvas();

    window.addEventListener("mousemove", (e) => {
      handleMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener("click", (e) => {
      addSplash(e.clientX, e.clientY);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

