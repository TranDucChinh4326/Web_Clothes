/**
 * Interactive Chibi Fashion Mascot (Clothique Assistant)
 * - Nhân vật chibi thời trang cực đáng yêu đi qua đi lại ở đáy màn hình.
 * - Tự động quay đầu khi chạm mép màn hình, dừng lại ngắm nghía, chớp mắt, vẫy tay.
 * - Tương tác bấm vào chibi: Nhảy cẫng lên vui sướng, bắn tim, phát âm thanh vui tai.
 * - Cho phép nắm kéo (drag & drop) nhân vật đi bất cứ đâu.
 * - Có bóng thoại trò chuyện (mách mã giảm giá, tips phối đồ, chào hỏi).
 * - Nút thu nhỏ/ẩn nhân vật tiện lợi.
 */
(function () {
  const CHIBI_WIDTH = 76;
  const CHIBI_HEIGHT = 96;

  // Danh sách câu thoại ngẫu nhiên của Chibi
  const QUOTES = [
    "Chào bạn! Chúc bạn một ngày shopping vui vẻ nha! ✨",
    "Nhập mã CLOTHIQUE10 được giảm ngay 10% đó! 🎁",
    "Áo sơ mi linen cổ trụ đang bán siêu chạy luôn! 🔥",
    "Đơn từ 500k là được Miễn phí vận chuyển tận nhà nè! 🚀",
    "Bạn cần tư vấn size đồ cứ nhắn tớ nha! 👗",
    "Chạm vào tớ để tớ làm xiếc nhảy múa cho xem! 💃",
    "Váy đầm lụa satin diện đi tiệc bao sang chảnh luôn! 💖",
    "Clothique cam kết 100% sợi tự nhiên thoáng mát nhé! 🌿"
  ];

  let chibiContainer, chibiChar, speechBubble, bubbleText;
  let posX = 80;
  let posY = 0;
  let speed = 1.15;
  let direction = 1; // 1: phải, -1: trái
  let state = "WALK"; // WALK, IDLE, JUMP, DRAG
  let stateTimer = 0;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let audioCtx = null;

  function playHappySound() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;
      // Hợp âm 3 nốt vui nhộn (C6 - E6 - G6)
      [1046.5, 1318.5, 1567.98].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.04, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  function createChibiHTML() {
    // Chèn CSS cho Chibi
    const style = document.createElement("style");
    style.textContent = `
      #clothique-chibi-wrap {
        position: fixed;
        bottom: 12px;
        left: 0;
        z-index: 99990;
        user-select: none;
        touch-action: none;
        cursor: grab;
        filter: drop-shadow(0 8px 16px rgba(0,0,0,0.18));
        transition: transform 0.05s linear;
      }
      #clothique-chibi-wrap.dragging {
        cursor: grabbing;
        transition: none !important;
      }
      #clothique-chibi-char {
        width: ${CHIBI_WIDTH}px;
        height: ${CHIBI_HEIGHT}px;
        position: relative;
        transform-origin: bottom center;
      }
      .chibi-walking {
        animation: chibi-wobble 0.38s ease-in-out infinite alternate;
      }
      .chibi-jumping {
        animation: chibi-hop 0.55s ease-out forwards;
      }
      @keyframes chibi-wobble {
        0% { transform: translateY(0) rotate(-3deg); }
        100% { transform: translateY(-5px) rotate(3deg); }
      }
      @keyframes chibi-hop {
        0% { transform: scale(1) translateY(0); }
        40% { transform: scale(1.15, 0.85) translateY(-32px); }
        70% { transform: scale(0.9, 1.1) translateY(-38px); }
        100% { transform: scale(1) translateY(0); }
      }
      /* Bóng thoại */
      #chibi-speech-bubble {
        position: absolute;
        bottom: 104px;
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        background: #ffffff;
        color: #0f172a;
        padding: 8px 14px;
        border-radius: 14px;
        font-size: 12.5px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
        border: 1.5px solid #e2e8f0;
        white-space: normal;
        width: 170px;
        text-align: center;
        line-height: 1.35;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #chibi-speech-bubble::after {
        content: "";
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 7px 7px 0;
        border-style: solid;
        border-color: #ffffff transparent;
        display: block;
        width: 0;
      }
      #chibi-speech-bubble.active {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
      /* Hạt tim bay lên khi click */
      .chibi-heart-float {
        position: absolute;
        font-size: 18px;
        color: #ef4444;
        pointer-events: none;
        animation: heart-fly 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        z-index: 10;
      }
      @keyframes heart-fly {
        0% { opacity: 1; transform: translate(0, 0) scale(0.6); }
        100% { opacity: 0; transform: translate(var(--rx), -60px) scale(1.4); }
      }
      /* Nút điều khiển nhỏ */
      #chibi-toggle-btn {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #f1f5f9;
        color: #64748b;
        font-size: 10px;
        border: 1px solid #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      #clothique-chibi-wrap:hover #chibi-toggle-btn {
        opacity: 1;
      }
      #chibi-toggle-btn:hover {
        background: #0f172a;
        color: #fff;
      }
    `;
    document.head.appendChild(style);

    // Tạo container
    chibiContainer = document.createElement("div");
    chibiContainer.id = "clothique-chibi-wrap";

    // SVG Chibi Mascot Vector sắc nét
    chibiContainer.innerHTML = `
      <div id="chibi-speech-bubble">
        <span id="chibi-bubble-text">Chào bạn!</span>
      </div>

      <div id="chibi-toggle-btn" title="Thu nhỏ/Ẩn chibi">✕</div>

      <div id="clothique-chibi-char" class="chibi-walking">
        <svg viewBox="0 0 100 125" width="100%" height="100%">
          <defs>
            <linearGradient id="chibi-beret-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="chibi-coat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d4a373" />
              <stop offset="100%" stop-color="#c28e5c" />
            </linearGradient>
            <linearGradient id="chibi-hair-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4a3728" />
              <stop offset="100%" stop-color="#2d1e14" />
            </linearGradient>
          </defs>

          <!-- Shadow dưới chân -->
          <ellipse cx="50" cy="120" rx="26" ry="5" fill="rgba(15, 23, 42, 0.22)" />

          <!-- Chân & Giày boots thời trang -->
          <g id="chibi-legs">
            <rect x="38" y="98" width="8" height="18" rx="4" fill="#1e293b" />
            <rect x="54" y="98" width="8" height="18" rx="4" fill="#1e293b" />
            <!-- Mũi giày -->
            <ellipse cx="44" cy="116" rx="6" ry="4" fill="#0f172a" />
            <ellipse cx="60" cy="116" rx="6" ry="4" fill="#0f172a" />
          </g>

          <!-- Tóc sau -->
          <path d="M26 48 C20 70, 24 95, 32 100 C36 85, 32 60, 32 48 Z" fill="url(#chibi-hair-grad)" />
          <path d="M74 48 C80 70, 76 95, 68 100 C64 85, 68 60, 68 48 Z" fill="url(#chibi-hair-grad)" />

          <!-- Áo khoác Blazer dáng Chibi -->
          <path d="M30 76 L36 102 L64 102 L70 76 L62 66 L38 66 Z" fill="url(#chibi-coat-grad)" />
          <!-- Khăn quàng cổ thanh lịch -->
          <path d="M38 66 Q50 74 62 66 Q58 72 50 72 Q42 72 38 66 Z" fill="#fafaf9" />
          <rect x="46" y="70" width="8" height="16" rx="2" fill="#fafaf9" />

          <!-- Túi xách mini đeo chéo Clothique -->
          <rect x="62" y="82" width="14" height="11" rx="2.5" fill="#1e293b" />
          <line x1="42" y1="67" x2="63" y2="84" stroke="#d4a373" stroke-width="1.8" />
          <circle cx="69" cy="87" r="1.5" fill="#d4a373" />

          <!-- Tay trái & phải -->
          <path d="M28 72 Q24 82 28 88" stroke="url(#chibi-coat-grad)" stroke-width="6" stroke-linecap="round" fill="none" />
          <path d="M72 72 Q76 82 72 88" stroke="url(#chibi-coat-grad)" stroke-width="6" stroke-linecap="round" fill="none" />
          <!-- Bàn tay tròn -->
          <circle cx="28" cy="89" r="3.5" fill="#fde2d0" />
          <circle cx="72" cy="89" r="3.5" fill="#fde2d0" />

          <!-- Khuôn mặt Chibi tròn phúng phính -->
          <ellipse cx="50" cy="46" rx="26" ry="24" fill="#fde2d0" />

          <!-- Má hồng Chibi siêu cưng -->
          <ellipse cx="32" cy="52" rx="4.5" ry="2.5" fill="#fca5a5" opacity="0.65" />
          <ellipse cx="68" cy="52" rx="4.5" ry="2.5" fill="#fca5a5" opacity="0.65" />

          <!-- Mắt to long lanh kiểu anime -->
          <g id="chibi-eyes">
            <ellipse cx="38" cy="45" rx="4.5" ry="6.5" fill="#1e293b" />
            <circle cx="39.5" cy="43" r="2" fill="#ffffff" />
            <circle cx="37" cy="47" r="1" fill="#ffffff" />

            <ellipse cx="62" cy="45" rx="4.5" ry="6.5" fill="#1e293b" />
            <circle cx="63.5" cy="43" r="2" fill="#ffffff" />
            <circle cx="61" cy="47" r="1" fill="#ffffff" />

            <!-- Lông mi & Lông mày -->
            <path d="M34 38 Q38 35 43 37" stroke="#2d1e14" stroke-width="1.6" stroke-linecap="round" fill="none" />
            <path d="M57 37 Q62 35 66 38" stroke="#2d1e14" stroke-width="1.6" stroke-linecap="round" fill="none" />
          </g>

          <!-- Miệng cười chúm chím -->
          <path d="M47 53 Q50 56 53 53" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round" fill="none" />

          <!-- Tóc mái phồng -->
          <path d="M26 38 C32 26, 44 26, 50 30 C56 26, 68 26, 74 38 C70 34, 62 33, 58 37 C54 33, 44 33, 38 38 C34 35, 28 35, 26 38 Z" fill="url(#chibi-hair-grad)" />

          <!-- Mũ nồi Beret phong cách Parisian Chic -->
          <ellipse cx="50" cy="24" rx="27" ry="11" fill="url(#chibi-beret-grad)" />
          <circle cx="50" cy="14" r="2.5" fill="#c28e5c" />
          <ellipse cx="50" cy="28" rx="22" ry="4" fill="#0f172a" opacity="0.4" />
        </svg>
      </div>
    `;

    document.body.appendChild(chibiContainer);

    chibiChar = document.getElementById("clothique-chibi-char");
    speechBubble = document.getElementById("chibi-speech-bubble");
    bubbleText = document.getElementById("chibi-bubble-text");

    // Lắng nghe sự kiện
    setupEvents();
  }

  function showSpeechBubble(text = null, duration = 4000) {
    if (!speechBubble || !bubbleText) return;
    const quote = text || QUOTES[Math.floor(Math.random() * QUOTES.length)];
    bubbleText.textContent = quote;
    speechBubble.classList.add("active");

    clearTimeout(speechBubble._timer);
    speechBubble._timer = setTimeout(() => {
      speechBubble.classList.remove("active");
    }, duration);
  }

  function spawnHearts(x, y) {
    for (let i = 0; i < 4; i++) {
      const heart = document.createElement("div");
      heart.className = "chibi-heart-float";
      heart.textContent = ["💖", "✨", "🌸", "⭐"][Math.floor(Math.random() * 4)];
      heart.style.left = `${20 + Math.random() * 36}px`;
      heart.style.top = `${Math.random() * 20}px`;
      heart.style.setProperty("--rx", `${(Math.random() - 0.5) * 45}px`);
      chibiContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 950);
    }
  }

  function setupEvents() {
    // Click vào Chibi -> Nhảy lên vui sướng
    chibiChar.addEventListener("click", (e) => {
      if (isDragging) return;
      playHappySound();
      spawnHearts();
      chibiChar.classList.remove("chibi-walking");
      chibiChar.classList.add("chibi-jumping");
      showSpeechBubble("Yahh! Cảm ơn bạn đã ghé thăm Clothique! 💖", 3500);

      setTimeout(() => {
        chibiChar.classList.remove("chibi-jumping");
        if (state === "WALK") chibiChar.classList.add("chibi-walking");
      }, 550);
    });

    // Nút đóng/ẩn
    const toggleBtn = document.getElementById("chibi-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chibiContainer.style.display = "none";
      });
    }

    // Kéo thả (Drag & Drop)
    chibiContainer.addEventListener("pointerdown", (e) => {
      if (e.target === toggleBtn) return;
      isDragging = true;
      chibiContainer.classList.add("dragging");
      chibiChar.classList.remove("chibi-walking");
      dragOffsetX = e.clientX - posX;
      dragOffsetY = e.clientY - (window.innerHeight - 108 - posY);
      chibiContainer.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      posX = Math.max(10, Math.min(window.innerWidth - CHIBI_WIDTH - 10, e.clientX - dragOffsetX));
      posY = Math.max(0, Math.min(window.innerHeight - CHIBI_HEIGHT, window.innerHeight - 108 - (e.clientY - dragOffsetY)));
      updatePosition();
    });

    window.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      chibiContainer.classList.remove("dragging");
      // Trọng lực hạ cánh nhẹ nhàng về đáy màn hình nếu đang lơ lửng
      if (posY > 0) {
        let fallAnim = setInterval(() => {
          posY -= 6;
          if (posY <= 0) {
            posY = 0;
            clearInterval(fallAnim);
            if (state === "WALK") chibiChar.classList.add("chibi-walking");
          }
          updatePosition();
        }, 16);
      } else {
        if (state === "WALK") chibiChar.classList.add("chibi-walking");
      }
    });

    // Lần đầu tải trang: Chibi chào sau 2s
    setTimeout(() => {
      showSpeechBubble("Hé nhô bạn! Tớ là trợ lý thời trang Chibi nè! ✨", 4500);
    }, 2000);

    // Cứ mỗi 16-24s Chibi lại phát một câu thoại ngẫu nhiên
    setInterval(() => {
      if (Math.random() > 0.35 && !isDragging) {
        showSpeechBubble();
      }
    }, 20000);
  }

  function updatePosition() {
    chibiContainer.style.transform = `translate(${posX}px, ${-posY}px)`;
    chibiChar.style.transform = `scaleX(${direction})`;
  }

  // Vòng lặp chuyển động AI của Chibi
  function loop() {
    if (!isDragging && chibiContainer.style.display !== "none") {
      const maxX = window.innerWidth - CHIBI_WIDTH - 20;
      const minX = 20;

      if (state === "WALK") {
        posX += speed * direction;

        // Chạm biên phải -> quay đầu
        if (posX >= maxX) {
          posX = maxX;
          direction = -1;
          state = "IDLE";
          stateTimer = Date.now() + 2000 + Math.random() * 3000;
          chibiChar.classList.remove("chibi-walking");
        }
        // Chạm biên trái -> quay đầu
        else if (posX <= minX) {
          posX = minX;
          direction = 1;
          state = "IDLE";
          stateTimer = Date.now() + 2000 + Math.random() * 3000;
          chibiChar.classList.remove("chibi-walking");
        }
        // Thi thoảng ngẫu nhiên dừng lại ngắm cảnh
        else if (Math.random() < 0.003) {
          state = "IDLE";
          stateTimer = Date.now() + 1800 + Math.random() * 2500;
          chibiChar.classList.remove("chibi-walking");
        }
      } else if (state === "IDLE") {
        if (Date.now() > stateTimer) {
          state = "WALK";
          chibiChar.classList.add("chibi-walking");
          // Có xác suất đảo hướng sau khi dừng
          if (Math.random() < 0.4) {
            direction *= -1;
          }
        }
      }

      updatePosition();
    }

    requestAnimationFrame(loop);
  }

  function init() {
    createChibiHTML();
    updatePosition();
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

