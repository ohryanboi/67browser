// ═══════════════════════════════════════════════════════
// 67Labs OS — App Definitions
// Each entry in APPS is a function that calls createAppWindow()
// ═══════════════════════════════════════════════════════

const APPS = {};

// ──────────────────────────────────────────────────────
// NOTEPAD
// ──────────────────────────────────────────────────────
APPS.notepad = function () {
    const body = `
      <div class="app-toolbar">
        <button onclick="notepadSave()">💾 Save</button>
        <button onclick="notepadClear()">🗑 Clear</button>
        <span class="app-status" id="notepad-status">0 words</span>
      </div>
      <textarea class="notepad-area" id="notepad-text" placeholder="Start typing…" spellcheck="true"></textarea>
    `;
    createAppWindow('notepad', 'Notepad', '📝', body, 680, 500);

    // Restore saved content
    try {
        const saved = localStorage.getItem('67labs_notepad');
        if (saved) document.getElementById('notepad-text').value = saved;
    } catch (_) {}

    document.getElementById('notepad-text').addEventListener('input', () => {
        const txt = document.getElementById('notepad-text').value;
        const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
        document.getElementById('notepad-status').textContent = words + ' word' + (words !== 1 ? 's' : '');
        try { localStorage.setItem('67labs_notepad', txt); } catch (_) {}
    });
    // Trigger word count for restored content
    document.getElementById('notepad-text').dispatchEvent(new Event('input'));
};

function notepadSave() {
    try { localStorage.setItem('67labs_notepad', document.getElementById('notepad-text').value); } catch (_) {}
    const s = document.getElementById('notepad-status');
    const prev = s.textContent;
    s.textContent = '✓ Saved';
    setTimeout(() => s.textContent = prev, 1200);
}
function notepadClear() {
    document.getElementById('notepad-text').value = '';
    document.getElementById('notepad-text').dispatchEvent(new Event('input'));
    try { localStorage.removeItem('67labs_notepad'); } catch (_) {}
}

// ──────────────────────────────────────────────────────
// STICKY NOTES
// ──────────────────────────────────────────────────────
const STICKY_COLORS = ['#fff176','#a5d6a7','#90caf9','#ef9a9a','#ce93d8','#ffcc80'];
let stickyCount = 0;

APPS.stickynotes = function () {
    addStickyNote();
};

function addStickyNote(color, text, x, y) {
    color = color || STICKY_COLORS[stickyCount % STICKY_COLORS.length];
    stickyCount++;
    const id = 'sticky_' + Date.now();
    const desktop = document.getElementById('desktop');
    const el = document.createElement('div');
    el.className = 'sticky-note';
    el.id = id;
    el.style.cssText = `background:${color};left:${x || (120 + stickyCount * 20)}px;top:${y || (80 + stickyCount * 20)}px;`;
    el.innerHTML = `
      <div class="sticky-header" style="background:${shadeColor(color, -15)}">
        <button class="startAppBtn" onclick="addStickyNote()" title="New" style="width:18px;height:18px;font-size:11px;padding:0;border-radius:50%;border:none;background:rgba(0,0,0,.15);cursor:pointer;">+</button>
        <button class="sticky-del" onclick="document.getElementById('${id}').remove()" title="Delete">✕</button>
      </div>
      <textarea class="sticky-body" placeholder="Type here…" style="background:${color}">${text || ''}</textarea>
    `;
    desktop.appendChild(el);

    // Drag
    const hdr = el.querySelector('.sticky-header');
    let dragging = false, ox = 0, oy = 0;
    hdr.addEventListener('mousedown', e => {
        dragging = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        el.style.zIndex = ++winZIndex;
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        el.style.left = (e.clientX - ox) + 'px';
        el.style.top  = (e.clientY - oy)  + 'px';
    });
    document.addEventListener('mouseup', () => dragging = false);
}

function shadeColor(hex, pct) {
    let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.max(0,Math.min(255, r + pct)); g = Math.max(0,Math.min(255, g + pct)); b = Math.max(0,Math.min(255, b + pct));
    return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}



// ──────────────────────────────────────────────────────
// CALCULATOR
// ──────────────────────────────────────────────────────
APPS.calculator = function () {
    const body = `
      <div id="calc">
        <div id="calc-display">
          <div id="calc-expr"></div>
          <div id="calc-val">0</div>
        </div>
        <div id="calc-modes">
          <button class="mode-btn active" onclick="calcMode('std',this)">Standard</button>
          <button class="mode-btn" onclick="calcMode('sci',this)">Scientific</button>
        </div>
        <div id="calc-sci-btns" style="display:none">
          <button class="calc-btn sci fn" onclick="calcSci('Math.sin(')">sin</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.cos(')">cos</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.tan(')">tan</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.log(')">ln</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.sqrt(')">√</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.PI')">π</button>
          <button class="calc-btn sci fn" onclick="calcSci('Math.E')">e</button>
          <button class="calc-btn sci fn" onclick="calcSci('**2')">x²</button>
          <button class="calc-btn sci fn" onclick="calcSci('**')">xⁿ</button>
          <button class="calc-btn sci fn" onclick="calcSci('1/')">1/x</button>
        </div>
        <div id="calc-btns">
          <button class="calc-btn fn" onclick="calcClear()">C</button>
          <button class="calc-btn fn" onclick="calcSign()">±</button>
          <button class="calc-btn fn" onclick="calcPct()">%</button>
          <button class="calc-btn op" onclick="calcOp('/')">÷</button>
          <button class="calc-btn" onclick="calcNum('7')">7</button>
          <button class="calc-btn" onclick="calcNum('8')">8</button>
          <button class="calc-btn" onclick="calcNum('9')">9</button>
          <button class="calc-btn op" onclick="calcOp('*')">×</button>
          <button class="calc-btn" onclick="calcNum('4')">4</button>
          <button class="calc-btn" onclick="calcNum('5')">5</button>
          <button class="calc-btn" onclick="calcNum('6')">6</button>
          <button class="calc-btn op" onclick="calcOp('-')">−</button>
          <button class="calc-btn" onclick="calcNum('1')">1</button>
          <button class="calc-btn" onclick="calcNum('2')">2</button>
          <button class="calc-btn" onclick="calcNum('3')">3</button>
          <button class="calc-btn op" onclick="calcOp('+')">+</button>
          <button class="calc-btn fn" onclick="calcBackspace()">⌫</button>
          <button class="calc-btn" onclick="calcNum('0')">0</button>
          <button class="calc-btn" onclick="calcDot()">.</button>
          <button class="calc-btn eq" onclick="calcEquals()">=</button>
        </div>
      </div>`;
    createAppWindow('calculator', 'Calculator', '🖩', body, 320, 480);
    wireCalcKeyboard();
};

let calcVal = '0', calcExpr = '', calcOp_ = '', calcPrev = '', calcNewNum = true;

function calcDisplay() {
    const v = document.getElementById('calc-val');
    const e = document.getElementById('calc-expr');
    if (v) v.textContent = isNaN(calcVal) ? calcVal : parseFloat(calcVal).toLocaleString('en', {maximumFractionDigits: 10});
    if (e) e.textContent = calcExpr;
}
function calcNum(n) {
    if (calcNewNum) { calcVal = n; calcNewNum = false; }
    else calcVal = (calcVal === '0' ? '' : calcVal) + n;
    calcDisplay();
}
function calcDot() {
    if (calcNewNum) { calcVal = '0.'; calcNewNum = false; }
    else if (!calcVal.includes('.')) calcVal += '.';
    calcDisplay();
}
function calcOp(op) {
    if (calcOp_ && !calcNewNum) calcEquals(true);
    calcPrev = calcVal; calcOp_ = op; calcNewNum = true;
    calcExpr = calcVal + ' ' + {'/':'÷','*':'×','-':'−','+':'+'}[op]; calcDisplay();
}
function calcEquals(silent) {
    if (!calcOp_) return;
    const a = parseFloat(calcPrev), b = parseFloat(calcVal);
    let r;
    if (calcOp_ === '+') r = a + b;
    else if (calcOp_ === '-') r = a - b;
    else if (calcOp_ === '*') r = a * b;
    else if (calcOp_ === '/') r = b === 0 ? 'Error' : a / b;
    if (!silent) calcExpr = calcExpr + ' ' + calcVal + ' =';
    calcVal = String(r); calcOp_ = ''; calcNewNum = true; calcDisplay();
}
function calcClear()     { calcVal='0'; calcExpr=''; calcOp_=''; calcPrev=''; calcNewNum=true; calcDisplay(); }
function calcSign()      { calcVal = String(parseFloat(calcVal) * -1); calcDisplay(); }
function calcPct()       { calcVal = String(parseFloat(calcVal) / 100); calcDisplay(); }
function calcBackspace() { calcVal = calcVal.length > 1 ? calcVal.slice(0,-1) : '0'; calcDisplay(); }
function calcSci(fn)     { calcVal += fn; calcExpr = calcVal; calcDisplay(); }
function calcMode(m, btn) {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('calc-sci-btns').style.display = m === 'sci' ? 'grid' : 'none';
}
function wireCalcKeyboard() {
    document.addEventListener('keydown', function ck(e) {
        const win = document.getElementById('win_calculator');
        if (!win || win.style.display === 'none') { document.removeEventListener('keydown', ck); return; }
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        if ('0123456789'.includes(e.key)) calcNum(e.key);
        else if (e.key === '.') calcDot();
        else if (['+','-','*','/'].includes(e.key)) { e.preventDefault(); calcOp(e.key); }
        else if (e.key === 'Enter' || e.key === '=') calcEquals();
        else if (e.key === 'Backspace') calcBackspace();
        else if (e.key === 'Escape') calcClear();
    });
}


// ──────────────────────────────────────────────────────
// PAINT
// ──────────────────────────────────────────────────────
APPS.paint = function () {
    const body = `
      <div class="paint-wrap">
        <div class="app-toolbar paint-toolbar">
          <input type="color" id="paint-color" value="#000000" title="Color" style="width:32px;height:28px;border:none;cursor:pointer;padding:1px;border-radius:4px;">
          <input type="color" id="paint-bg" value="#ffffff" title="Background color" style="width:32px;height:28px;border:none;cursor:pointer;padding:1px;border-radius:4px;">
          <label style="font-size:12px">Size:</label>
          <input type="range" id="paint-size" min="1" max="40" value="4" style="width:70px;">
          <button class="active-tool" id="paint-tool-pen"   onclick="paintTool('pen')">✏️ Pen</button>
          <button id="paint-tool-eraser" onclick="paintTool('eraser')">🧹 Eraser</button>
          <button id="paint-tool-line"   onclick="paintTool('line')">╱ Line</button>
          <button id="paint-tool-rect"   onclick="paintTool('rect')">▭ Rect</button>
          <button id="paint-tool-fill"   onclick="paintTool('fill')">🪣 Fill</button>
          <button onclick="paintClear()">🗑 Clear</button>
          <button onclick="paintDownload()">⬇ Save</button>
        </div>
        <canvas id="paint-canvas"></canvas>
      </div>`;
    const win = createAppWindow('paint', 'Paint', '🎨', body, 780, 520);
    initPaint(win);
};

let _activePaintTool = 'pen';

function initPaint(win) {
    const canvas = win.querySelector('#paint-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false, startX = 0, startY = 0, snap = null;

    function resize() {
        const body = win.querySelector('.window-body');
        const tb   = win.querySelector('.paint-toolbar');
        const w = body.clientWidth;
        const h = body.clientHeight - tb.offsetHeight;
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width  = Math.max(1, w);
        canvas.height = Math.max(1, h);
        ctx.fillStyle = document.getElementById('paint-bg').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(img, 0, 0);
    }

    setTimeout(resize, 50);
    new ResizeObserver(resize).observe(win.querySelector('.window-body'));
    document.getElementById('paint-bg').addEventListener('change', () => {
        ctx.fillStyle = document.getElementById('paint-bg').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    function pos(e) {
        const r = canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener('mousedown', e => {
        drawing = true;
        const p = pos(e);
        startX = p.x; startY = p.y;
        if (_activePaintTool === 'fill') { floodFill(ctx, Math.round(p.x), Math.round(p.y), hexToRgba(document.getElementById('paint-color').value)); drawing = false; return; }
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        if (_activePaintTool === 'line' || _activePaintTool === 'rect') snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener('mousemove', e => {
        if (!drawing) return;
        const p = pos(e);
        const color = document.getElementById('paint-color').value;
        const size  = document.getElementById('paint-size').value;
        ctx.lineWidth   = _activePaintTool === 'eraser' ? size * 3 : size;
        ctx.lineCap     = 'round';
        ctx.strokeStyle = _activePaintTool === 'eraser' ? (document.getElementById('paint-bg').value || '#fff') : color;
        if (_activePaintTool === 'pen' || _activePaintTool === 'eraser') {
            ctx.lineTo(p.x, p.y); ctx.stroke();
        } else if (_activePaintTool === 'line' && snap) {
            ctx.putImageData(snap, 0, 0);
            ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = color; ctx.stroke();
        } else if (_activePaintTool === 'rect' && snap) {
            ctx.putImageData(snap, 0, 0);
            ctx.strokeRect(startX, startY, p.x - startX, p.y - startY);
        }
    });

    canvas.addEventListener('mouseup',    () => { drawing = false; snap = null; });
    canvas.addEventListener('mouseleave', () => { drawing = false; snap = null; });
}

function paintTool(t) {
    _activePaintTool = t;
    document.querySelectorAll('[id^="paint-tool-"]').forEach(b => b.classList.remove('active-tool'));
    const btn = document.getElementById('paint-tool-' + t);
    if (btn) btn.classList.add('active-tool');
}
function paintClear() {
    const c = document.getElementById('paint-canvas');
    const ctx = c.getContext('2d');
    ctx.fillStyle = document.getElementById('paint-bg').value || '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
}
function paintDownload() {
    const a = document.createElement('a');
    a.download = '67labs-paint.png';
    a.href = document.getElementById('paint-canvas').toDataURL();
    a.click();
}
function hexToRgba(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return [r,g,b,255];
}
function floodFill(ctx, x, y, fillColor) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const img = ctx.getImageData(0,0,w,h);
    const d = img.data;
    const i = (y*w+x)*4;
    const target = [d[i],d[i+1],d[i+2],d[i+3]];
    if (target.every((v,k) => v === fillColor[k])) return;
    const stack = [[x,y]];
    while (stack.length) {
        const [cx,cy] = stack.pop();
        const ci = (cy*w+cx)*4;
        if (cx<0||cx>=w||cy<0||cy>=h) continue;
        if (!target.every((v,k)=>d[ci+k]===v)) continue;
        d[ci]=fillColor[0]; d[ci+1]=fillColor[1]; d[ci+2]=fillColor[2]; d[ci+3]=fillColor[3];
        stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(img,0,0);
}


// ──────────────────────────────────────────────────────
// CODE EDITOR
// ──────────────────────────────────────────────────────
APPS.codeeditor = function () {
    const body = `
      <div class="code-wrap">
        <div class="app-toolbar">
          <button onclick="codeRun()">▶ Run</button>
          <button onclick="codeClear()">🗑 Clear</button>
          <button onclick="codeFormat()">✨ Format</button>
          <span class="app-status" id="code-status">JavaScript</span>
        </div>
        <textarea id="code-area" spellcheck="false" placeholder="// Write JavaScript here and click Run\nconsole.log('Hello from 67Labs OS!');"></textarea>
        <div id="code-output">
          <iframe id="code-frame" sandbox="allow-scripts"></iframe>
        </div>
      </div>`;
    createAppWindow('codeeditor', 'Code Editor', '💻', body, 760, 540);

    // Tab key support
    document.getElementById('code-area').addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const ta = e.target;
            const s = ta.selectionStart, en = ta.selectionEnd;
            ta.value = ta.value.slice(0,s) + '  ' + ta.value.slice(en);
            ta.selectionStart = ta.selectionEnd = s + 2;
        }
    });
};

function codeRun() {
    const code = document.getElementById('code-area').value;
    const frame = document.getElementById('code-frame');
    const doc = frame.contentDocument || frame.contentWindow.document;
    const html = `<!DOCTYPE html><html><head><style>
      body{margin:0;padding:8px;font:13px/1.5 Consolas,monospace;background:#141414;color:#d4d4d4;}
    </style></head><body><script>
      (function(){
        const _log=console.log.bind(console);
        console.log=function(...a){
          _log(...a);
          const p=document.createElement('p');
          p.style.margin='2px 0';
          p.textContent=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ');
          document.body.appendChild(p);
        };
        try{ ${code} }
        catch(e){
          const p=document.createElement('p');
          p.style.color='#f48771';
          p.textContent='Error: '+e.message;
          document.body.appendChild(p);
        }
      })();
    <\/script></body></html>`;
    doc.open(); doc.write(html); doc.close();
}

function codeClear() {
    document.getElementById('code-area').value = '';
    const frame = document.getElementById('code-frame');
    const doc = frame.contentDocument || frame.contentWindow.document;
    doc.open(); doc.write(''); doc.close();
}

function codeFormat() {
    try {
        const ta = document.getElementById('code-area');
        // Basic: eval-safe prettify using Function constructor approach won't work cross-origin
        // Simple indentation normalizer
        let lines = ta.value.split('\n');
        let indent = 0;
        lines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) indent = Math.max(0, indent - 1);
            const out = '  '.repeat(indent) + trimmed;
            if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) indent++;
            return out;
        });
        ta.value = lines.join('\n');
    } catch (_) {}
}

// ──────────────────────────────────────────────────────
// MARKDOWN EDITOR
// ──────────────────────────────────────────────────────
APPS.markdown = function () {
    // Load marked.js from CDN if not already loaded
    if (!window.marked) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        s.onload = () => openMarkdownApp();
        document.head.appendChild(s);
    } else {
        openMarkdownApp();
    }
};

function openMarkdownApp() {
    const body = `
      <div class="app-toolbar">
        <button onclick="mdCopy()">📋 Copy HTML</button>
        <button onclick="mdClear()">🗑 Clear</button>
        <span class="app-status" id="md-status">0 words</span>
      </div>
      <div class="md-wrap">
        <textarea id="md-input" placeholder="# Hello\nType **Markdown** here…" spellcheck="true"></textarea>
        <div id="md-preview"></div>
      </div>`;
    createAppWindow('markdown', 'Markdown Editor', '📄', body, 820, 520);

    const input = document.getElementById('md-input');
    input.addEventListener('input', mdUpdate);

    try {
        const saved = localStorage.getItem('67labs_markdown');
        if (saved) { input.value = saved; mdUpdate(); }
    } catch (_) {}
}

function mdUpdate() {
    const input = document.getElementById('md-input');
    const preview = document.getElementById('md-preview');
    const status  = document.getElementById('md-status');
    if (!input || !preview) return;
    const txt = input.value;
    const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    if (status) status.textContent = words + ' word' + (words !== 1 ? 's' : '');
    if (window.marked) preview.innerHTML = window.marked.parse(txt);
    try { localStorage.setItem('67labs_markdown', txt); } catch (_) {}
}

function mdCopy() {
    const html = document.getElementById('md-preview').innerHTML;
    navigator.clipboard.writeText(html).then(() => {
        const s = document.getElementById('md-status');
        const prev = s.textContent; s.textContent = '✓ Copied!';
        setTimeout(() => s.textContent = prev, 1200);
    }).catch(() => {});
}
function mdClear() {
    document.getElementById('md-input').value = '';
    mdUpdate();
    try { localStorage.removeItem('67labs_markdown'); } catch (_) {}
}

// ──────────────────────────────────────────────────────
// TEXT-TO-SPEECH
// ──────────────────────────────────────────────────────
APPS.tts = function () {
    const body = `
      <div class="tts-wrap">
        <textarea id="tts-text" placeholder="Type text to speak…">Hello! Welcome to 67Labs OS.</textarea>
        <div class="tts-controls">
          <div class="tts-row">
            <label>Voice</label>
            <select id="tts-voice"></select>
          </div>
          <div class="tts-row">
            <label>Rate</label>
            <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1">
            <span id="tts-rate-val">1×</span>
          </div>
          <div class="tts-row">
            <label>Pitch</label>
            <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1">
            <span id="tts-pitch-val">1×</span>
          </div>
          <div class="tts-btns">
            <button id="tts-speak" onclick="ttsSpeak()">🔊 Speak</button>
            <button id="tts-stop"  onclick="ttsPause()">⏸ Pause</button>
            <button onclick="speechSynthesis.cancel()">⏹ Stop</button>
          </div>
        </div>
      </div>`;
    createAppWindow('tts', 'Text to Speech', '🔊', body, 440, 420);
    ttsLoadVoices();

    document.getElementById('tts-rate').addEventListener('input', e => {
        document.getElementById('tts-rate-val').textContent = parseFloat(e.target.value).toFixed(1) + '×';
    });
    document.getElementById('tts-pitch').addEventListener('input', e => {
        document.getElementById('tts-pitch-val').textContent = parseFloat(e.target.value).toFixed(1) + '×';
    });
};

function ttsLoadVoices() {
    const sel = document.getElementById('tts-voice');
    if (!sel) return;
    const voices = speechSynthesis.getVoices();
    sel.innerHTML = voices.map((v,i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join('');
    if (!voices.length) speechSynthesis.onvoiceschanged = ttsLoadVoices;
}

function ttsSpeak() {
    speechSynthesis.cancel();
    const txt = document.getElementById('tts-text').value.trim();
    if (!txt) return;
    const utt = new SpeechSynthesisUtterance(txt);
    const voices = speechSynthesis.getVoices();
    const sel = document.getElementById('tts-voice');
    if (sel && voices[sel.value]) utt.voice = voices[sel.value];
    utt.rate  = parseFloat(document.getElementById('tts-rate').value);
    utt.pitch = parseFloat(document.getElementById('tts-pitch').value);
    speechSynthesis.speak(utt);
}

function ttsPause() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
    else if (speechSynthesis.paused) speechSynthesis.resume();
}


// ──────────────────────────────────────────────────────
// CLOCK / ALARM
// ──────────────────────────────────────────────────────
APPS.clock = function () {
    const body = `
      <div class="clock-wrap">
        <svg class="clock-svg" id="clock-svg" width="180" height="180" viewBox="0 0 180 180"></svg>
        <div class="clock-digital" id="clock-digital">00:00:00</div>
        <div class="clock-date" id="clock-date"></div>
        <div class="clock-alarm-row">
          <input type="time" id="clock-alarm-time" value="07:00">
          <button onclick="clockSetAlarm()">🔔 Set Alarm</button>
          <button onclick="clockClearAlarm()" style="background:#555;">Clear</button>
        </div>
        <div id="clock-alarm-status">No alarm set</div>
      </div>`;
    createAppWindow('clock', 'Clock', '🕐', body, 340, 440);
    clockTick();
    if (!window._clockInterval) window._clockInterval = setInterval(clockTick, 1000);
};

let _clockAlarm = null, _clockAlarmFired = false;

function clockTick() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const pad = n => String(n).padStart(2, '0');
    const dEl = document.getElementById('clock-digital');
    const dtEl = document.getElementById('clock-date');
    if (dEl) dEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    if (dtEl) dtEl.textContent = now.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric',year:'numeric'});
    clockDrawAnalog(h % 12, m, s);

    // Alarm check
    if (_clockAlarm && !_clockAlarmFired) {
        const [ah, am] = _clockAlarm.split(':').map(Number);
        if (h === ah && m === am && s === 0) {
            _clockAlarmFired = true;
            clockBeep();
            const st = document.getElementById('clock-alarm-status');
            if (st) st.textContent = '⏰ Alarm ringing!';
            setTimeout(() => { _clockAlarmFired = false; }, 60000);
        }
    }
}

function clockDrawAnalog(h, m, s) {
    const svg = document.getElementById('clock-svg');
    if (!svg) return;
    const cx = 90, cy = 90, r = 82;
    const toRad = deg => deg * Math.PI / 180;
    const hand = (angle, len, w, color) => {
        const x = cx + len * Math.sin(toRad(angle));
        const y = cy - len * Math.cos(toRad(angle));
        return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
    };
    const secAngle = s * 6;
    const minAngle = m * 6 + s * 0.1;
    const hrAngle  = h * 30 + m * 0.5;

    let ticks = '';
    for (let i = 0; i < 60; i++) {
        const a = toRad(i * 6);
        const inner = i % 5 === 0 ? r - 14 : r - 7;
        const x1 = cx + r * Math.sin(a), y1 = cy - r * Math.cos(a);
        const x2 = cx + inner * Math.sin(a), y2 = cy - inner * Math.cos(a);
        ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${i%5===0?'#ccc':'#555'}" stroke-width="${i%5===0?2:1}"/>`;
    }
    svg.innerHTML = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1a1a2e" stroke="#333" stroke-width="2"/>
      ${ticks}
      ${hand(hrAngle, 48, 5, '#e0e0e0')}
      ${hand(minAngle, 64, 3, '#e0e0e0')}
      ${hand(secAngle, 72, 1.5, '#ff4444')}
      <circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>`;
}

function clockSetAlarm() {
    const t = document.getElementById('clock-alarm-time').value;
    if (!t) return;
    _clockAlarm = t; _clockAlarmFired = false;
    const [h, m] = t.split(':');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = ((+h % 12) || 12);
    const st = document.getElementById('clock-alarm-status');
    if (st) st.textContent = `🔔 Alarm set for ${h12}:${m} ${ampm}`;
}
function clockClearAlarm() {
    _clockAlarm = null;
    const st = document.getElementById('clock-alarm-status');
    if (st) st.textContent = 'No alarm set';
}
function clockBeep() {
    try {
        const AudioCtx = window.AudioContext || window['webkitAudioContext'];
        const ctx = new AudioCtx();
        [0, 0.3, 0.6].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.25);
        });
    } catch (_) { alert('⏰ Alarm!'); }
}


// ──────────────────────────────────────────────────────
// STOPWATCH & TIMER
// ──────────────────────────────────────────────────────
APPS.stopwatch = function () {
    const body = `
      <div class="sw-wrap">
        <div class="sw-tabs">
          <button class="sw-tab active" id="sw-tab-sw" onclick="swSwitchTab('sw')">Stopwatch</button>
          <button class="sw-tab" id="sw-tab-timer" onclick="swSwitchTab('timer')">Timer</button>
        </div>
        <div id="sw-panel-sw">
          <div class="sw-display" id="sw-display">00:00.000</div>
          <div class="sw-btns">
            <button id="sw-start" onclick="swToggle()">Start</button>
            <button id="sw-lap"   onclick="swLap()">Lap</button>
            <button id="sw-reset" onclick="swReset()">Reset</button>
          </div>
          <div id="sw-laps"></div>
        </div>
        <div id="sw-panel-timer" style="display:none;flex-direction:column;align-items:center;gap:10px;">
          <div class="timer-input-row">
            <input type="number" id="timer-h" value="0" min="0" max="23"> <span>h</span>
            <input type="number" id="timer-m" value="5" min="0" max="59"> <span>m</span>
            <input type="number" id="timer-s" value="0" min="0" max="59"> <span>s</span>
          </div>
          <div class="sw-display" id="timer-display">05:00.000</div>
          <div class="sw-btns">
            <button id="timer-start" onclick="timerToggle()">Start</button>
            <button id="timer-reset" onclick="timerReset()">Reset</button>
          </div>
        </div>
      </div>`;
    createAppWindow('stopwatch', 'Stopwatch & Timer', '⏱️', body, 360, 500);
};

let _swRunning = false, _swMs = 0, _swStart = 0, _swInterval = null, _swLapCount = 0, _swLastLap = 0;
let _timerRunning = false, _timerMs = 0, _timerStart = 0, _timerInterval = null, _timerTotal = 0;

function swSwitchTab(tab) {
    document.getElementById('sw-panel-sw').style.display    = tab === 'sw' ? 'flex' : 'none';
    document.getElementById('sw-panel-sw').style.flexDirection = 'column';
    document.getElementById('sw-panel-sw').style.alignItems = 'center';
    document.getElementById('sw-panel-timer').style.display = tab === 'timer' ? 'flex' : 'none';
    document.getElementById('sw-tab-sw').classList.toggle('active', tab === 'sw');
    document.getElementById('sw-tab-timer').classList.toggle('active', tab === 'timer');
}

function swFmt(ms) {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), mss = ms % 1000;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(mss).padStart(3,'0')}`;
}

function swToggle() {
    if (!_swRunning) {
        _swStart = Date.now() - _swMs;
        _swInterval = setInterval(() => {
            _swMs = Date.now() - _swStart;
            const el = document.getElementById('sw-display');
            if (el) el.textContent = swFmt(_swMs);
        }, 33);
        _swRunning = true;
        document.getElementById('sw-start').textContent = 'Pause';
    } else {
        clearInterval(_swInterval); _swRunning = false;
        document.getElementById('sw-start').textContent = 'Resume';
    }
}
function swLap() {
    if (!_swRunning) return;
    _swLapCount++;
    const lap = _swMs - _swLastLap; _swLastLap = _swMs;
    const el = document.getElementById('sw-laps');
    if (el) el.insertAdjacentHTML('afterbegin', `<div><span>Lap ${_swLapCount}</span><span>${swFmt(lap)}</span></div>`);
}
function swReset() {
    clearInterval(_swInterval); _swRunning = false; _swMs = 0; _swLapCount = 0; _swLastLap = 0;
    const d = document.getElementById('sw-display'); if (d) d.textContent = '00:00.000';
    const l = document.getElementById('sw-laps');   if (l) l.innerHTML = '';
    const b = document.getElementById('sw-start');  if (b) b.textContent = 'Start';
}

function timerToggle() {
    if (!_timerRunning) {
        const h = parseInt(document.getElementById('timer-h').value) || 0;
        const m = parseInt(document.getElementById('timer-m').value) || 0;
        const s = parseInt(document.getElementById('timer-s').value) || 0;
        if (!_timerTotal) _timerTotal = (h * 3600 + m * 60 + s) * 1000;
        if (_timerTotal <= 0) return;
        _timerStart = Date.now() - (_timerTotal - _timerMs || _timerTotal);
        _timerMs = _timerTotal;
        _timerStart = Date.now();
        _timerInterval = setInterval(() => {
            const elapsed = Date.now() - _timerStart;
            const rem = Math.max(0, _timerTotal - elapsed);
            _timerMs = rem;
            const el = document.getElementById('timer-display');
            if (el) el.textContent = swFmt(rem);
            if (rem === 0) {
                clearInterval(_timerInterval); _timerRunning = false;
                const btn = document.getElementById('timer-start'); if (btn) btn.textContent = 'Start';
                clockBeep(); _timerTotal = 0;
            }
        }, 33);
        _timerRunning = true;
        document.getElementById('timer-start').textContent = 'Pause';
    } else {
        clearInterval(_timerInterval); _timerRunning = false;
        _timerTotal = _timerMs;
        document.getElementById('timer-start').textContent = 'Resume';
    }
}
function timerReset() {
    clearInterval(_timerInterval); _timerRunning = false; _timerMs = 0; _timerTotal = 0;
    const el = document.getElementById('timer-display'); if (el) el.textContent = '00:00.000';
    const b = document.getElementById('timer-start'); if (b) b.textContent = 'Start';
}


// ──────────────────────────────────────────────────────
// UNIT CONVERTER
// ──────────────────────────────────────────────────────
APPS.converter = function () {
    const body = `
      <div class="conv-wrap">
        <div class="conv-category">
          <button class="active" onclick="convSetCat('length',this)">Length</button>
          <button onclick="convSetCat('weight',this)">Weight</button>
          <button onclick="convSetCat('temp',this)">Temperature</button>
          <button onclick="convSetCat('currency',this)">Currency</button>
        </div>
        <div class="conv-row">
          <input type="number" id="conv-from-val" placeholder="0" oninput="convCalc()">
          <select id="conv-from-unit" onchange="convCalc()"></select>
        </div>
        <div style="text-align:center;font-size:20px;color:#888;">⇅</div>
        <div class="conv-row">
          <input type="number" id="conv-to-val" placeholder="0" readonly style="background:#f0f0f0;">
          <select id="conv-to-unit" onchange="convCalc()"></select>
        </div>
        <div class="conv-result" id="conv-result"></div>
      </div>`;
    createAppWindow('converter', 'Unit Converter', '📐', body, 400, 360);
    convSetCat('length', document.querySelector('.conv-category button'));
};

const CONV_DATA = {
    length:   { m:1, km:0.001, cm:100, mm:1000, mi:0.000621371, yd:1.09361, ft:3.28084, inch:39.3701 },
    weight:   { kg:1, g:1000, mg:1e6, lb:2.20462, oz:35.274, t:0.001 },
    temp:     { C:null, F:null, K:null },
    currency: { USD:1, EUR:0.92, GBP:0.79, JPY:149.5, CAD:1.36, AUD:1.53, INR:83.1, CNY:7.23, MXN:17.2, BRL:4.97 }
};
const CONV_LABELS = {
    length:   { m:'Meter', km:'Kilometer', cm:'Centimeter', mm:'Millimeter', mi:'Mile', yd:'Yard', ft:'Foot', inch:'Inch' },
    weight:   { kg:'Kilogram', g:'Gram', mg:'Milligram', lb:'Pound', oz:'Ounce', t:'Tonne' },
    temp:     { C:'Celsius', F:'Fahrenheit', K:'Kelvin' },
    currency: { USD:'US Dollar', EUR:'Euro', GBP:'Brit. Pound', JPY:'Japanese Yen', CAD:'Cdn Dollar', AUD:'Aus Dollar', INR:'Indian Rupee', CNY:'Chinese Yuan', MXN:'Mexican Peso', BRL:'Brazilian Real' }
};
let _convCat = 'length';

function convSetCat(cat, btn) {
    _convCat = cat;
    document.querySelectorAll('.conv-category button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const keys = Object.keys(CONV_LABELS[cat]);
    const labels = CONV_LABELS[cat];
    ['conv-from-unit','conv-to-unit'].forEach((id, i) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = keys.map(k => `<option value="${k}">${labels[k]}</option>`).join('');
        sel.selectedIndex = i;
    });
    document.getElementById('conv-from-val').value = '';
    document.getElementById('conv-to-val').value   = '';
    document.getElementById('conv-result').textContent = '';
}

function convCalc() {
    const from = parseFloat(document.getElementById('conv-from-val').value);
    const fu   = document.getElementById('conv-from-unit').value;
    const tu   = document.getElementById('conv-to-unit').value;
    if (isNaN(from)) { document.getElementById('conv-to-val').value = ''; return; }

    let result;
    if (_convCat === 'temp') {
        let cel = fu === 'C' ? from : fu === 'F' ? (from - 32) * 5/9 : from - 273.15;
        result  = tu === 'C' ? cel  : tu === 'F' ? cel * 9/5 + 32    : cel + 273.15;
    } else {
        const d = CONV_DATA[_convCat];
        result  = from / d[fu] * d[tu];
    }
    const rounded = Math.round(result * 1e8) / 1e8;
    document.getElementById('conv-to-val').value = rounded;
    document.getElementById('conv-result').textContent = `${from} ${fu} = ${rounded} ${tu}`;
}


// ──────────────────────────────────────────────────────
// SNAKE
// ──────────────────────────────────────────────────────
APPS.snake = function () {
    const body = `
      <div class="game-wrap" id="snake-wrap">
        <div class="game-hud">Score: <span id="snake-score">0</span> &nbsp; High: <span id="snake-hi">0</span></div>
        <canvas id="snake-canvas" class="game-canvas" width="400" height="400"></canvas>
        <div class="game-overlay" id="snake-overlay">
          <h2>🐍 Snake</h2>
          <p>Arrow keys to move</p>
          <button onclick="snakeStart()">Play</button>
        </div>
      </div>`;
    createAppWindow('snake', 'Snake', '🐍', body, 420, 480);
    try { document.getElementById('snake-hi').textContent = localStorage.getItem('67labs_snake_hi') || 0; } catch(_){}
};

let _snakeLoop = null, _snakeDir = {x:1,y:0}, _snakeNextDir = {x:1,y:0};
let _snakeBody = [], _snakeFood = {x:0,y:0}, _snakeScore = 0;
const SN_CELL = 20, SN_COLS = 20, SN_ROWS = 20;

function snakeStart() {
    document.getElementById('snake-overlay').style.display = 'none';
    _snakeBody = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    _snakeDir  = {x:1,y:0}; _snakeNextDir = {x:1,y:0};
    _snakeScore = 0; snakePlaceFood();
    document.getElementById('snake-score').textContent = 0;
    clearInterval(_snakeLoop);
    _snakeLoop = setInterval(snakeTick, 130);

    const wrap = document.getElementById('snake-wrap');
    if (wrap) wrap.onkeydown = snakeKey;
    if (wrap) wrap.setAttribute('tabindex', '0'), wrap.focus();
    document.addEventListener('keydown', snakeKey);
}

function snakePlaceFood() {
    do { _snakeFood = {x:Math.floor(Math.random()*SN_COLS), y:Math.floor(Math.random()*SN_ROWS)}; }
    while (_snakeBody.some(s => s.x===_snakeFood.x && s.y===_snakeFood.y));
}

function snakeKey(e) {
    const map = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
    if (!map[e.key]) return;
    e.preventDefault();
    const nd = map[e.key];
    if (nd.x === -_snakeDir.x && nd.y === -_snakeDir.y) return;
    _snakeNextDir = nd;
}

function snakeTick() {
    _snakeDir = _snakeNextDir;
    const head = {x: _snakeBody[0].x + _snakeDir.x, y: _snakeBody[0].y + _snakeDir.y};
    if (head.x < 0 || head.x >= SN_COLS || head.y < 0 || head.y >= SN_ROWS ||
        _snakeBody.some(s => s.x===head.x && s.y===head.y)) {
        clearInterval(_snakeLoop);
        const hi = parseInt(localStorage.getItem('67labs_snake_hi') || 0);
        if (_snakeScore > hi) { try { localStorage.setItem('67labs_snake_hi', _snakeScore); } catch(_){} }
        const ov = document.getElementById('snake-overlay');
        if (ov) { ov.style.display='flex'; ov.querySelector('h2').textContent='Game Over'; ov.querySelector('p').textContent=`Score: ${_snakeScore}`; }
        return;
    }
    _snakeBody.unshift(head);
    if (head.x===_snakeFood.x && head.y===_snakeFood.y) {
        _snakeScore++; snakePlaceFood();
        document.getElementById('snake-score').textContent = _snakeScore;
        const hi = parseInt(localStorage.getItem('67labs_snake_hi') || 0);
        if (_snakeScore > hi) { document.getElementById('snake-hi').textContent = _snakeScore; try { localStorage.setItem('67labs_snake_hi', _snakeScore); } catch(_){} }
    } else { _snakeBody.pop(); }
    snakeDraw();
}

function snakeDraw() {
    const c = document.getElementById('snake-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, c.width, c.height);
    // Grid lines
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 0.5;
    for (let i=0; i<=SN_COLS; i++) { ctx.beginPath(); ctx.moveTo(i*SN_CELL,0); ctx.lineTo(i*SN_CELL,c.height); ctx.stroke(); }
    for (let i=0; i<=SN_ROWS; i++) { ctx.beginPath(); ctx.moveTo(0,i*SN_CELL); ctx.lineTo(c.width,i*SN_CELL); ctx.stroke(); }
    // Food
    ctx.fillStyle = '#ff4444';
    ctx.beginPath(); ctx.arc(_snakeFood.x*SN_CELL+SN_CELL/2, _snakeFood.y*SN_CELL+SN_CELL/2, SN_CELL/2-2, 0, Math.PI*2); ctx.fill();
    // Snake
    _snakeBody.forEach((seg, i) => {
        ctx.fillStyle = i===0 ? '#00e676' : '#4caf50';
        ctx.fillRect(seg.x*SN_CELL+1, seg.y*SN_CELL+1, SN_CELL-2, SN_CELL-2);
    });
}


// ──────────────────────────────────────────────────────
// TETRIS
// ──────────────────────────────────────────────────────
APPS.tetris = function () {
    const body = `
      <div class="game-wrap" id="tetris-wrap">
        <div class="game-hud">Score: <span id="tet-score">0</span> &nbsp; Lines: <span id="tet-lines">0</span> &nbsp; Level: <span id="tet-level">1</span></div>
        <canvas id="tet-canvas" class="game-canvas" width="200" height="400"></canvas>
        <div class="game-overlay" id="tet-overlay">
          <h2>🧱 Tetris</h2>
          <p>Arrow keys · Space to drop</p>
          <button onclick="tetStart()">Play</button>
        </div>
      </div>`;
    createAppWindow('tetris', 'Tetris', '🧱', body, 280, 500);
};

const TET_W=10, TET_H=20, TET_SZ=20;
const TET_PIECES = [
    {s:[[1,1,1,1]],c:'#00bcd4'},
    {s:[[1,1],[1,1]],c:'#ffeb3b'},
    {s:[[0,1,0],[1,1,1]],c:'#9c27b0'},
    {s:[[1,0],[1,0],[1,1]],c:'#ff9800'},
    {s:[[0,1],[0,1],[1,1]],c:'#2196f3'},
    {s:[[0,1,1],[1,1,0]],c:'#4caf50'},
    {s:[[1,1,0],[0,1,1]],c:'#f44336'},
];
let _tetBoard=[], _tetPiece=null, _tetX=0, _tetY=0, _tetScore=0, _tetLines=0, _tetLevel=1, _tetRAF=null, _tetLast=0, _tetRunning=false;

function tetStart() {
    document.getElementById('tet-overlay').style.display='none';
    _tetBoard = Array.from({length:TET_H}, ()=>Array(TET_W).fill(0));
    _tetScore=0; _tetLines=0; _tetLevel=1; _tetRunning=true;
    document.getElementById('tet-score').textContent=0;
    document.getElementById('tet-lines').textContent=0;
    document.getElementById('tet-level').textContent=1;
    tetSpawn();
    document.addEventListener('keydown', tetKey);
    cancelAnimationFrame(_tetRAF);
    _tetLast=0; _tetRAF=requestAnimationFrame(tetLoop);
}

function tetSpawn() {
    const p = TET_PIECES[Math.floor(Math.random()*TET_PIECES.length)];
    _tetPiece = p; _tetX = Math.floor((TET_W - p.s[0].length)/2); _tetY = 0;
    if (!tetValid(_tetPiece.s, _tetX, _tetY)) tetOver();
}

function tetValid(s, px, py) {
    return s.every((row, r) => row.every((v, c) => !v || (px+c>=0 && px+c<TET_W && py+r<TET_H && !(py+r>=0 && _tetBoard[py+r][px+c]))));
}

function tetPlace() {
    _tetPiece.s.forEach((row, r) => row.forEach((v, c) => { if(v && _tetY+r>=0) _tetBoard[_tetY+r][_tetX+c] = _tetPiece.c; }));
    let cleared=0;
    for (let r=TET_H-1; r>=0; r--) {
        if (_tetBoard[r].every(v=>v)) { _tetBoard.splice(r,1); _tetBoard.unshift(Array(TET_W).fill(0)); cleared++; r++; }
    }
    _tetLines += cleared; _tetScore += [0,100,300,500,800][cleared]*_tetLevel;
    _tetLevel = Math.floor(_tetLines/10)+1;
    document.getElementById('tet-score').textContent=_tetScore;
    document.getElementById('tet-lines').textContent=_tetLines;
    document.getElementById('tet-level').textContent=_tetLevel;
    tetSpawn();
}

function tetOver() {
    _tetRunning=false; cancelAnimationFrame(_tetRAF);
    const ov=document.getElementById('tet-overlay');
    if(ov){ov.style.display='flex'; ov.querySelector('h2').textContent='Game Over'; ov.querySelector('p').textContent=`Score: ${_tetScore}`;}
}

function tetKey(e) {
    if (!_tetRunning) return;
    if (e.key==='ArrowLeft'  && tetValid(_tetPiece.s,_tetX-1,_tetY)) { _tetX--; tetDraw(); e.preventDefault(); }
    if (e.key==='ArrowRight' && tetValid(_tetPiece.s,_tetX+1,_tetY)) { _tetX++; tetDraw(); e.preventDefault(); }
    if (e.key==='ArrowDown'  && tetValid(_tetPiece.s,_tetX,_tetY+1)) { _tetY++; tetDraw(); e.preventDefault(); }
    if (e.key==='ArrowUp') { const r=tetRotate(_tetPiece.s); if(tetValid(r,_tetX,_tetY)){_tetPiece={..._tetPiece,s:r}; tetDraw();} e.preventDefault(); }
    if (e.key===' ') { while(tetValid(_tetPiece.s,_tetX,_tetY+1)) _tetY++; tetPlace(); tetDraw(); e.preventDefault(); }
}

function tetRotate(s) {
    return s[0].map((_,c)=>s.map(row=>row[c]).reverse());
}

function tetLoop(ts) {
    if (!_tetRunning) return;
    const speed = Math.max(100, 700 - (_tetLevel-1)*60);
    if (ts - _tetLast > speed) {
        _tetLast = ts;
        if (tetValid(_tetPiece.s, _tetX, _tetY+1)) { _tetY++; } else { tetPlace(); }
    }
    tetDraw();
    _tetRAF = requestAnimationFrame(tetLoop);
}

function tetDraw() {
    const c=document.getElementById('tet-canvas'); if(!c) return;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#111'; ctx.fillRect(0,0,c.width,c.height);
    // Board
    _tetBoard.forEach((row,r)=>row.forEach((v,col)=>{
        if(v){ctx.fillStyle=v; ctx.fillRect(col*TET_SZ,r*TET_SZ,TET_SZ-1,TET_SZ-1);}
    }));
    // Current piece
    if(_tetPiece) _tetPiece.s.forEach((row,r)=>row.forEach((v,col)=>{
        if(v){ctx.fillStyle=_tetPiece.c; ctx.fillRect((_tetX+col)*TET_SZ,(_tetY+r)*TET_SZ,TET_SZ-1,TET_SZ-1);}
    }));
    // Ghost
    let gy=_tetY; while(tetValid(_tetPiece.s,_tetX,gy+1)) gy++;
    ctx.globalAlpha=0.25;
    if(_tetPiece) _tetPiece.s.forEach((row,r)=>row.forEach((v,col)=>{
        if(v){ctx.fillStyle=_tetPiece.c; ctx.fillRect((_tetX+col)*TET_SZ,(gy+r)*TET_SZ,TET_SZ-1,TET_SZ-1);}
    }));
    ctx.globalAlpha=1;
}


// ──────────────────────────────────────────────────────
// MINESWEEPER
// ──────────────────────────────────────────────────────
APPS.minesweeper = function () {
    const body = `
      <div class="ms-wrap" id="ms-wrap">
        <div class="ms-toolbar">
          <select id="ms-diff" onchange="msNewGame()">
            <option value="easy">Easy (9×9, 10 mines)</option>
            <option value="medium" selected>Medium (16×16, 40 mines)</option>
            <option value="hard">Hard (16×30, 99 mines)</option>
          </select>
          <button onclick="msNewGame()">New Game</button>
          <span id="ms-mines">💣 40</span>
          <span id="ms-timer">⏱ 0</span>
        </div>
        <div id="ms-board" class="ms-board"></div>
        <div class="game-overlay" id="ms-overlay" style="display:none;">
          <h2 id="ms-msg">💥 Game Over</h2>
          <button onclick="msNewGame()">Play Again</button>
        </div>
      </div>`;
    createAppWindow('minesweeper', 'Minesweeper', '💣', body, 540, 560);
    msNewGame();
};

const MS_CFG = {
    easy:   {r:9,  c:9,  m:10},
    medium: {r:16, c:16, m:40},
    hard:   {r:16, c:30, m:99},
};
let _msGrid=[], _msRows=0, _msCols=0, _msMines=0, _msRevealed=0, _msFlagged=0;
let _msStarted=false, _msOver=false, _msTimerVal=0, _msTimerInt=null;

function msNewGame() {
    clearInterval(_msTimerInt); _msTimerVal=0; _msStarted=false; _msOver=false;
    const diff = (document.getElementById('ms-diff') || {value:'medium'}).value;
    const cfg  = MS_CFG[diff];
    _msRows=cfg.r; _msCols=cfg.c; _msMines=cfg.m; _msRevealed=0; _msFlagged=0;
    _msGrid = Array.from({length:_msRows}, ()=>Array.from({length:_msCols}, ()=>({mine:false,rev:false,flag:false,adj:0})));
    document.getElementById('ms-mines').textContent = '💣 '+_msMines;
    document.getElementById('ms-timer').textContent = '⏱ 0';
    const ov=document.getElementById('ms-overlay'); if(ov) ov.style.display='none';
    msRender();
}

function msPlaceMines(sr, sc) {
    let placed=0;
    while (placed < _msMines) {
        const r=Math.floor(Math.random()*_msRows), c=Math.floor(Math.random()*_msCols);
        if (_msGrid[r][c].mine || (Math.abs(r-sr)<=1 && Math.abs(c-sc)<=1)) continue;
        _msGrid[r][c].mine=true; placed++;
    }
    for (let r=0; r<_msRows; r++) for (let c=0; c<_msCols; c++) {
        if (_msGrid[r][c].mine) continue;
        let adj=0;
        for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
            const nr=r+dr, nc=c+dc;
            if (nr>=0&&nr<_msRows&&nc>=0&&nc<_msCols&&_msGrid[nr][nc].mine) adj++;
        }
        _msGrid[r][c].adj=adj;
    }
}

function msReveal(r, c) {
    if (_msOver||_msGrid[r][c].rev||_msGrid[r][c].flag) return;
    if (!_msStarted) {
        msPlaceMines(r,c); _msStarted=true;
        _msTimerInt=setInterval(()=>{
            _msTimerVal++; const el=document.getElementById('ms-timer'); if(el) el.textContent='⏱ '+_msTimerVal;
        }, 1000);
    }
    _msGrid[r][c].rev=true; _msRevealed++;
    if (_msGrid[r][c].mine) { msGameOver(false); return; }
    if (_msGrid[r][c].adj===0) {
        for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) {
            const nr=r+dr,nc=c+dc;
            if(nr>=0&&nr<_msRows&&nc>=0&&nc<_msCols&&!_msGrid[nr][nc].rev) msReveal(nr,nc);
        }
    }
    if (_msRevealed === _msRows*_msCols - _msMines) msGameOver(true);
    msRender();
}

function msFlag(r, c) {
    if (_msOver||_msGrid[r][c].rev) return;
    _msGrid[r][c].flag = !_msGrid[r][c].flag;
    _msFlagged += _msGrid[r][c].flag ? 1 : -1;
    const el=document.getElementById('ms-mines'); if(el) el.textContent='💣 '+(_msMines-_msFlagged);
    msRender();
}

function msGameOver(win) {
    _msOver=true; clearInterval(_msTimerInt);
    if (!win) _msGrid.forEach(row=>row.forEach(cell=>{ if(cell.mine) cell.rev=true; }));
    const ov=document.getElementById('ms-overlay');
    const msg=document.getElementById('ms-msg');
    if(ov){ov.style.display='flex';} if(msg) msg.textContent=win?'🎉 You Win!':'💥 Game Over';
    msRender();
}

function msRender() {
    const board=document.getElementById('ms-board'); if(!board) return;
    board.style.gridTemplateColumns=`repeat(${_msCols},28px)`;
    board.innerHTML='';
    const ADJ_COLORS=['','#1565c0','#2e7d32','#c62828','#4a148c','#bf360c','#006064','#212121','#616161'];
    _msGrid.forEach((row,r)=>row.forEach((cell,c)=>{
        const btn=document.createElement('div');
        btn.className='ms-cell'+(cell.rev?' revealed':'')+(cell.mine&&cell.rev?' mine':'');
        if(cell.flag&&!cell.rev) btn.textContent='🚩';
        else if(cell.rev&&cell.mine) btn.textContent='💣';
        else if(cell.rev&&cell.adj>0){btn.textContent=cell.adj; btn.style.color=ADJ_COLORS[cell.adj];}
        btn.addEventListener('click',()=>msReveal(r,c));
        btn.addEventListener('contextmenu',e=>{e.preventDefault();msFlag(r,c);});
        board.appendChild(btn);
    }));
}


// ──────────────────────────────────────────────────────
// 2048
// ──────────────────────────────────────────────────────
APPS.g2048 = APPS.game2048 = function () {
    const body = `
      <div class="g2048-wrap">
        <div class="g2048-hud">
          <div><span>Score</span><br><b id="g2048-score">0</b></div>
          <div><span>Best</span><br><b id="g2048-best">0</b></div>
          <button onclick="g2048New()">New Game</button>
        </div>
        <div id="g2048-board" class="g2048-board"></div>
        <div class="game-overlay" id="g2048-overlay" style="display:none;">
          <h2 id="g2048-msg">Game Over</h2>
          <button onclick="g2048New()">Play Again</button>
        </div>
      </div>`;
    createAppWindow('game2048', '2048', '🔢', body, 380, 480);
    g2048New();
    document.addEventListener('keydown', g2048Key);
};

let _g2048Board=[], _g2048Score=0, _g2048Over=false;
const G2048_COLORS={0:'#cdc1b4',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};

function g2048New() {
    _g2048Board=Array.from({length:4},()=>Array(4).fill(0));
    _g2048Score=0; _g2048Over=false;
    g2048AddTile(); g2048AddTile();
    document.getElementById('g2048-score').textContent=0;
    const best=localStorage.getItem('67labs_2048_best')||0;
    document.getElementById('g2048-best').textContent=best;
    const ov=document.getElementById('g2048-overlay'); if(ov) ov.style.display='none';
    g2048Render();
}

function g2048AddTile() {
    const empty=[];
    _g2048Board.forEach((row,r)=>row.forEach((v,c)=>{if(!v) empty.push([r,c]);}));
    if(!empty.length) return;
    const [r,c]=empty[Math.floor(Math.random()*empty.length)];
    _g2048Board[r][c]=Math.random()<0.9?2:4;
}

function g2048Slide(row) {
    const filtered=row.filter(v=>v); let added=false;
    for(let i=0;i<filtered.length-1;i++) {
        if(!added&&filtered[i]===filtered[i+1]){filtered[i]*=2; _g2048Score+=filtered[i]; filtered.splice(i+1,1); added=true;} else added=false;
    }
    while(filtered.length<4) filtered.push(0);
    return filtered;
}

function g2048Move(dir) {
    if(_g2048Over) return;
    let moved=false;
    const b=_g2048Board;
    const rotate=m=>m[0].map((_,c)=>m.map(row=>row[c]).reverse());
    let rotations=0;
    if(dir==='ArrowUp') rotations=1;
    if(dir==='ArrowDown') rotations=3;
    if(dir==='ArrowLeft') rotations=0;
    if(dir==='ArrowRight') rotations=2;
    let grid=b.map(r=>[...r]);
    for(let i=0;i<rotations;i++) grid=rotate(grid);
    const newGrid=grid.map(row=>{const s=g2048Slide([...row]);if(s.join()!==row.join())moved=true;return s;});
    let fg=newGrid;
    for(let i=0;i<(4-rotations)%4;i++) fg=rotate(fg);
    if(moved){
        _g2048Board=fg; g2048AddTile();
        document.getElementById('g2048-score').textContent=_g2048Score;
        const best=parseInt(localStorage.getItem('67labs_2048_best')||0);
        if(_g2048Score>best){try{localStorage.setItem('67labs_2048_best',_g2048Score);}catch(_){} document.getElementById('g2048-best').textContent=_g2048Score;}
        g2048Render();
        if(g2048IsOver()){_g2048Over=true; const ov=document.getElementById('g2048-overlay');if(ov)ov.style.display='flex';}
    }
}

function g2048IsOver() {
    for(let r=0;r<4;r++) for(let c=0;c<4;c++){
        if(!_g2048Board[r][c]) return false;
        if(c<3&&_g2048Board[r][c]===_g2048Board[r][c+1]) return false;
        if(r<3&&_g2048Board[r][c]===_g2048Board[r+1][c]) return false;
    }
    return true;
}

function g2048Key(e) {
    const dirs=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    if(!dirs.includes(e.key)) return;
    if(!document.getElementById('g2048-board')) return;
    e.preventDefault(); g2048Move(e.key);
}

function g2048Render() {
    const board=document.getElementById('g2048-board'); if(!board) return;
    board.innerHTML='';
    _g2048Board.forEach(row=>row.forEach(v=>{
        const cell=document.createElement('div');
        cell.className='g2048-cell';
        cell.style.background=G2048_COLORS[v]||'#3d3731';
        cell.style.color=v<=4?'#776e65':'#f9f6f2';
        cell.style.fontSize=v>=1024?'22px':v>=100?'26px':'32px';
        if(v) cell.textContent=v;
        board.appendChild(cell);
    }));
}


// ──────────────────────────────────────────────────────
// PONG
// ──────────────────────────────────────────────────────
APPS.pong = function () {
    const body = `
      <div class="game-wrap" id="pong-wrap">
        <div class="game-hud">You: <span id="pong-p">0</span> &nbsp;|&nbsp; CPU: <span id="pong-c">0</span></div>
        <canvas id="pong-canvas" class="game-canvas" width="480" height="320"></canvas>
        <div class="game-overlay" id="pong-overlay">
          <h2>🏓 Pong</h2>
          <p>Mouse / W·S keys to move paddle</p>
          <button onclick="pongStart()">Play</button>
        </div>
      </div>`;
    createAppWindow('pong', 'Pong', '🏓', body, 500, 400);
};

const PONG={pw:12,ph:70,bw:12,bh:12,cw:480,ch:320};
let _pongRAF=null,_pongRunning=false,_pongBx=240,_pongBy=160,_pongBvx=4,_pongBvy=3;
let _pongPy=125,_pongCy=125,_pongPs=0,_pongCs=0,_pongMouse=0;

function pongStart() {
    document.getElementById('pong-overlay').style.display='none';
    _pongBx=PONG.cw/2; _pongBy=PONG.ch/2; _pongBvx=4*(Math.random()<0.5?1:-1); _pongBvy=3*(Math.random()<0.5?1:-1);
    _pongPy=_pongCy=PONG.ch/2-PONG.ph/2; _pongPs=_pongCs=0; _pongRunning=true;
    document.getElementById('pong-p').textContent=0; document.getElementById('pong-c').textContent=0;
    const canvas=document.getElementById('pong-canvas');
    canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();_pongMouse=e.clientY-r.top;});
    document.addEventListener('keydown',pongKey);
    cancelAnimationFrame(_pongRAF); _pongRAF=requestAnimationFrame(pongLoop);
}

function pongKey(e) {
    if(!_pongRunning) return;
    if(e.key==='w'||e.key==='W'||e.key==='ArrowUp') _pongPy=Math.max(0,_pongPy-18);
    if(e.key==='s'||e.key==='S'||e.key==='ArrowDown') _pongPy=Math.min(PONG.ch-PONG.ph,_pongPy+18);
}

function pongLoop() {
    if(!_pongRunning) return;
    // Player paddle follows mouse
    if(_pongMouse) _pongPy=Math.min(PONG.ch-PONG.ph, Math.max(0, _pongMouse-PONG.ph/2));
    // CPU AI
    const cpuSpeed=3.2;
    if(_pongBy>_pongCy+PONG.ph/2+5) _pongCy=Math.min(PONG.ch-PONG.ph,_pongCy+cpuSpeed);
    else if(_pongBy<_pongCy+PONG.ph/2-5) _pongCy=Math.max(0,_pongCy-cpuSpeed);
    // Ball move
    _pongBx+=_pongBvx; _pongBy+=_pongBvy;
    // Wall bounce
    if(_pongBy<=0){_pongBy=0;_pongBvy*=-1;} if(_pongBy>=PONG.ch-PONG.bh){_pongBy=PONG.ch-PONG.bh;_pongBvy*=-1;}
    // Paddle collision — player (left)
    if(_pongBx<=PONG.pw+20&&_pongBy+PONG.bh>=_pongPy&&_pongBy<=_pongPy+PONG.ph){
        _pongBx=PONG.pw+20; _pongBvx=Math.abs(_pongBvx)+0.2;
        _pongBvy+=(_pongBy+PONG.bh/2-(_pongPy+PONG.ph/2))*0.08;
    }
    // Paddle collision — CPU (right)
    if(_pongBx+PONG.bw>=PONG.cw-PONG.pw-20&&_pongBy+PONG.bh>=_pongCy&&_pongBy<=_pongCy+PONG.ph){
        _pongBx=PONG.cw-PONG.pw-20-PONG.bw; _pongBvx=-(Math.abs(_pongBvx)+0.2);
        _pongBvy+=(_pongBy+PONG.bh/2-(_pongCy+PONG.ph/2))*0.08;
    }
    // Score
    if(_pongBx<0){_pongCs++;document.getElementById('pong-c').textContent=_pongCs;pongReset();return;}
    if(_pongBx>PONG.cw){_pongPs++;document.getElementById('pong-p').textContent=_pongPs;pongReset();return;}
    pongDraw();
    _pongRAF=requestAnimationFrame(pongLoop);
}

function pongReset() {
    _pongBx=PONG.cw/2;_pongBy=PONG.ch/2;_pongBvx=4*(Math.random()<0.5?1:-1);_pongBvy=3*(Math.random()<0.5?1:-1);
    if(_pongPs>=7||_pongCs>=7){
        _pongRunning=false;
        const ov=document.getElementById('pong-overlay');
        if(ov){ov.style.display='flex';ov.querySelector('h2').textContent=_pongPs>=7?'🎉 You Win!':'💻 CPU Wins';ov.querySelector('p').textContent=`${_pongPs} – ${_pongCs}`;}
        return;
    }
    setTimeout(()=>{if(_pongRunning)_pongRAF=requestAnimationFrame(pongLoop);},800);
    pongDraw();
}

function pongDraw() {
    const c=document.getElementById('pong-canvas');if(!c)return;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#111';ctx.fillRect(0,0,PONG.cw,PONG.ch);
    // Centre line
    ctx.setLineDash([6,6]);ctx.strokeStyle='#444';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(PONG.cw/2,0);ctx.lineTo(PONG.cw/2,PONG.ch);ctx.stroke();ctx.setLineDash([]);
    // Paddles
    ctx.fillStyle='#fff';
    ctx.fillRect(20,_pongPy,PONG.pw,PONG.ph);
    ctx.fillRect(PONG.cw-20-PONG.pw,_pongCy,PONG.pw,PONG.ph);
    // Ball
    ctx.fillStyle='#fff';ctx.fillRect(_pongBx,_pongBy,PONG.bw,PONG.bh);
}


// ──────────────────────────────────────────────────────
// FLAPPY BIRD
// ──────────────────────────────────────────────────────
APPS.flappy = function () {
    const body = `
      <div class="game-wrap" id="flappy-wrap" tabindex="0">
        <div class="game-hud">Score: <span id="flappy-score">0</span> &nbsp; Best: <span id="flappy-best">0</span></div>
        <canvas id="flappy-canvas" class="game-canvas" width="320" height="480"></canvas>
        <div class="game-overlay" id="flappy-overlay">
          <h2>🐦 Flappy Bird</h2>
          <p>Click or Space to flap</p>
          <button onclick="flappyStart()">Play</button>
        </div>
      </div>`;
    createAppWindow('flappy', 'Flappy Bird', '🐦', body, 360, 560);
    try{document.getElementById('flappy-best').textContent=localStorage.getItem('67labs_flappy_best')||0;}catch(_){}
};

const FB={w:320,h:480,gap:120,pipeW:50,pipeSpeed:2.5,gravity:0.35,jumpV:-7,birdX:70,birdR:14};
let _fbRunning=false,_fbBy=240,_fbBvy=0,_fbPipes=[],_fbScore=0,_fbRAF=null,_fbFrame=0;

function flappyStart() {
    document.getElementById('flappy-overlay').style.display='none';
    _fbBy=FB.h/2; _fbBvy=0; _fbPipes=[]; _fbScore=0; _fbFrame=0; _fbRunning=true;
    document.getElementById('flappy-score').textContent=0;
    const wrap=document.getElementById('flappy-wrap');
    if(wrap){wrap.onclick=flappyFlap; wrap.focus();}
    document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();flappyFlap();}});
    cancelAnimationFrame(_fbRAF); _fbRAF=requestAnimationFrame(flappyLoop);
}

function flappyFlap(){if(_fbRunning){_fbBvy=FB.jumpV;}}

function flappyLoop() {
    if(!_fbRunning) return;
    _fbBvy+=FB.gravity; _fbBy+=_fbBvy; _fbFrame++;
    // Spawn pipes
    if(_fbFrame%90===0) {
        const top=60+Math.random()*(FB.h-FB.gap-80);
        _fbPipes.push({x:FB.w,top,scored:false});
    }
    // Move pipes
    _fbPipes.forEach(p=>p.x-=FB.pipeSpeed);
    _fbPipes=_fbPipes.filter(p=>p.x+FB.pipeW>0);
    // Score
    _fbPipes.forEach(p=>{if(!p.scored&&p.x+FB.pipeW<FB.birdX){p.scored=true;_fbScore++;document.getElementById('flappy-score').textContent=_fbScore;}});
    // Collision
    const dead=_fbBy-FB.birdR<0||_fbBy+FB.birdR>FB.h||_fbPipes.some(p=>{
        if(FB.birdX+FB.birdR>p.x&&FB.birdX-FB.birdR<p.x+FB.pipeW){return _fbBy-FB.birdR<p.top||_fbBy+FB.birdR>p.top+FB.gap;}return false;
    });
    if(dead){
        _fbRunning=false;
        const best=parseInt(localStorage.getItem('67labs_flappy_best')||0);
        if(_fbScore>best){try{localStorage.setItem('67labs_flappy_best',_fbScore);}catch(_){} document.getElementById('flappy-best').textContent=_fbScore;}
        const ov=document.getElementById('flappy-overlay');
        if(ov){ov.style.display='flex';ov.querySelector('h2').textContent='💥 Game Over';ov.querySelector('p').textContent=`Score: ${_fbScore}`;}
        flappyDraw(); return;
    }
    flappyDraw();
    _fbRAF=requestAnimationFrame(flappyLoop);
}

function flappyDraw() {
    const c=document.getElementById('flappy-canvas');if(!c)return;
    const ctx=c.getContext('2d');
    // Sky
    ctx.fillStyle='#70c5ce';ctx.fillRect(0,0,FB.w,FB.h);
    // Ground
    ctx.fillStyle='#c6a85c';ctx.fillRect(0,FB.h-30,FB.w,30);
    ctx.fillStyle='#5d9940';ctx.fillRect(0,FB.h-34,FB.w,6);
    // Pipes
    ctx.fillStyle='#4caf50';
    _fbPipes.forEach(p=>{
        ctx.fillRect(p.x,0,FB.pipeW,p.top);
        ctx.fillRect(p.x,p.top+FB.gap,FB.pipeW,FB.h-p.top-FB.gap);
        // Pipe caps
        ctx.fillStyle='#388e3c';
        ctx.fillRect(p.x-4,p.top-16,FB.pipeW+8,16);
        ctx.fillRect(p.x-4,p.top+FB.gap,FB.pipeW+8,16);
        ctx.fillStyle='#4caf50';
    });
    // Bird body
    ctx.save();ctx.translate(FB.birdX,_fbBy);
    const tilt=Math.max(-0.5,Math.min(0.5,_fbBvy*0.06));
    ctx.rotate(tilt);
    ctx.fillStyle='#ffd600';ctx.beginPath();ctx.arc(0,0,FB.birdR,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(6,-4,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(9,-4,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff6d00';ctx.beginPath();ctx.moveTo(10,2);ctx.lineTo(20,0);ctx.lineTo(10,5);ctx.closePath();ctx.fill();
    ctx.restore();
}


// ──────────────────────────────────────────────────────
// BREAKOUT / ARKANOID
// ──────────────────────────────────────────────────────
APPS.breakout = function () {
    const body = `
      <div class="game-wrap" id="bko-wrap" tabindex="0">
        <div class="game-hud">Score: <span id="bko-score">0</span> &nbsp; Lives: <span id="bko-lives">3</span></div>
        <canvas id="bko-canvas" class="game-canvas" width="480" height="400"></canvas>
        <div class="game-overlay" id="bko-overlay">
          <h2>🧱 Breakout</h2>
          <p>Mouse or ← → to move paddle</p>
          <button onclick="bkoStart()">Play</button>
        </div>
      </div>`;
    createAppWindow('breakout', 'Breakout', '🧱', body, 500, 480);
};

const BKO={w:480,h:400,bR:8,padW:80,padH:12,brows:5,bcols:10,bH:16,bPad:4,bOffX:10,bOffY:40};
let _bkoRAF=null,_bkoRunning=false,_bkoBx=240,_bkoBy=300,_bkoBvx=3.5,_bkoBvy=-4;
let _bkoPx=200,_bkoLives=3,_bkoScore=0,_bkoBricks=[],_bkoMouse=0;

const BKO_COLORS=['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa'];

function bkoStart() {
    document.getElementById('bko-overlay').style.display='none';
    _bkoBx=BKO.w/2; _bkoBy=BKO.h-60; _bkoBvx=3.5*(Math.random()<0.5?1:-1); _bkoBvy=-4;
    _bkoPx=BKO.w/2-BKO.padW/2; _bkoLives=3; _bkoScore=0; _bkoRunning=true;
    document.getElementById('bko-score').textContent=0;
    document.getElementById('bko-lives').textContent=3;
    // Init bricks
    _bkoBricks=[];
    for(let r=0;r<BKO.brows;r++) for(let c=0;c<BKO.bcols;c++){
        const bw=(BKO.w-BKO.bOffX*2-BKO.bPad*(BKO.bcols-1))/BKO.bcols;
        _bkoBricks.push({x:BKO.bOffX+c*(bw+BKO.bPad),y:BKO.bOffY+r*(BKO.bH+BKO.bPad),w:bw,h:BKO.bH,alive:true,color:BKO_COLORS[r]});
    }
    const canvas=document.getElementById('bko-canvas');
    if(canvas) canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();_bkoMouse=e.clientX-r.left;});
    document.addEventListener('keydown',bkoKey);
    cancelAnimationFrame(_bkoRAF); _bkoRAF=requestAnimationFrame(bkoLoop);
}

function bkoKey(e){
    if(!_bkoRunning) return;
    if(e.key==='ArrowLeft') _bkoPx=Math.max(0,_bkoPx-20);
    if(e.key==='ArrowRight') _bkoPx=Math.min(BKO.w-BKO.padW,_bkoPx+20);
}

function bkoLoop() {
    if(!_bkoRunning) return;
    if(_bkoMouse) _bkoPx=Math.min(BKO.w-BKO.padW,Math.max(0,_bkoMouse-BKO.padW/2));
    _bkoBx+=_bkoBvx; _bkoBy+=_bkoBvy;
    // Wall bounce
    if(_bkoBx-BKO.bR<0){_bkoBx=BKO.bR;_bkoBvx*=-1;}
    if(_bkoBx+BKO.bR>BKO.w){_bkoBx=BKO.w-BKO.bR;_bkoBvx*=-1;}
    if(_bkoBy-BKO.bR<0){_bkoBy=BKO.bR;_bkoBvy*=-1;}
    // Paddle
    if(_bkoBy+BKO.bR>=BKO.h-BKO.padH-10&&_bkoBx>=_bkoPx&&_bkoBx<=_bkoPx+BKO.padW&&_bkoBvy>0){
        _bkoBvy=-Math.abs(_bkoBvy);
        _bkoBvx+=(_bkoBx-(_bkoPx+BKO.padW/2))*0.05;
    }
    // Ball lost
    if(_bkoBy+BKO.bR>BKO.h){
        _bkoLives--; document.getElementById('bko-lives').textContent=_bkoLives;
        if(_bkoLives<=0){
            _bkoRunning=false;
            const ov=document.getElementById('bko-overlay');
            if(ov){ov.style.display='flex';ov.querySelector('h2').textContent='💥 Game Over';ov.querySelector('p').textContent=`Score: ${_bkoScore}`;}
            return;
        }
        _bkoBx=BKO.w/2;_bkoBy=BKO.h-60;_bkoBvy=-4;_bkoBvx=3.5*(Math.random()<0.5?1:-1);
    }
    // Brick collision
    for(const b of _bkoBricks){
        if(!b.alive) continue;
        if(_bkoBx+BKO.bR>b.x&&_bkoBx-BKO.bR<b.x+b.w&&_bkoBy+BKO.bR>b.y&&_bkoBy-BKO.bR<b.y+b.h){
            b.alive=false; _bkoScore+=10; document.getElementById('bko-score').textContent=_bkoScore;
            // Determine bounce axis
            const overlapL=_bkoBx+BKO.bR-b.x,overlapR=b.x+b.w-_bkoBx+BKO.bR;
            const overlapT=_bkoBy+BKO.bR-b.y,overlapB=b.y+b.h-_bkoBy+BKO.bR;
            if(Math.min(overlapL,overlapR)<Math.min(overlapT,overlapB)) _bkoBvx*=-1; else _bkoBvy*=-1;
            break;
        }
    }
    if(_bkoBricks.every(b=>!b.alive)){
        _bkoRunning=false;
        const ov=document.getElementById('bko-overlay');
        if(ov){ov.style.display='flex';ov.querySelector('h2').textContent='🎉 You Win!';ov.querySelector('p').textContent=`Score: ${_bkoScore}`;}
        return;
    }
    bkoDraw();
    _bkoRAF=requestAnimationFrame(bkoLoop);
}

function bkoDraw() {
    const c=document.getElementById('bko-canvas');if(!c)return;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#111';ctx.fillRect(0,0,BKO.w,BKO.h);
    // Bricks
    _bkoBricks.forEach(b=>{
        if(!b.alive) return;
        ctx.fillStyle=b.color;ctx.fillRect(b.x,b.y,b.w,b.h);
        ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(b.x,b.y,b.w,4);
    });
    // Paddle
    ctx.fillStyle='#90caf9';ctx.beginPath();
    ctx.roundRect(_bkoPx,BKO.h-BKO.padH-10,BKO.padW,BKO.padH,6);ctx.fill();
    // Ball
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(_bkoBx,_bkoBy,BKO.bR,0,Math.PI*2);ctx.fill();
}


// ──────────────────────────────────────────────────────
// WORDLE
// ──────────────────────────────────────────────────────
APPS.wordle = function () {
    const body = `
      <div class="wordle-wrap">
        <div id="wordle-grid" class="wordle-grid"></div>
        <div id="wordle-keyboard" class="wordle-keyboard"></div>
        <div id="wordle-msg" class="wordle-msg"></div>
      </div>`;
    createAppWindow('wordle', 'Wordle', '🟩', body, 380, 540);
    wordleInit();
};

const WORDLE_WORDS=['about','above','abuse','actor','acute','admit','adopt','adult','after','again','agent','agree','ahead','alarm','album','alert','alibi','align','alike','alive','alley','allow','alone','along','aloud','alpha','altar','alter','angel','anger','angle','angry','anime','annex','antic','anvil','aorta','apart','apple','apply','arena','argue','arise','armor','aroma','arose','array','arrow','Asian','asked','asset','atlas','attic','audio','audit','avoid','awake','award','aware','awful','azure','badge','basic','basis','batch','beach','began','begin','being','below','bench','bible','birth','black','blade','blame','bland','blank','blast','blaze','bleed','blend','bless','blind','block','blood','bloom','blown','blues','blunt','blush','board','bonus','boost','booth','booze','bound','boxed','brain','brand','brave','bread','break','breed','brick','bride','brief','bring','brink','brisk','broad','broke','brown','brush','buddy','build','built','bulge','bunch','burst','cable','camel','candy','carry','catch','cause','cedar','chair','chalk','chaos','champ','charm','chart','chase','cheap','check','cheek','cheer','chess','chest','chief','child','chill','china','choir','chose','civic','civil','clamp','claim','clang','clash','class','clean','clear','clerk','click','cliff','cling','clock','clone','close','cloud','clown','coach','coast','cobra','color','comic','conga','coral','comet','comic','coral','could','count','court','cover','crack','craft','crane','crash','cream','creek','crime','crisp','cross','crowd','crown','cruel','crush','curly','curry','curve','cycle','daily','dance','datum','dealt','decal','decay','derby','depth','derby','devil','digit','dirty','disco','ditch','dizzy','dodge','doing','doubt','dough','draft','drain','drama','drank','drawl','dread','dream','dress','dried','drift','drink','drive','drone','drool','droop','drove','drown','drugs','dryer','dunce','dwarf','dying','eager','early','earth','eight','email','ember','empty','enemy','enjoy','enter','entry','equal','error','evade','event','every','exact','exist','extra','fable','faced','faint','fairy','faith','fancy','fatal','feast','fetch','fever','fiber','field','fiend','fifth','fifty','fight','final','first','fixed','flame','flank','flare','flash','flask','fleet','flesh','float','flood','floor','flora','flour','fluid','flunk','focal','focus','force','forge','forth','forum','found','frame','frank','fraud','fresh','frost','froze','fruit','fully','funny','fuzzy','gauge','gave','genre','ghost','giant','given','gizmo','glare','glass','glean','gleam','gloat','globe','gloomy','gloss','glove','going','grace','grade','grain','grand','grant','grasp','grass','grate','graze','greed','greet','grief','gripe','groan','grope','gross','group','grove','grown','guard','guide','guile','guise','guitar','gulch','gusto','gypsy','habit','haiku','happy','harsh','haste','haven','hazel','heard','heart','heavy','hedge','hefty','heist','hello','hence','herbs','hoist','homer','honor','hoped','house','human','humid','humor','hurry','hyper','idiom','image','imply','index','indie','infer','inner','input','intel','inter','intro','irony','issue','ivory','jazzy','jewel','joint','joust','judge','juice','juicy','jumbo','karma','kayak','knack','kneel','knife','knock','known','kudos','label','large','laser','later','latch','laugh','layer','learn','legal','lemon','leper','level','light','limit','lingo','lions','liver','local','lodge','logic','login','loose','lorry','lover','lucky','lunar','lyric','magic','major','maker','mambo','manor','maple','march','marry','match','mayor','media','mercy','merit','metal','mirth','mixed','mixer','moist','money','month','moral','mourn','muddy','multi','music','myrrh','nabob','naive','naked','nifty','ninja','noble','noise','north','notch','novel','nurse','nutty','nymph','occur','ocean','olive','onset','opted','order','other','other','ought','ounce','outer','owned','ozone','paint','panel','panic','papal','paper','patch','pause','peace','pearl','pedal','penny','perky','perch','petal','phase','phone','photo','piano','piece','pilot','pixel','pizza','place','plaid','plank','plant','plate','plaza','plead','pluck','plumb','plume','plunk','plush','point','polar','pound','power','press','price','prick','pride','prime','print','prior','prize','probe','prose','proud','prowl','psalm','psych','punch','pupil','queen','queue','quick','quiet','quirk','quota','quote','radar','raise','rally','ramps','ranch','range','rapid','ratio','reach','ready','realm','rebel','refer','reign','relay','relax','repay','repel','rerun','reset','rider','ridge','rifle','right','risky','rival','river','robot','rocky','rogue','roman','roost','rouge','rough','round','royal','rugby','ruler','rupee','rusty','sadly','saint','salsa','sauce','scale','scamp','scare','scarf','scene','scent','scone','scoop','score','scout','screw','scrub','seize','serve','setup','seven','sewer','shade','shaft','shake','shaky','shale','shalt','shame','shape','share','shark','sharp','shave','sheen','sheep','sheer','sheet','shelf','shell','shiny','shirt','shock','shoot','shore','short','shout','shove','shown','shrug','sight','silly','since','sixth','sixty','sized','skate','skill','skimp','skull','skunk','slain','slant','slash','slate','sleek','sleep','sleet','slept','slide','slime','slimy','sling','slink','slosh','slump','small','smart','smash','smell','smile','smite','smoggy','smoke','snack','snail','snake','snare','sneak','sneer','sniff','snore','snow','solid','solve','sonic','sorry','south','space','spare','spark','spawn','speak','spend','spice','spicy','spine','spite','splat','split','spoke','spook','spool','sport','spout','spray','squad','squat','squid','stack','staff','stage','stain','stair','stake','stale','stall','stamp','stand','stark','start','stash','state','stays','steal','steam','steel','steep','steer','stern','stick','stiff','sting','stink','stock','stomp','store','stout','stove','strap','straw','stray','strip','strut','stuck','stunt','style','sugar','suite','sunny','super','surge','swamp','swear','sweep','sweet','swept','swift','swipe','sword','swore','swung','table','taste','taunt','teeth','tempo','tense','tenth','tepid','terms','their','theme','there','these','thing','think','third','thorn','those','three','threw','throw','thumb','tiger','tight','timer','title','token','topaz','total','touch','tough','towel','toxic','trace','track','trade','trail','train','trait','tramp','trash','trawl','tread','treat','trend','trial','tribe','tried','tripe','troll','trove','truck','truly','trump','trunk','trust','truth','tunic','tuple','twin','typed','ultra','uncle','unfit','union','unity','unzip','upper','upset','urban','usher','usual','utter','valid','value','vapor','vault','veins','vigor','viral','virus','visit','visor','vista','vital','vocab','voice','vouch','vowel','waist','watch','water','waved','weary','wedge','weigh','weird','whale','wheat','wheel','where','which','while','white','whole','whose','wield','witch','woman','women','world','worry','worse','worst','worth','would','wrath','write','wrote','yacht','yearn','yield','young','youth','zebra','zesty','zilch','zippy'];

let _wdWord='', _wdGuesses=[], _wdCurrent='', _wdOver=false;

function wordleInit() {
    const today=new Date(); const idx=(today.getFullYear()*365+today.getMonth()*31+today.getDate())%WORDLE_WORDS.length;
    _wdWord=WORDLE_WORDS[idx].toUpperCase();
    _wdGuesses=[]; _wdCurrent=''; _wdOver=false;
    wordleRenderGrid(); wordleRenderKB();
    document.addEventListener('keydown', wordleKey);
}

function wordleKey(e) {
    if(_wdOver||!document.getElementById('wordle-grid')) return;
    if(e.key==='Enter'){wordleSubmit();return;}
    if(e.key==='Backspace'){_wdCurrent=_wdCurrent.slice(0,-1);wordleRenderGrid();return;}
    if(/^[a-zA-Z]$/.test(e.key)&&_wdCurrent.length<5){_wdCurrent+=e.key.toUpperCase();wordleRenderGrid();}
}

function wordleType(l){
    if(_wdOver||!document.getElementById('wordle-grid')) return;
    if(l==='⌫'){_wdCurrent=_wdCurrent.slice(0,-1);}
    else if(l==='↵'){wordleSubmit();}
    else if(_wdCurrent.length<5){_wdCurrent+=l;}
    wordleRenderGrid();
}

function wordleSubmit() {
    if(_wdCurrent.length<5){wordleMsg('Type a 5-letter word');return;}
    const result=wordleScore(_wdCurrent,_wdWord);
    _wdGuesses.push({word:_wdCurrent,result});
    _wdCurrent='';
    if(result.every(r=>r==='correct')){_wdOver=true;wordleRenderGrid();wordleMsg('🎉 Brilliant!');return;}
    if(_wdGuesses.length>=6){_wdOver=true;wordleRenderGrid();wordleMsg('The word was '+_wdWord);return;}
    wordleRenderGrid(); wordleRenderKB();
}

function wordleScore(guess,answer) {
    const res=Array(5).fill('absent');
    const pool=[...answer];
    // Correct pass
    for(let i=0;i<5;i++) if(guess[i]===answer[i]){res[i]='correct';pool[pool.indexOf(guess[i])]='_';}
    // Present pass
    for(let i=0;i<5;i++) if(res[i]!=='correct'){const j=pool.indexOf(guess[i]);if(j!==-1){res[i]='present';pool[j]='_';}}
    return res;
}

function wordleRenderGrid() {
    const grid=document.getElementById('wordle-grid');if(!grid)return;
    grid.innerHTML='';
    for(let row=0;row<6;row++){
        for(let col=0;col<5;col++){
            const tile=document.createElement('div');
            tile.className='wordle-tile';
            const guess=_wdGuesses[row];
            if(guess){tile.textContent=guess.word[col];tile.classList.add(guess.result[col]);}
            else if(row===_wdGuesses.length&&col<_wdCurrent.length){tile.textContent=_wdCurrent[col];tile.classList.add('filled');}
            grid.appendChild(tile);
        }
    }
}

function wordleRenderKB() {
    const kb=document.getElementById('wordle-keyboard');if(!kb)return;
    kb.innerHTML='';
    const rows=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['↵','Z','X','C','V','B','N','M','⌫']];
    const states={};
    _wdGuesses.forEach(g=>g.word.split('').forEach((l,i)=>{
        const s=g.result[i];
        if(s==='correct'||(!states[l]||states[l]==='absent'&&s==='present')) states[l]=s;
    }));
    rows.forEach(row=>{
        const rowEl=document.createElement('div');rowEl.className='wordle-kb-row';
        row.forEach(l=>{
            const btn=document.createElement('button');btn.className='wordle-key';
            btn.textContent=l;if(states[l])btn.classList.add(states[l]);
            btn.onclick=()=>wordleType(l);
            rowEl.appendChild(btn);
        });
        kb.appendChild(rowEl);
    });
}

function wordleMsg(m){const el=document.getElementById('wordle-msg');if(el){el.textContent=m;setTimeout(()=>{if(el)el.textContent='';},3000);}}


// ──────────────────────────────────────────────────────
// MEMORY CARD GAME
// ──────────────────────────────────────────────────────
APPS.memory = function () {
    const body = `
      <div class="mem-wrap">
        <div class="mem-hud">
          Pairs: <span id="mem-pairs">0</span>/8 &nbsp; Moves: <span id="mem-moves">0</span> &nbsp; Time: <span id="mem-time">0s</span>
          <button onclick="memNew()">New Game</button>
        </div>
        <div id="mem-board" class="mem-board"></div>
        <div class="game-overlay" id="mem-overlay" style="display:none;">
          <h2>🎉 You Win!</h2>
          <p id="mem-result"></p>
          <button onclick="memNew()">Play Again</button>
        </div>
      </div>`;
    createAppWindow('memory', 'Memory', '🃏', body, 420, 480);
    memNew();
};

const MEM_EMOJIS=['🐶','🐱','🦊','🐻','🦁','🐸','🦋','🌸'];
let _memCards=[],_memFlipped=[],_memPairs=0,_memMoves=0,_memTimer=null,_memTimerVal=0,_memLock=false;

function memNew() {
    clearInterval(_memTimer); _memTimerVal=0; _memPairs=0; _memMoves=0; _memLock=false; _memFlipped=[];
    const pairs=[...MEM_EMOJIS,...MEM_EMOJIS].sort(()=>Math.random()-0.5);
    _memCards=pairs.map((e,i)=>({emoji:e,id:i,flipped:false,matched:false}));
    document.getElementById('mem-pairs').textContent='0';
    document.getElementById('mem-moves').textContent='0';
    document.getElementById('mem-time').textContent='0s';
    const ov=document.getElementById('mem-overlay');if(ov)ov.style.display='none';
    _memTimer=setInterval(()=>{_memTimerVal++;const el=document.getElementById('mem-time');if(el)el.textContent=_memTimerVal+'s';},1000);
    memRender();
}

function memFlip(idx) {
    if(_memLock||_memCards[idx].flipped||_memCards[idx].matched) return;
    _memCards[idx].flipped=true; _memFlipped.push(idx); memRender();
    if(_memFlipped.length===2){
        _memMoves++; const el=document.getElementById('mem-moves');if(el)el.textContent=_memMoves;
        const [a,b]=_memFlipped;
        if(_memCards[a].emoji===_memCards[b].emoji){
            _memCards[a].matched=_memCards[b].matched=true; _memFlipped=[]; _memPairs++;
            document.getElementById('mem-pairs').textContent=_memPairs;
            if(_memPairs===8){clearInterval(_memTimer);const ov=document.getElementById('mem-overlay');
                if(ov){ov.style.display='flex';document.getElementById('mem-result').textContent=`${_memMoves} moves in ${_memTimerVal}s`;}}
        } else {
            _memLock=true;
            setTimeout(()=>{_memCards[a].flipped=_memCards[b].flipped=false;_memFlipped=[];_memLock=false;memRender();},1000);
        }
    }
}

function memRender() {
    const board=document.getElementById('mem-board');if(!board)return;
    board.innerHTML='';
    _memCards.forEach((card,i)=>{
        const div=document.createElement('div');
        div.className='mem-card'+(card.flipped||card.matched?' flipped':'')+(card.matched?' matched':'');
        div.innerHTML=`<div class="mem-card-inner"><div class="mem-front">${card.emoji}</div><div class="mem-back">?</div></div>`;
        div.onclick=()=>memFlip(i);
        board.appendChild(div);
    });
}

// ──────────────────────────────────────────────────────
// TIC-TAC-TOE
// ──────────────────────────────────────────────────────
APPS.tictactoe = function () {
    const body = `
      <div class="ttt-wrap">
        <div class="ttt-hud">
          <span id="ttt-status">X's turn</span>
          <button onclick="tttNew()">New Game</button>
        </div>
        <div id="ttt-board" class="ttt-board"></div>
        <div class="ttt-mode">
          <label><input type="checkbox" id="ttt-ai" checked> vs AI (O)</label>
        </div>
      </div>`;
    createAppWindow('tictactoe', 'Tic-Tac-Toe', '❌', body, 340, 420);
    tttNew();
};

let _tttBoard=Array(9).fill(''),_tttTurn='X',_tttOver=false;

function tttNew(){
    _tttBoard=Array(9).fill(''); _tttTurn='X'; _tttOver=false;
    const el=document.getElementById('ttt-status');if(el)el.textContent="X's turn";
    tttRender();
}

function tttMove(i){
    if(_tttOver||_tttBoard[i]) return;
    _tttBoard[i]=_tttTurn;
    const win=tttCheck();
    if(win){
        _tttOver=true;
        const el=document.getElementById('ttt-status');
        if(el) el.textContent = win==='draw'?'Draw!':`${_tttTurn} wins! 🎉`;
        tttRender(); return;
    }
    _tttTurn=_tttTurn==='X'?'O':'X';
    const el=document.getElementById('ttt-status');if(el)el.textContent=`${_tttTurn}'s turn`;
    tttRender();
    const aiOn=(document.getElementById('ttt-ai')||{}).checked;
    if(!_tttOver&&_tttTurn==='O'&&aiOn) setTimeout(tttAI,300);
}

function tttAI(){
    // Minimax
    const best=tttMinimax(_tttBoard,'O');
    tttMove(best.idx);
}

function tttMinimax(board,player){
    const win=tttCheckBoard(board);
    if(win==='O') return {score:10};
    if(win==='X') return {score:-10};
    if(board.every(v=>v)) return {score:0};
    const moves=[];
    board.forEach((_,i)=>{if(!board[i]){
        const b=[...board];b[i]=player;
        const res=tttMinimax(b,player==='O'?'X':'O');
        moves.push({idx:i,score:res.score});
    }});
    return moves.reduce((a,b)=>player==='O'?(b.score>a.score?b:a):(b.score<a.score?b:a));
}

function tttCheck(){return tttCheckBoard(_tttBoard);}
function tttCheckBoard(b){
    const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const [a,c,d] of lines) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a];
    return b.every(v=>v)?'draw':null;
}

function tttRender(){
    const board=document.getElementById('ttt-board');if(!board)return;
    board.innerHTML='';
    _tttBoard.forEach((v,i)=>{
        const cell=document.createElement('div');
        cell.className='ttt-cell'+(v?' filled':'');
        cell.textContent=v;
        cell.style.color=v==='X'?'#e53935':'#1e88e5';
        cell.onclick=()=>tttMove(i);
        board.appendChild(cell);
    });
}
