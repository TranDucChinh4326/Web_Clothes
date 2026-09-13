/**
 * Interactive Chibi Fashion Mascot (Clothique Assistant) - V2.0 True Walk Cycle
 * - Mô phỏng chu kỳ bước chân thực tế (Realistic Anatomical Walk Cycle):
 *   + Chân trái & Chân phải bước so le, co gối nhấc mũi giày và gót chạm đất tự nhiên.
 *   + Hai tay đánh so le ngược chiều với bước chân (Arm Swing Dynamics).
 *   + Trọng tâm cơ thể và đầu nhấp nhô (Bounce & Bobbing) 2 nhịp theo từng sải chân.
 *   + Mắt chớp tự nhiên (Eye Blink Animation) cứ mỗi 4 giây.
 *   + Vạt áo khoác măng tô và bóng đổ dưới chân co giãn nhịp nhàng theo bước đi.
 * - Tương tác bấm vào: Bật nhảy cẫng lên vui sướng (Jump State) với hợp âm Web Audio & chùm tim.
 * - Cho phép kéo thả (Drag & Drop) với tư thế chân đung đưa trên không (Dangle State).
 * - Bóng thoại trò chuyện với các mẹo thời trang & mã giảm giá.
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

  function setState(newState) {
    state = newState;
    if (!chibiChar) return;
    chibiChar.classList.remove("chibi-state-walk", "chibi-state-idle", "chibi-state-jump", "chibi-state-drag");
    chibiChar.classList.add(`chibi-state-${newState.toLowerCase()}`);
  }

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

        gain.gain.setValueAtTime(0.045, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.22);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.22);
      });
    } catch (e) {}
  }

  function createChibiHTML() {
    // Chèn CSS cho Chibi với cơ chế Animation bước chân giải phẫu học
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
        filter: drop-shadow(0 10px 20px rgba(15, 23, 42, 0.2));
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

      /* ======================================================== */
      /* CHU KỲ BƯỚC CHÂN CHÂN THỰC (TRUE REALISTIC WALK CYCLE)    */
      /* ======================================================== */

      /* Nhấp nhô trọng tâm cơ thể theo từng bước sải chân */
      .chibi-state-walk #chibi-body-group {
        animation: chibi-body-bounce 0.65s ease-in-out infinite;
      }
      @keyframes chibi-body-bounce {
        0% {
          transform: translateY(1.5px) rotate(-0.8deg);
        }
        25% {
          /* Chân sau co nhấc qua, thân người nâng cao */
          transform: translateY(-4px) rotate(1deg);
        }
        50% {
          /* Chân kia tiếp đất, cơ thể hạ nhẹ */
          transform: translateY(1.5px) rotate(-0.8deg);
        }
        75% {
          /* Chân nọ co nhấc qua, thân người nâng cao */
          transform: translateY(-4px) rotate(1deg);
        }
        100% {
          transform: translateY(1.5px) rotate(-0.8deg);
        }
      }

      /* Chân trái (Left Leg) - Đứng trước */
      .chibi-state-walk #chibi-leg-left {
        transform-origin: 43px 93px;
        animation: chibi-leg-left-walk 0.65s ease-in-out infinite;
      }
      @keyframes chibi-leg-left-walk {
        0% {
          /* Vươn về trước, gót giày chuẩn bị chạm đất */
          transform: rotate(25deg) translateY(-0.8px);
        }
        25% {
          /* Tiếp đất vững chắc, chân làm trụ đứng thẳng */
          transform: rotate(0deg) translateY(0);
        }
        50% {
          /* Đạp lùi về phía sau */
          transform: rotate(-22deg) translateY(0);
        }
        75% {
          /* Gập gối, nhấc mũi giày lên cao lướt về trước */
          transform: rotate(4deg) translateY(-6.5px) scaleY(0.92);
        }
        100% {
          transform: rotate(25deg) translateY(-0.8px);
        }
      }

      /* Chân phải (Right Leg) - Lệch pha 50% so với chân trái */
      .chibi-state-walk #chibi-leg-right {
        transform-origin: 57px 93px;
        animation: chibi-leg-right-walk 0.65s ease-in-out infinite;
      }
      @keyframes chibi-leg-right-walk {
        0% {
          /* Đạp lùi về phía sau */
          transform: rotate(-22deg) translateY(0);
        }
        25% {
          /* Gập gối, nhấc mũi giày lên cao lướt về trước */
          transform: rotate(4deg) translateY(-6.5px) scaleY(0.92);
        }
        50% {
          /* Vươn về trước, gót giày chuẩn bị chạm đất */
          transform: rotate(25deg) translateY(-0.8px);
        }
        75% {
          /* Tiếp đất vững chắc, chân làm trụ đứng thẳng */
          transform: rotate(0deg) translateY(0);
        }
        100% {
          transform: rotate(-22deg) translateY(0);
        }
      }

      /* Tay trái (Đánh tay đối xứng ngược với chân trái) */
      .chibi-state-walk #chibi-arm-left {
        transform-origin: 32px 73px;
        animation: chibi-arm-left-swing 0.65s ease-in-out infinite;
      }
      @keyframes chibi-arm-left-swing {
        0% {
          transform: rotate(-26deg);
        }
        50% {
          transform: rotate(24deg);
        }
        100% {
          transform: rotate(-26deg);
        }
      }

      /* Tay phải (Đánh tay đối xứng ngược với chân phải) */
      .chibi-state-walk #chibi-arm-right {
        transform-origin: 70px 73px;
        animation: chibi-arm-right-swing 0.65s ease-in-out infinite;
      }
      @keyframes chibi-arm-right-swing {
        0% {
          transform: rotate(24deg);
        }
        50% {
          transform: rotate(-26deg);
        }
        100% {
          transform: rotate(24deg);
        }
      }

      /* Bóng đổ co giãn theo khoảng cách hai chân */
      .chibi-state-walk #chibi-shadow {
        transform-origin: 50px 120px;
        animation: chibi-shadow-stride 0.65s ease-in-out infinite;
      }
      @keyframes chibi-shadow-stride {
        0%, 50%, 100% {
          transform: scaleX(1.18) scaleY(0.85);
          opacity: 0.28;
        }
        25%, 75% {
          transform: scaleX(0.85) scaleY(1.1);
          opacity: 0.18;
        }
      }

      /* Vạt áo măng tô bay nhẹ nhàng */
      .chibi-state-walk #chibi-coat-body {
        transform-origin: 50px 76px;
        animation: chibi-coat-sway 0.65s ease-in-out infinite;
      }
      @keyframes chibi-coat-sway {
        0%, 100% { transform: rotate(-1.2deg); }
        50% { transform: rotate(1.5deg); }
      }

      /* ======================================================== */
      /* TRẠNG THÁI ĐỨNG NGHỈ (IDLE STATE)                        */
      /* ======================================================== */
      .chibi-state-idle #chibi-body-group {
        animation: chibi-breathe 2.4s ease-in-out infinite alternate;
      }
      .chibi-state-idle #chibi-leg-left,
      .chibi-state-idle #chibi-leg-right {
        transform: rotate(0) translateY(0);
      }
      .chibi-state-idle #chibi-arm-left,
      .chibi-state-idle #chibi-arm-right {
        transform: rotate(0);
      }
      .chibi-state-idle #chibi-shadow {
        transform: scale(1);
        opacity: 0.24;
      }
      @keyframes chibi-breathe {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-2.5px) scale(1.008, 1.015);
        }
      }

      /* Mắt chớp nháy Anime tự nhiên */
      #chibi-eyes {
        transform-origin: 50px 45px;
        animation: chibi-blink 4.2s infinite;
      }
      @keyframes chibi-blink {
        0%, 92%, 96%, 100% {
          transform: scaleY(1);
        }
        94% {
          transform: scaleY(0.08);
        }
      }

      /* ======================================================== */
      /* TRẠNG THÁI NHẢY CẪNG VUI SƯỚNG (JUMP STATE)              */
      /* ======================================================== */
      .chibi-state-jump #chibi-body-group {
        animation: chibi-jump-body 0.62s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
      }
      .chibi-state-jump #chibi-leg-left,
      .chibi-state-jump #chibi-leg-right {
        animation: chibi-jump-legs 0.62s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
      }
      .chibi-state-jump #chibi-arm-left {
        animation: chibi-jump-arm-l 0.62s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
      }
      .chibi-state-jump #chibi-arm-right {
        animation: chibi-jump-arm-r 0.62s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
      }
      .chibi-state-jump #chibi-shadow {
        animation: chibi-jump-shadow 0.62s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
      }
      @keyframes chibi-jump-body {
        0% { transform: translateY(0) scale(1, 1); }
        22% { transform: translateY(5px) scale(1.18, 0.82); }
        55% { transform: translateY(-42px) scale(0.92, 1.1); }
        72% { transform: translateY(-44px) scale(1, 1); }
        90% { transform: translateY(3px) scale(1.12, 0.88); }
        100% { transform: translateY(0) scale(1, 1); }
      }
      @keyframes chibi-jump-legs {
        0% { transform: translateY(0) scaleY(1); }
        22% { transform: translateY(0) scaleY(0.68); }
        55% { transform: translateY(-10px) scaleY(0.85); }
        90% { transform: translateY(2px) scaleY(0.9); }
        100% { transform: translateY(0) scaleY(1); }
      }
      @keyframes chibi-jump-arm-l {
        0% { transform: rotate(0); }
        22% { transform: rotate(15deg); }
        55% { transform: rotate(-65deg); }
        100% { transform: rotate(0); }
      }
      @keyframes chibi-jump-arm-r {
        0% { transform: rotate(0); }
        22% { transform: rotate(-15deg); }
        55% { transform: rotate(65deg); }
        100% { transform: rotate(0); }
      }
      @keyframes chibi-jump-shadow {
        0%, 100% { transform: scale(1); opacity: 0.24; }
        22% { transform: scale(1.2); opacity: 0.35; }
        55% { transform: scale(0.5); opacity: 0.08; }
        90% { transform: scale(1.15); opacity: 0.3; }
      }

      /* ======================================================== */
      /* TRẠNG THÁI KÉO THẢ (DRAG STATE)                          */
      /* ======================================================== */
      .chibi-state-drag #chibi-leg-left {
        animation: chibi-dangle-l 0.45s ease-in-out infinite alternate;
      }
      .chibi-state-drag #chibi-leg-right {
        animation: chibi-dangle-r 0.45s ease-in-out infinite alternate;
      }
      .chibi-state-drag #chibi-arm-left {
        transform: rotate(-40deg);
      }
      .chibi-state-drag #chibi-arm-right {
        transform: rotate(40deg);
      }
      .chibi-state-drag #chibi-shadow {
        transform: scale(0.6);
        opacity: 0.1;
      }
      @keyframes chibi-dangle-l {
        0% { transform: rotate(-14deg); }
        100% { transform: rotate(18deg); }
      }
      @keyframes chibi-dangle-r {
        0% { transform: rotate(18deg); }
        100% { transform: rotate(-14deg); }
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

    // SVG Chibi Mascot Vector với phân tầng giải phẫu hoàn chỉnh
    chibiContainer.innerHTML = `
      <div id="chibi-speech-bubble">
        <span id="chibi-bubble-text">Chào bạn!</span>
      </div>

      <div id="chibi-toggle-btn" title="Thu nhỏ/Ẩn chibi">✕</div>

      <div id="clothique-chibi-char" class="chibi-state-walk">
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
            <linearGradient id="chibi-coat-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#b07e4d" />
              <stop offset="100%" stop-color="#9a693c" />
            </linearGradient>
            <linearGradient id="chibi-hair-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4a3728" />
              <stop offset="100%" stop-color="#2d1e14" />
            </linearGradient>
          </defs>

          <!-- 1. Shadow dưới chân -->
          <ellipse id="chibi-shadow" cx="50" cy="120" rx="26" ry="5.5" fill="rgba(15, 23, 42, 0.22)" />

          <!-- 2. Chân sau (Right Leg - Shaded Background) -->
          <g id="chibi-leg-right">
            <!-- Đùi & Ống quần sau -->
            <path d="M53 92 L61 92 L60 104 L52 104 Z" fill="#151e2e" />
            <!-- Cổ boots da thời trang -->
            <path d="M51 104 L62 104 L61 116 L51 116 Z" fill="#090e1a" />
            <rect x="53" y="107" width="5.5" height="1.8" rx="0.8" fill="#b08050" />
            <!-- Bàn chân có đế & mũi giày hướng về phía trước -->
            <path d="M49 115 L62 115 C66.5 115 68 117.5 64 119.5 L48 119.5 C47 117.5 47 115 49 115 Z" fill="#010409" />
            <rect x="48" y="119.5" width="16.5" height="2" rx="1" fill="#243247" />
          </g>

          <!-- 3. Chân trước (Left Leg - Foreground) -->
          <g id="chibi-leg-left">
            <!-- Đùi & Ống quần trước -->
            <path d="M39 92 L47 92 L46 104 L38 104 Z" fill="#1e293b" />
            <!-- Cổ boots da -->
            <path d="M37 104 L48 104 L47 116 L37 116 Z" fill="#0f172a" />
            <rect x="39" y="107" width="5.5" height="1.8" rx="0.8" fill="#d4a373" />
            <!-- Bàn chân có đế & mũi giày sắc nét -->
            <path d="M35 115 L48 115 C52.5 115 54 117.5 50 119.5 L34 119.5 C33 117.5 33 115 35 115 Z" fill="#020617" />
            <rect x="34" y="119.5" width="16.5" height="2" rx="1" fill="#334155" />
          </g>

          <!-- 4. Nhóm thân trên & đầu (Upper Body Group) -->
          <g id="chibi-body-group">
            <!-- Tóc sau -->
            <path d="M26 48 C20 70, 24 95, 32 100 C36 85, 32 60, 32 48 Z" fill="url(#chibi-hair-grad)" />
            <path d="M74 48 C80 70, 76 95, 68 100 C64 85, 68 60, 68 48 Z" fill="url(#chibi-hair-grad)" />

            <!-- Tay phải (Phía sau) -->
            <g id="chibi-arm-right">
              <path d="M68 73 Q76 83 72 89" stroke="url(#chibi-coat-dark-grad)" stroke-width="6" stroke-linecap="round" fill="none" />
              <circle cx="72" cy="89" r="3.2" fill="#fbd0bc" />
            </g>

            <!-- Áo khoác Blazer dáng Chibi -->
            <path id="chibi-coat-body" d="M30 76 L36 102 L64 102 L70 76 L62 66 L38 66 Z" fill="url(#chibi-coat-grad)" />
            
            <!-- Khăn quàng cổ thanh lịch -->
            <path d="M38 66 Q50 74 62 66 Q58 72 50 72 Q42 72 38 66 Z" fill="#fafaf9" />
            <rect x="46" y="70" width="8" height="16" rx="2" fill="#fafaf9" />

            <!-- Túi xách mini đeo chéo Clothique -->
            <rect x="62" y="82" width="14" height="11" rx="2.5" fill="#1e293b" />
            <line x1="42" y1="67" x2="63" y2="84" stroke="#d4a373" stroke-width="1.8" />
            <circle cx="69" cy="87" r="1.5" fill="#d4a373" />

            <!-- Tay trái (Phía trước) -->
            <g id="chibi-arm-left">
              <path d="M32 73 Q24 83 28 89" stroke="url(#chibi-coat-grad)" stroke-width="6.5" stroke-linecap="round" fill="none" />
              <circle cx="28" cy="89" r="3.5" fill="#fde2d0" />
            </g>

            <!-- Khuôn mặt Chibi tròn phúng phính -->
            <ellipse cx="50" cy="46" rx="26" ry="24" fill="#fde2d0" />

            <!-- Má hồng Chibi siêu cưng -->
            <ellipse cx="32" cy="52" rx="4.5" ry="2.5" fill="#fca5a5" opacity="0.65" />
            <ellipse cx="68" cy="52" rx="4.5" ry="2.5" fill="#fca5a5" opacity="0.65" />

            <!-- Mắt to long lanh kiểu anime với hiệu ứng chớp mắt -->
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

            <!-- Tóc mái phồng thời trang -->
            <path d="M26 38 C32 26, 44 26, 50 30 C56 26, 68 26, 74 38 C70 34, 62 33, 58 37 C54 33, 44 33, 38 38 C34 35, 28 35, 26 38 Z" fill="url(#chibi-hair-grad)" />

            <!-- Mũ nồi Beret phong cách Parisian Chic -->
            <ellipse cx="50" cy="24" rx="27" ry="11" fill="url(#chibi-beret-grad)" />
            <circle cx="50" cy="14" r="2.5" fill="#c28e5c" />
            <ellipse cx="50" cy="28" rx="22" ry="4" fill="#0f172a" opacity="0.4" />
          </g>
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

  function spawnHearts() {
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement("div");
      heart.className = "chibi-heart-float";
      heart.textContent = ["💖", "✨", "🌸", "⭐", "💕"][Math.floor(Math.random() * 5)];
      heart.style.left = `${18 + Math.random() * 40}px`;
      heart.style.top = `${Math.random() * 20}px`;
      heart.style.setProperty("--rx", `${(Math.random() - 0.5) * 50}px`);
      chibiContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 950);
    }
  }

  function setupEvents() {
    // Click vào Chibi -> Nhảy lên vui sướng
    chibiChar.addEventListener("click", () => {
      if (isDragging) return;
      playHappySound();
      spawnHearts();
      const prevState = state;
      setState("JUMP");
      showSpeechBubble("Yahh! Cảm ơn bạn đã ghé thăm Clothique! 💖", 3500);

      setTimeout(() => {
        setState(prevState === "WALK" ? "WALK" : "IDLE");
      }, 620);
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
      setState("DRAG");
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

    window.addEventListener("pointerup", () => {
      if (!isDragging) return;
      isDragging = false;
      chibiContainer.classList.remove("dragging");
      // Trọng lực hạ cánh nhẹ nhàng về đáy màn hình nếu đang lơ lửng
      if (posY > 0) {
        let fallAnim = setInterval(() => {
          posY -= 7;
          if (posY <= 0) {
            posY = 0;
            clearInterval(fallAnim);
            setState("WALK");
          }
          updatePosition();
        }, 16);
      } else {
        setState("WALK");
      }
    });

    // Lần đầu tải trang: Chibi chào sau 2s
    setTimeout(() => {
      showSpeechBubble("Hé nhô bạn! Tớ là trợ lý thời trang Chibi nè! ✨", 4500);
    }, 2000);

    // Cứ mỗi 18-25s Chibi lại phát một câu thoại ngẫu nhiên
    setInterval(() => {
      if (Math.random() > 0.35 && !isDragging && state !== "JUMP") {
        showSpeechBubble();
      }
    }, 22000);
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
          setState("IDLE");
          stateTimer = Date.now() + 2000 + Math.random() * 2500;
        }
        // Chạm biên trái -> quay đầu
        else if (posX <= minX) {
          posX = minX;
          direction = 1;
          setState("IDLE");
          stateTimer = Date.now() + 2000 + Math.random() * 2500;
        }
        // Thi thoảng ngẫu nhiên dừng lại ngắm cảnh
        else if (Math.random() < 0.003) {
          setState("IDLE");
          stateTimer = Date.now() + 1800 + Math.random() * 2500;
        }
      } else if (state === "IDLE") {
        if (Date.now() > stateTimer) {
          setState("WALK");
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
    setState("WALK");
    updatePosition();
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
