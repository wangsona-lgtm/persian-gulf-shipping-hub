/**
 * 全球航運咽喉與大動脈互動海圖 (Global Choke Points & Mainlines ECDIS Map)
 * 繪製全球十大海峽/運河、五大遠洋幹線與好望角繞道動脈
 */

class GlobalChokePointMap {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.activePointId = "hormuz";
    this.width = 960;
    this.height = 500;

    // 全球主要海峽咽喉 SVG 畫布座標對應表
    this.chokeCoords = {
      hormuz: { x: 575, y: 220, name: "荷姆茲海峽", rank: 1, type: "energy" },
      malacca: { x: 735, y: 285, name: "馬六甲海峽", rank: 2, type: "trade" },
      suez_bab_mandeb: { x: 535, y: 235, name: "蘇伊士/曼德海峽", rank: 3, type: "choke" },
      panama: { x: 235, y: 275, name: "巴拿馬運河", rank: 4, type: "canal" },
      taiwan_strait: { x: 785, y: 230, name: "台灣海峽", rank: 5, type: "tech" },
      cape_good_hope: { x: 515, y: 430, name: "好望角", rank: 6, type: "bypass" },
      turkish_straits: { x: 525, y: 175, name: "土耳其海峽", rank: 7, type: "grain" },
      gibraltar: { x: 445, y: 195, name: "直布羅陀海峽", rank: 8, type: "gate" },
      dover: { x: 465, y: 155, name: "多佛海峽", rank: 9, type: "hub" },
      danish_straits: { x: 495, y: 135, name: "丹麥海峽", rank: 10, type: "oil" }
    };

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.selectPoint("hormuz");
  }

  render() {
    this.container.innerHTML = `
      <div class="global-map-viewport">
        <svg id="globalMapSvg" class="global-svg-chart" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="globalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- 背景深海 -->
          <rect width="${this.width}" height="${this.height}" fill="#050d18" />

          <!-- 簡化世界大陸輪廓 (World Landmasses) -->
          <!-- 北美洲 (North America) -->
          <path d="M 110,60 C 150,50 240,60 270,110 C 260,160 230,190 200,220 C 180,240 210,250 230,270 L 220,290 C 180,270 140,240 120,200 C 90,160 80,110 110,60 Z" class="ecdis-land" />
          
          <!-- 南美洲 (South America) -->
          <path d="M 235,280 C 270,290 320,320 330,360 C 310,410 280,450 250,490 C 230,470 210,400 220,340 C 220,300 230,285 235,280 Z" class="ecdis-land" />

          <!-- 歐亞大陸 (Eurasia) -->
          <path d="M 440,140 C 470,100 560,80 680,85 C 800,90 880,120 890,180 C 850,220 820,250 780,260 C 740,280 690,260 660,240 C 620,210 580,220 540,190 C 500,210 460,200 440,170 Z" class="ecdis-land" />

          <!-- 非洲大陸 (Africa) -->
          <path d="M 450,200 C 510,190 550,240 550,280 C 540,340 530,400 515,430 C 480,420 440,360 430,300 C 420,250 440,210 450,200 Z" class="ecdis-land" />

          <!-- 澳洲 (Australia) -->
          <path d="M 760,350 C 830,340 860,380 850,420 C 810,440 760,430 740,390 C 740,360 755,350 760,350 Z" class="ecdis-land" />

          <!-- 全球主要遠洋航運幹線 (Global Maritime Mainlines) -->
          <!-- 1. 亞歐幹線 (經紅海/蘇伊士) -->
          <path d="M 785,230 L 735,285 L 630,260 L 575,220 L 535,235 L 460,190 L 465,155" class="flow-line flow-active-europe" stroke="#ff9900" stroke-width="2.5" stroke-dasharray="8, 4" />
          
          <!-- 2. 亞歐好望角繞道動脈 (Cape of Good Hope Bypass) -->
          <path d="M 735,285 L 640,330 L 530,410 L 515,430 L 440,370 L 410,260 L 445,195 L 465,155" class="flow-line flow-active-vlcc" stroke="#ffd700" stroke-width="2.8" stroke-dasharray="10, 5" />

          <!-- 3. 跨太平洋幹線 (Transpacific to US West Coast) -->
          <path d="M 785,230 C 850,200 930,170 960,165" class="flow-line flow-active-fareast" stroke="#00ff88" stroke-width="2.5" stroke-dasharray="8, 4" />
          <path d="M 0,165 C 40,170 80,180 140,190" class="flow-line flow-active-fareast" stroke="#00ff88" stroke-width="2.5" stroke-dasharray="8, 4" />

          <!-- 4. 美東經巴拿馬至東亞 (Panama Transpacific / LNG Route) -->
          <path d="M 230,180 L 235,275 L 180,270 L 100,250 C 40,240 0,230 0,230" class="flow-line flow-active-feeder" stroke="#00d2ff" stroke-width="2.2" stroke-dasharray="6, 4" />
          <path d="M 960,230 C 900,230 840,230 785,230" class="flow-line flow-active-feeder" stroke="#00d2ff" stroke-width="2.2" stroke-dasharray="6, 4" />

          <!-- 5. 波斯灣至東亞原油動脈 (Persian Gulf to East Asia) -->
          <path d="M 575,220 L 650,270 L 735,285 L 785,230 L 830,180" class="flow-line" stroke="#ffd700" stroke-width="3.2" stroke-dasharray="12, 6" />

          <!-- 繪製十大海峽節點 -->
          <g id="chokeNodesGroup">
            ${this.renderNodesHtml()}
          </g>
        </svg>

        <!-- 海圖浮動 HUD -->
        <div class="global-map-hud">
          <span style="color:#00ff88;">● 全球 10 大關鍵海峽咽喉</span>
          <span style="color:#ff9900;">━ 亞歐蘇伊士線</span>
          <span style="color:#ffd700;">━ 好望角繞道動脈</span>
          <span style="color:#00d2ff;">━ 美國巴拿馬線</span>
        </div>
      </div>
    `;
  }

  renderNodesHtml() {
    let html = '';
    const data = window.CHOKEPOINTS_DATA;
    if (!data) return '';

    data.forEach(cp => {
      const coord = this.chokeCoords[cp.id];
      if (!coord) return;

      const isRank1 = cp.rank === 1;
      const isRank2 = cp.rank === 2;
      const isRank3 = cp.rank === 3;
      const nodeColor = isRank1 ? '#ffd700' : (isRank2 ? '#00ff88' : (isRank3 ? '#f43f5e' : '#38bdf8'));
      const pulseColor = isRank1 ? 'rgba(255, 215, 0, 0.4)' : 'rgba(56, 189, 248, 0.3)';

      html += `
        <g class="global-choke-node-group" data-cp-id="${cp.id}" transform="translate(${coord.x}, ${coord.y})" style="cursor:pointer;">
          <!-- 雷達脈動圈 -->
          <circle cx="0" cy="0" r="14" fill="${pulseColor}" class="global-pulse-ring" />
          <!-- 節點本體 -->
          <circle cx="0" cy="0" r="7" fill="${nodeColor}" stroke="#ffffff" stroke-width="2.0" class="global-cp-node" id="global_node_${cp.id}" />
          <!-- 排名徽章 -->
          <text x="0" y="3.5" fill="#000" font-size="8" font-weight="900" text-anchor="middle" font-family="monospace">${cp.rank}</text>
          <!-- 海峽名稱標籤 -->
          <text x="0" y="-14" fill="#f8fafc" font-size="11" font-weight="800" text-anchor="middle" class="global-cp-label">
            ${cp.nameZh.split('（')[0].split(' ')[0]}
          </text>
        </g>
      `;
    });
    return html;
  }

  bindEvents() {
    const groups = this.container.querySelectorAll('.global-choke-node-group');
    groups.forEach(g => {
      g.addEventListener('click', () => {
        const cpId = g.getAttribute('data-cp-id');
        this.selectPoint(cpId);
        if (typeof this.options.onPointSelect === 'function') {
          const cp = window.CHOKEPOINTS_DATA.find(x => x.id === cpId);
          this.options.onPointSelect(cp);
        }
      });
    });
  }

  selectPoint(cpId) {
    this.activePointId = cpId;
    const cp = window.CHOKEPOINTS_DATA.find(x => x.id === cpId);
    if (!cp) return;

    // 更新節點 active 樣式
    this.container.querySelectorAll('.global-cp-node').forEach(n => {
      n.style.transform = 'scale(1)';
    });
    const targetNode = document.getElementById(`global_node_${cpId}`);
    if (targetNode) {
      targetNode.style.transform = 'scale(1.4)';
    }

    if (typeof this.options.onPointSelect === 'function') {
      this.options.onPointSelect(cp);
    }
  }
}

window.GlobalChokePointMap = GlobalChokePointMap;
