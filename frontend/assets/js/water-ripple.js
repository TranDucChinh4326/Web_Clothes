/**
 * Hyper-Realistic 3D Fluid Water Ripple & Liquid Lens Engine
 * - Mô phỏng quang học 3D: Sóng nước có độ dày, độ lồi, gờ sáng phản quang (specular highlight)
 *   hướng về nguồn sáng và gờ tối (refraction shadow) tạo chiều sâu 3D chân thực.
 * - Thấu kính giọt nước (Liquid Glass Lens) nổi theo con trỏ chuột khúc xạ nhẹ nội dung bên dưới.
 * - Âm thanh giọt nước rơi chân thực tổng hợp bằng Web Audio API (không cần tải file ngoài).
 * - Hiệu năng 60fps mượt mà bằng Canvas phần cứng, tự ngủ khi chuột đứng yên.
 */
(function () {
  let canvas, ctx;
  let ripples = [];
  let droplets = [];
  let lastX = 0, lastY = 0;
  let isRunning = false;
  let throttleTimer = 0;
  let lensEl;
  let audioCtx = null;

  // Góc chiếu sáng mặt nước (nguồn sáng từ hướng Tây Bắc ~ 135 độ)
  const LIGHT_ANGLE = -Math.PI / 4;
  const LIGHT_COS = Math.cos(LIGHT_ANGLE);
  const LIGHT_SIN = Math.sin(LIGHT_ANGLE);

  // Khởi tạo âm thanh giọt nước Web Audio API
  function playWaterDropSound() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Tần số trượt từ 900Hz lên 1600Hz mô phỏng bọt nước vỡ (bloop)
      const now = audioCtx.currentTime;
      const baseFreq = 850 + Math.random() * 300;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio không khả dụng thì bỏ qua an toàn
    }
  }

  // Khởi tạo Canvas và Thấu kính nước lỏng
  function initDOM() {
    // 1. Canvas sóng nước
    canvas = document.createElement("canvas");
    canvas.id = "water-ripple-canvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99998;";
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // 2. Thấu kính giọt nước theo chuột (Liquid Glass Lens)
    lensEl = document.createElement("div");
    lensEl.id = "water-liquid-lens";
    lensEl.style.cssText = `
      position: fixed;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.6);
      z-index: 99997;
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(1.2px) brightness(106%) contrast(104%);
      background: radial-gradient(
        circle at 35% 35%,
        rgba(255, 255, 255, 0.45) 0%,
        rgba(224, 242, 254, 0.2) 30%,
        rgba(194, 142, 92, 0.12) 65%,
        rgba(255, 255, 255, 0.35) 85%,
        rgba(15, 23, 42, 0.12) 96%,
        transparent 100%
      );
      box-shadow: 
        inset 0 1px 3px rgba(255, 255, 255, 0.8),
        inset 0 -1px 3px rgba(15, 23, 42, 0.2),
        0 4px 12px rgba(15, 23, 42, 0.08);
    `;
    document.body.appendChild(lensEl);
  }

  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  // Lớp mô phỏng sóng nước 3D chân thực
  class RealisticRipple {
    constructor(x, y, maxRadius = 70, speed = 1.6, intensity = 1.0) {
      this.x = x;
      this.y = y;
      this.radius = 3;
      this.maxRadius = maxRadius;
      this.speed = speed;
      this.intensity = intensity;
      // Các đợt sóng lan truyền tiếp nối
      this.harmonics = [
        { offset: 0, weight: 1.0 },
        { offset: -14, weight: 0.65 },
        { offset: -28, weight: 0.35 }
      ];
    }

    update() {
      this.radius += this.speed;
      return this.radius < this.maxRadius + 30;
    }

    draw(ctx) {
      ctx.save();

      for (let h of this.harmonics) {
        const r = this.radius + h.offset;
        if (r <= 3) continue;

        const progress = r / this.maxRadius;
        if (progress >= 1.25) continue;

        // Biên độ sóng suy giảm dần khi tỏa xa
        const lifeFactor = Math.max(0, 1 - progress);
        const alpha = lifeFactor * lifeFactor * this.intensity * h.weight;
        if (alpha < 0.01) continue;

        // Chiều rộng gờ sóng (sóng loang rộng ra khi tỏa xa)
        const waveWidth = Math.max(2.5, 4.5 * (1 - progress * 0.5));

        // 1. Gờ sáng phản quang (Specular Highlight) ở phía hướng sáng (Tây Bắc)
        const gradLight = ctx.createLinearGradient(
          this.x - r * LIGHT_COS,
          this.y - r * LIGHT_SIN,
          this.x + r * LIGHT_COS,
          this.y + r * LIGHT_SIN
        );

        // Đỉnh sóng bắt sáng trắng lấp lánh như pha lê
        gradLight.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
        gradLight.addColorStop(0.35, `rgba(186, 230, 253, ${alpha * 0.6})`);
        gradLight.addColorStop(0.7, `rgba(194, 142, 92, ${alpha * 0.3})`);
        // Phía khuất sáng có bóng đổ khúc xạ nhẹ (Refraction Shadow)
        gradLight.addColorStop(1, `rgba(15, 23, 42, ${alpha * 0.35})`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = gradLight;
        ctx.lineWidth = waveWidth;
        ctx.stroke();

        // 2. Viền nét mảnh lấp lánh ở mép gờ sóng
        ctx.beginPath();
        ctx.arc(this.x, this.y, r + waveWidth * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Hạt nước văng thực tế khi click (Droplets with physics)
  class RealisticDroplet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 4.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.8; // Bắn bổng lên trước
      this.radius = 1.5 + Math.random() * 2.5;
      this.life = 1.0;
      this.decay = 0.02 + Math.random() * 0.015;
      this.gravity = 0.16;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.life -= this.decay;
      return this.life > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      // Gradient lấp lánh như giọt nước trong suốt
      const dropGrad = ctx.createRadialGradient(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        this.radius * 0.1,
        this.x,
        this.y,
        this.radius
      );
      dropGrad.addColorStop(0, `rgba(255, 255, 255, ${this.life * 0.95})`);
      dropGrad.addColorStop(0.5, `rgba(186, 230, 253, ${this.life * 0.7})`);
      dropGrad.addColorStop(1, `rgba(194, 142, 92, ${this.life * 0.5})`);

      ctx.fillStyle = dropGrad;
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.restore();
    }
  }

  function addRipple(x, y, maxRadius, speed, intensity) {
    ripples.push(new RealisticRipple(x, y, maxRadius, speed, intensity));
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function addSplash(x, y) {
    playWaterDropSound();

    // Sóng chấn động trung tâm mạnh mẽ
    addRipple(x, y, 110, 2.4, 1.3);
    addRipple(x, y, 80, 1.8, 0.9);
    addRipple(x, y, 50, 1.2, 0.6);

    // 12 hạt nước bắn tung tóe theo quỹ đạo vật lý
    for (let i = 0; i < 12; i++) {
      droplets.push(new RealisticDroplet(x, y));
    }

    // Hiệu ứng giật nhẹ thấu kính nước khi nhấp chuột
    if (lensEl) {
      lensEl.style.transform = `translate(${x}px, ${y}px) scale(1.35)`;
      setTimeout(() => {
        lensEl.style.transform = `translate(${x}px, ${y}px) scale(0.9)`;
      }, 120);
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function renderLoop() {
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
      requestAnimationFrame(renderLoop);
    } else {
      isRunning = false;
    }
  }

  let idleLensTimer = null;
  function handlePointerMove(x, y) {
    // Cập nhật vị trí thấu kính nước
    if (lensEl) {
      lensEl.style.transform = `translate(${x}px, ${y}px) scale(0.95)`;
      lensEl.style.opacity = "1";

      clearTimeout(idleLensTimer);
      idleLensTimer = setTimeout(() => {
        lensEl.style.opacity = "0";
      }, 900);
    }

    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const now = Date.now();

    // Sinh sóng khi chuột di chuyển mượt mà tự nhiên
    if (dist > 18 && now - throttleTimer > 38) {
      // Vận tốc chuột càng nhanh thì biên độ sóng càng mạnh
      const velocityRatio = Math.min(2.0, Math.max(0.7, dist / 28));
      addRipple(x, y, 55 * velocityRatio, 1.5 * velocityRatio, 0.65 * velocityRatio);
      lastX = x;
      lastY = y;
      throttleTimer = now;
    }
  }

  function start() {
    initDOM();

    window.addEventListener("mousemove", (e) => {
      handlePointerMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener("click", (e) => {
      addSplash(e.clientX, e.clientY);
    });

    document.addEventListener("mouseleave", () => {
      if (lensEl) lensEl.style.opacity = "0";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
