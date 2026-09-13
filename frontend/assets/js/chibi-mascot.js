/**
 * Interactive Chibi Fashion Mascot (Clothique Assistant) - V3.0 Smart Product Recognition
 * - Tính năng nhận diện thẻ sản phẩm (Smart Product Detection & Pointing):
 *   + Tự động quét các thẻ sản phẩm (.product-card) đang hiển thị trong tầm nhìn màn hình.
 *   + Khi đi ngang qua bên dưới hoặc định kỳ, Chibi dừng bước, xoay người về phía sản phẩm.
 *   + Giơ tay chỉ thẳng lên thẻ sản phẩm (Pointing Gesture với ngón trỏ & hiệu ứng lấp lánh 👆✨).
 *   + Thẻ sản phẩm phát sáng với viền aura vàng sang trọng & huy hiệu nổi "✨ Chibi gợi ý nè!".
 *   + Phát âm thanh leng keng thần tiên (Sparkle Chime via Web Audio API).
 *   + Mở bóng thoại giới thiệu chính xác tên sản phẩm & giá tiền thực tế cùng lời khen có cánh.
 *   + Người dùng có thể click vào bóng thoại để xem ngay chi tiết sản phẩm.
 *   + Khi người dùng rê chuột (hover) vào sản phẩm, Chibi cũng tương tác nhìn và chỉ vào sản phẩm đó.
 * - Chu kỳ bước chân thật giải phẫu học (True Walk Cycle V2.0): Chân so le, gập gối, nhấc gót, vung tay, chớp mắt.
 * - Bật nhảy cẫng vui sướng khi click chuột & đung đưa chân khi bị kéo thả (Drag & Drop).
 */
(function () {
  const CHIBI_WIDTH = 76;
  const CHIBI_HEIGHT = 96;

  // Danh sách câu thoại chung ngẫu nhiên
  const GENERAL_QUOTES = [
    "Chào bạn! Chúc bạn một ngày shopping vui vẻ nha! ✨",
    "Nhập mã CLOTHIQUE10 được giảm ngay 10% đó! 🎁",
    "Đơn từ 500k là được Miễn phí vận chuyển tận nhà nè! 🚀",
    "Bạn cần tư vấn size đồ cứ nhắn tớ nha! 👗",
    "Chạm vào tớ để tớ làm xiếc nhảy múa cho xem! 💃",
    "Clothique cam kết 100% sợi tự nhiên thoáng mát nhé! 🌿"
  ];

  let chibiContainer, chibiChar, speechBubble, bubbleText, pointerIndicator;
  let posX = 80;
  let posY = 0;
  let speed = 1.15;
  let direction = 1; // 1: phải, -1: trái
  let state = "WALK"; // WALK, IDLE, JUMP, DRAG, POINT
  let stateTimer = 0;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let audioCtx = null;

  // Quản lý trạng thái nhận diện sản phẩm
  let currentTargetCard = null;
  let lastPointedCard = null;
  let lastPointTime = Date.now() + 2500; // Khởi động kiểm tra sau 2.5s
  let isPointing = false;
  let lastScanCheck = 0;

  function setState(newState) {
    state = newState;
    if (!chibiChar) return;
    chibiChar.classList.remove(
      "chibi-state-walk",
      "chibi-state-idle",
      "chibi-state-jump",
      "chibi-state-drag",
      "chibi-state-point"
    );
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

  // Âm thanh leng keng lấp lánh thần tiên khi chỉ vào sản phẩm
  function playSparkleSound() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;
      [1318.5, 1661.2, 1975.5, 2637.0].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.065);

        gain.gain.setValueAtTime(0.035, now + i * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.065 + 0.28);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.065);
        osc.stop(now + i * 0.065 + 0.28);
      });
    } catch (e) {}
  }

  function createChibiHTML() {
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
      /* HIGHLIGHT THẺ SẢN PHẨM KHI ĐƯỢC CHIBI CHỈ VÀO             */
      /* ======================================================== */
      .product-card.chibi-highlight-card {
        position: relative;
        outline: 3px solid #d4a373 !important;
        box-shadow: 0 16px 36px rgba(212, 163, 115, 0.4), 0 0 24px rgba(212, 163, 115, 0.45) !important;
        transform: translateY(-8px) scale(1.025) !important;
        transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
        z-index: 90 !important;
      }
      .product-card.chibi-highlight-card::after {
        content: "✨ Chibi gợi ý nè!";
        position: absolute;
        top: -12px;
        right: 14px;
        background: linear-gradient(135deg, #d4a373 0%, #b07e4d 100%);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 12px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        animation: chibi-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 100;
      }
      @keyframes chibi-badge-pop {
        0% { transform: scale(0.6) translateY(8px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }

      /* Hiệu ứng con trỏ lấp lánh phía trên tay Chibi */
      #chibi-pointer-indicator {
        position: absolute;
        top: -30px;
        left: 36px;
        font-size: 24px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
        animation: pointer-sparkle-bob 0.8s ease-in-out infinite alternate;
        filter: drop-shadow(0 2px 8px rgba(212, 163, 115, 0.6));
      }
      .chibi-state-point #chibi-pointer-indicator {
        opacity: 1;
      }
      @keyframes pointer-sparkle-bob {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-7px) scale(1.2); }
      }

      /* ======================================================== */
      /* TRẠNG THÁI CHỈ TAY VÀO SẢN PHẨM (POINT STATE)            */
      /* ======================================================== */
      .chibi-state-point #chibi-body-group {
        transform: rotate(-3deg) translateY(-2px);
        transition: transform 0.3s ease;
      }
      .chibi-state-point #chibi-eyes {
        transform: translateY(-2.5px) scale(1.05);
      }
      .chibi-state-point #chibi-leg-left {
        transform: rotate(6deg) translateY(0);
        transition: transform 0.3s ease;
      }
      .chibi-state-point #chibi-leg-right {
        transform: rotate(-4deg) translateY(0);
        transition: transform 0.3s ease;
      }
      .chibi-state-point #chibi-arm-right {
        transform: rotate(20deg);
        transition: transform 0.3s ease;
      }
      .chibi-state-point #chibi-shadow {
        transform: scale(0.95);
        opacity: 0.22;
      }
      .chibi-state-point #chibi-arm-left {
        transform-origin: 32px 73px;
        animation: chibi-arm-point-anim 1.1s ease-in-out infinite alternate;
      }
      @keyframes chibi-arm-point-anim {
        0% {
          transform: rotate(-108deg) scale(1);
        }
        100% {
          transform: rotate(-118deg) scale(1.05);
        }
      }

      /* ======================================================== */
      /* CHU KỲ BƯỚC CHÂN CHÂN THỰC (TRUE REALISTIC WALK CYCLE)    */
      /* ======================================================== */
      .chibi-state-walk #chibi-body-group {
        animation: chibi-body-bounce 0.65s ease-in-out infinite;
      }
      @keyframes chibi-body-bounce {
        0% { transform: translateY(1.5px) rotate(-0.8deg); }
        25% { transform: translateY(-4px) rotate(1deg); }
        50% { transform: translateY(1.5px) rotate(-0.8deg); }
        75% { transform: translateY(-4px) rotate(1deg); }
        100% { transform: translateY(1.5px) rotate(-0.8deg); }
      }

      .chibi-state-walk #chibi-leg-left {
        transform-origin: 43px 93px;
        animation: chibi-leg-left-walk 0.65s ease-in-out infinite;
      }
      @keyframes chibi-leg-left-walk {
        0% { transform: rotate(25deg) translateY(-0.8px); }
        25% { transform: rotate(0deg) translateY(0); }
        50% { transform: rotate(-22deg) translateY(0); }
        75% { transform: rotate(4deg) translateY(-6.5px) scaleY(0.92); }
        100% { transform: rotate(25deg) translateY(-0.8px); }
      }

      .chibi-state-walk #chibi-leg-right {
        transform-origin: 57px 93px;
        animation: chibi-leg-right-walk 0.65s ease-in-out infinite;
      }
      @keyframes chibi-leg-right-walk {
        0% { transform: rotate(-22deg) translateY(0); }
        25% { transform: rotate(4deg) translateY(-6.5px) scaleY(0.92); }
        50% { transform: rotate(25deg) translateY(-0.8px); }
        75% { transform: rotate(0deg) translateY(0); }
        100% { transform: rotate(-22deg) translateY(0); }
      }

      .chibi-state-walk #chibi-arm-left {
        transform-origin: 32px 73px;
        animation: chibi-arm-left-swing 0.65s ease-in-out infinite;
      }
      @keyframes chibi-arm-left-swing {
        0% { transform: rotate(-26deg); }
        50% { transform: rotate(24deg); }
        100% { transform: rotate(-26deg); }
      }

      .chibi-state-walk #chibi-arm-right {
        transform-origin: 70px 73px;
        animation: chibi-arm-right-swing 0.65s ease-in-out infinite;
      }
      @keyframes chibi-arm-right-swing {
        0% { transform: rotate(24deg); }
        50% { transform: rotate(-26deg); }
        100% { transform: rotate(24deg); }
      }

      .chibi-state-walk #chibi-shadow {
        transform-origin: 50px 120px;
        animation: chibi-shadow-stride 0.65s ease-in-out infinite;
      }
      @keyframes chibi-shadow-stride {
        0%, 50%, 100% { transform: scaleX(1.18) scaleY(0.85); opacity: 0.28; }
        25%, 75% { transform: scaleX(0.85) scaleY(1.1); opacity: 0.18; }
      }

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
        0% { transform: translateY(0); }
        100% { transform: translateY(-2.5px) scale(1.008, 1.015); }
      }

      /* Mắt chớp Anime tự nhiên */
      #chibi-eyes {
        transform-origin: 50px 45px;
        animation: chibi-blink 4.2s infinite;
      }
      @keyframes chibi-blink {
        0%, 92%, 96%, 100% { transform: scaleY(1); }
        94% { transform: scaleY(0.08); }
      }

      /* ======================================================== */
      /* TRẠNG THÁI NHẢY CẪNG (JUMP STATE)                        */
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
        padding: 9px 14px;
        border-radius: 14px;
        font-size: 12.5px;
        font-weight: 600;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
        border: 1.5px solid #e2e8f0;
        white-space: normal;
        width: 175px;
        text-align: center;
        line-height: 1.4;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
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
        z-index: 20;
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

    // SVG Chibi Mascot Vector
    chibiContainer.innerHTML = `
      <div id="chibi-speech-bubble">
        <span id="chibi-bubble-text">Chào bạn!</span>
      </div>

      <div id="chibi-toggle-btn" title="Thu nhỏ/Ẩn chibi">✕</div>

      <div id="chibi-pointer-indicator" title="Sản phẩm được Chibi gợi ý">👆✨</div>

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
            <path d="M53 92 L61 92 L60 104 L52 104 Z" fill="#151e2e" />
            <path d="M51 104 L62 104 L61 116 L51 116 Z" fill="#090e1a" />
            <rect x="53" y="107" width="5.5" height="1.8" rx="0.8" fill="#b08050" />
            <path d="M49 115 L62 115 C66.5 115 68 117.5 64 119.5 L48 119.5 C47 117.5 47 115 49 115 Z" fill="#010409" />
            <rect x="48" y="119.5" width="16.5" height="2" rx="1" fill="#243247" />
          </g>

          <!-- 3. Chân trước (Left Leg - Foreground) -->
          <g id="chibi-leg-left">
            <path d="M39 92 L47 92 L46 104 L38 104 Z" fill="#1e293b" />
            <path d="M37 104 L48 104 L47 116 L37 116 Z" fill="#0f172a" />
            <rect x="39" y="107" width="5.5" height="1.8" rx="0.8" fill="#d4a373" />
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

            <!-- Tay trái (Phía trước) với ngón trỏ chỉ đường -->
            <g id="chibi-arm-left">
              <path d="M32 73 Q24 83 28 89" stroke="url(#chibi-coat-grad)" stroke-width="6.5" stroke-linecap="round" fill="none" />
              <circle cx="28" cy="89" r="3.5" fill="#fde2d0" />
              <!-- Đầu ngón trỏ chỉ thẳng -->
              <path d="M28 89 L24 94" stroke="#fde2d0" stroke-width="2.5" stroke-linecap="round" />
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
    pointerIndicator = document.getElementById("chibi-pointer-indicator");

    setupEvents();
  }

  function showSpeechBubble(text = null, duration = 4000) {
    if (!speechBubble || !bubbleText) return;
    const quote = text || GENERAL_QUOTES[Math.floor(Math.random() * GENERAL_QUOTES.length)];
    bubbleText.textContent = quote;
    speechBubble.style.width = "175px";
    speechBubble.style.pointerEvents = "none";
    speechBubble.classList.add("active");

    clearTimeout(speechBubble._timer);
    speechBubble._timer = setTimeout(() => {
      speechBubble.classList.remove("active");
    }, duration);
  }

  // Hiển thị bóng thoại giới thiệu sản phẩm có link chi tiết
  function showProductSpeechBubble(htmlContent, productLink, duration = 4800) {
    if (!speechBubble || !bubbleText) return;

    bubbleText.innerHTML = `
      <div style="font-size: 12.5px; line-height: 1.4; margin-bottom: 5px;">${htmlContent}</div>
      ${
        productLink && productLink !== "#"
          ? `<a href="${productLink}" style="display:inline-block; font-size:11.5px; color:#c28e5c; text-decoration:underline; font-weight:700;">Xem chi tiết ngay →</a>`
          : ""
      }
    `;
    speechBubble.style.width = "230px";
    speechBubble.style.pointerEvents = "auto";
    speechBubble.classList.add("active");

    clearTimeout(speechBubble._timer);
    speechBubble._timer = setTimeout(() => {
      speechBubble.classList.remove("active");
      speechBubble.style.width = "175px";
      speechBubble.style.pointerEvents = "none";
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

  /* ======================================================== */
  /* THUẬT TOÁN QUÉT & NHẬN DIỆN THẺ SẢN PHẨM TRÊN MÀN HÌNH    */
  /* ======================================================== */
  function getVisibleProductCards() {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    if (!cards.length) return [];

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    return cards.filter((card) => {
      const rect = card.getBoundingClientRect();
      return (
        rect.bottom > 120 &&
        rect.top < vh - 80 &&
        rect.right > 30 &&
        rect.left < vw - 30
      );
    });
  }

  function pointAtProduct(card) {
    if (!card || isPointing || isDragging) return;

    isPointing = true;
    currentTargetCard = card;
    lastPointedCard = card;
    lastPointTime = Date.now();

    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;

    // Xoay hướng mặt về phía thẻ sản phẩm
    direction = cardCenterX >= posX + CHIBI_WIDTH / 2 ? 1 : -1;

    // Highlight thẻ sản phẩm với viền aura vàng sang trọng & huy hiệu
    card.classList.add("chibi-highlight-card");

    // Phát âm thanh leng keng lấp lánh thần tiên
    playSparkleSound();

    // Chuyển sang tư thế CHỈ TAY
    setState("POINT");
    updatePosition();

    // Lấy thông tin thực tế từ thẻ sản phẩm
    const title =
      card.querySelector(".product-title")?.textContent.trim() ||
      "Sản phẩm thiết kế Clothique";
    const price =
      card.querySelector(".price")?.textContent.trim() || "Giá ưu đãi";
    const link =
      card.querySelector("a[href*='product-detail.html']")?.getAttribute("href") ||
      card.querySelector(".product-thumb-wrap a")?.getAttribute("href") ||
      "#";

    const recommendations = [
      `👉 Bạn ơi xem em <b>${title}</b> này nè! Giá chỉ <span style="color:#d4a373; font-weight:700;">${price}</span>, tôn dáng lắm á! ✨`,
      `🔥 Mẫu <b>${title}</b> này đang bán siêu chạy! Giá chỉ <span style="color:#d4a373; font-weight:700;">${price}</span> thôi, thử xem nha! 💖`,
      `✨ Tớ cực mê em <b>${title}</b> này! Chất vải thoáng mát xịn mịn, giá chỉ <span style="color:#d4a373; font-weight:700;">${price}</span>! 👗`,
      `⭐ Gợi ý phối đồ: <b>${title}</b> diện đi tiệc hay đi làm đều sang! Chỉ <span style="color:#d4a373; font-weight:700;">${price}</span>! 🛍️`
    ];

    const chosenQuote =
      recommendations[Math.floor(Math.random() * recommendations.length)];
    showProductSpeechBubble(chosenQuote, link, 4800);

    // Sau 4.6s thì hạ tay xuống, bỏ highlight và tiếp tục bước đi
    setTimeout(() => {
      if (card) card.classList.remove("chibi-highlight-card");
      currentTargetCard = null;
      isPointing = false;
      if (state === "POINT") {
        setState("WALK");
        if (Math.random() < 0.4) direction *= -1;
      }
    }, 4600);
  }

  function checkAndIntroduceProduct() {
    if (isPointing || isDragging || state === "JUMP") return;

    const visibleCards = getVisibleProductCards();
    if (!visibleCards.length) return;

    const currentCenterX = posX + CHIBI_WIDTH / 2;
    const now = Date.now();
    const timeSinceLastPoint = now - lastPointTime;

    let target = null;

    // 1. Kiểm tra xem Chibi có đang bước đi ngang qua bên dưới 1 thẻ sản phẩm nào không
    for (const card of visibleCards) {
      if (card === lastPointedCard && timeSinceLastPoint < 18000) continue;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      // Nếu trục hoành lệch dưới 60px -> Chibi đang đứng ngay bên dưới!
      if (Math.abs(cardCenterX - currentCenterX) < 60) {
        target = card;
        break;
      }
    }

    // 2. Nếu đã lâu (trên 12s) mà chưa đi trúng thẻ nào, chọn thẻ gần nhất
    if (!target && timeSinceLastPoint > 12000) {
      const pool = visibleCards.filter((c) => c !== lastPointedCard);
      const candidates = pool.length ? pool : visibleCards;
      candidates.sort((a, b) => {
        const distA = Math.abs(
          a.getBoundingClientRect().left +
            a.getBoundingClientRect().width / 2 -
            currentCenterX
        );
        const distB = Math.abs(
          b.getBoundingClientRect().left +
            b.getBoundingClientRect().width / 2 -
            currentCenterX
        );
        return distA - distB;
      });
      target = candidates[0];
    }

    if (target) {
      pointAtProduct(target);
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
        if (currentTargetCard) {
          currentTargetCard.classList.remove("chibi-highlight-card");
        }
        chibiContainer.style.display = "none";
      });
    }

    // Kéo thả (Drag & Drop)
    chibiContainer.addEventListener("pointerdown", (e) => {
      if (e.target === toggleBtn) return;
      if (e.target.closest("#chibi-speech-bubble a")) return; // Cho phép click link trong bubble
      isDragging = true;
      chibiContainer.classList.add("dragging");
      setState("DRAG");
      dragOffsetX = e.clientX - posX;
      dragOffsetY = e.clientY - (window.innerHeight - 108 - posY);
      chibiContainer.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      posX = Math.max(
        10,
        Math.min(window.innerWidth - CHIBI_WIDTH - 10, e.clientX - dragOffsetX)
      );
      posY = Math.max(
        0,
        Math.min(
          window.innerHeight - CHIBI_HEIGHT,
          window.innerHeight - 108 - (e.clientY - dragOffsetY)
        )
      );
      updatePosition();
    });

    window.addEventListener("pointerup", () => {
      if (!isDragging) return;
      isDragging = false;
      chibiContainer.classList.remove("dragging");
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

    // Tương tác khi người dùng rê chuột (hover) vào sản phẩm
    document.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".product-card");
      if (card && !isPointing && !isDragging && state === "WALK") {
        const now = Date.now();
        if (now - lastPointTime > 6500) {
          pointAtProduct(card);
        }
      }
    });

    // Lần đầu tải trang: Chibi chào sau 1.8s
    setTimeout(() => {
      showSpeechBubble("Hé nhô bạn! Tớ là trợ lý thời trang Chibi nè! ✨", 4500);
    }, 1800);
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

      // Quét sản phẩm định kỳ mỗi 800ms
      const now = Date.now();
      if (now - lastScanCheck > 800) {
        lastScanCheck = now;
        checkAndIntroduceProduct();
      }

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
