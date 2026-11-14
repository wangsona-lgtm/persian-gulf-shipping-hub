/**
 * ECDIS 數位海圖互動向量渲染引擎 (ECDIS Chart Engine)
 * 嚴格依照航海規格繪製波斯灣地理、水深等深線、荷姆茲海峽 TSS 與 5 大動態光流航線
 */

class ECDISChart {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.activePortId = "jebel_ali";
    this.activeCarrierId = "all";
    this.visibleLanes = {
      lane_fareast: true,
      lane_europe: true,
      lane_vlcc: true,
      lane_feeder: true,
      lane_adcop: true
    };
    
    // 經緯度投影參數
    this.bounds = {
      minLon: 47.0,
      maxLon: 60.0,
      minLat: 23.0,
      maxLat: 31.0
    };
    this.width = 850;
    this.height = 620;

    this.init();
  }

  // 經緯度轉 SVG 座標
  project(lon, lat) {
    const x = ((lon - this.bounds.minLon) / (this.bounds.maxLon - this.bounds.minLon)) * this.width;
    const y = ((this.bounds.maxLat - lat) / (this.bounds.maxLat - this.bounds.minLat)) * this.height;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }

  init() {
    if (!this.container) return;
    this.renderChartSkeleton();
    this.bindEvents();
    // 預設選中 Jebel Ali 港
    this.selectPort("jebel_ali");
  }

  renderChartSkeleton() {
    this.container.innerHTML = `
      <div class="ecdis-viewport">
        <svg id="ecdisSvg" class="ecdis-svg-chart" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- 濾鏡：發光特效 -->
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowPurple" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <!-- TSS 隔離帶斜紋圖樣 (IMO Standard Hazard Hatch) -->
            <pattern id="tssHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#eab308" stroke-width="2.2" stroke-opacity="0.8" />
            </pattern>

            <!-- 航道箭頭 Marker -->
            <marker id="arrowInbound" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00ff88" />
            </marker>
            <marker id="arrowOutbound" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffd700" />
            </marker>
          </defs>

          <!-- 1. 背景水深色塊 (Bathymetry) -->
          <rect width="${this.width}" height="${this.height}" fill="#060f1d" />
          
          <!-- 阿曼灣與深水洋盆 (Deep Oceanic Trench >100m) -->
          <path d="M 610,340 C 660,380 720,440 850,520 L 850,620 L 590,620 C 600,550 610,480 610,340 Z" class="ecdis-contour-100m" />
          
          <!-- 波斯灣中央軸向深槽 (Deep Water Central Trough 40m-80m) -->
          <path d="M 80,110 C 130,190 220,270 330,340 C 440,360 520,320 570,300 C 585,320 610,340 640,410 C 700,480 780,540 850,570 L 850,600 C 730,550 650,470 595,350 C 565,280 480,310 380,340 C 270,310 180,220 70,120 Z" class="ecdis-contour-50m" />

          <!-- 淺水陸棚帶 (<20m) 沿卡達/阿聯酋海岸 -->
          <path d="M 220,380 C 270,420 360,450 490,440 C 530,420 550,380 540,360 C 480,370 350,380 280,350 Z" class="ecdis-contour-10m" />

          <!-- 2. 經緯度網格線 (Graticule) -->
          ${this.generateGraticulesHtml()}

          <!-- 3. 陸地輪廓 (Landmasses) -->
          <!-- 北部伊朗大陸 (Iran) -->
          <path d="M 0,0 L ${this.width},0 L ${this.width},410 C 800,380 720,360 660,330 C 610,310 585,270 570,240 C 540,260 480,280 410,270 C 330,240 250,210 170,170 C 110,130 50,80 0,60 Z" class="ecdis-land" />
          
          <!-- 伊拉克與幼發拉底河口 (Iraq & Kuwait) -->
          <path d="M 0,60 C 40,75 80,100 85,115 C 80,130 60,150 50,170 L 0,180 Z" class="ecdis-land" />

          <!-- 阿拉伯半島大陸 (Saudi Arabia, UAE, Oman) -->
          <path d="M 0,180 C 60,190 120,230 180,260 C 200,280 220,310 210,340 C 200,370 230,400 280,410 C 310,390 320,350 330,330 C 340,350 350,390 360,420 C 410,430 460,435 500,425 C 530,415 545,390 560,340 C 570,305 585,295 592,305 C 596,325 585,350 595,380 C 610,410 630,460 660,530 C 690,580 740,620 850,620 L 0,620 Z" class="ecdis-land" />

          <!-- 巴林島 (Bahrain Island) -->
          <ellipse cx="265" cy="325" rx="8" ry="16" class="ecdis-land-island" transform="rotate(-15 265 325)" />
          
          <!-- 格什姆島 (Qeshm Island - 伊朗) -->
          <ellipse cx="545" cy="272" rx="32" ry="9" class="ecdis-land-island" transform="rotate(-8 545 272)" />
          <!-- 霍爾木茲島與拉拉克島 (Hormuz & Larak Island) -->
          <circle cx="585" cy="265" r="4.5" class="ecdis-land-island" />
          <circle cx="580" cy="280" r="3.5" class="ecdis-land-island" />

          <!-- 4. 地名與水域標籤 -->
          <text x="350" y="300" class="ecdis-water-label">PERSIAN GULF (波斯灣 / 阿拉伯灣)</text>
          <text x="730" y="470" class="ecdis-water-label">GULF OF OMAN (阿曼灣)</text>
          <text x="780" y="590" class="ecdis-water-label">ARABIAN SEA (阿拉伯海)</text>
          
          <text x="360" y="160" class="ecdis-country-label">IRAN (伊朗)</text>
          <text x="140" y="450" class="ecdis-country-label">SAUDI ARABIA (沙烏地阿拉伯)</text>
          <text x="450" y="510" class="ecdis-country-label">UNITED ARAB EMIRATES (阿聯酋)</text>
          <text x="700" y="600" class="ecdis-country-label">OMAN (阿曼)</text>

          <!-- 5. 荷姆茲海峽 TSS 分道通航制視覺層 (Strait of Hormuz TSS) -->
          <g id="tssLayer">
            <!-- TSS 隔離緩衝安全帶 (Separation Zone) -->
            <polygon points="562,298 585,316 600,332 595,338 578,322 556,304" class="ecdis-tss-separation" />
            
            <!-- 北側向西進港航道 (Inbound Westbound Lane) -->
            <path d="M 612,320 L 592,305 L 565,288" class="ecdis-tss-arrow" stroke="#00ff88" stroke-dasharray="6, 3" marker-mid="url(#arrowInbound)" />
            <text x="595" y="296" fill="#00ff88" font-size="8" font-family="monospace" font-weight="700">INBOUND (240°)</text>

            <!-- 南側向東出港航道 (Outbound Eastbound Lane) -->
            <path d="M 570,314 L 582,330 L 595,350" class="ecdis-tss-arrow" stroke="#ffd700" stroke-dasharray="6, 3" marker-mid="url(#arrowOutbound)" />
            <text x="600" y="360" fill="#ffd700" font-size="8" font-family="monospace" font-weight="700">OUTBOUND (060°)</text>

            <!-- TSS 外框標記 -->
            <rect x="545" y="275" width="75" height="90" class="ecdis-tss-box" />
            <text x="550" y="285" fill="#38bdf8" font-size="8" font-family="monospace" font-weight="800">IMO TSS HORMUZ</text>
          </g>

          <!-- 6. 動態航道光流線 (Dynamic Flow Shipping Lanes) -->
          <g id="shippingLanesLayer">
            ${this.generateShippingLanesHtml()}
          </g>

          <!-- 7. 12 大樞紐港口群 (Hub Ports Layer) -->
          <g id="portsLayer">
            ${this.generatePortsHtml()}
          </g>
        </svg>

        <!-- 羅經盤 (Compass Rose) -->
        <div class="ecdis-compass-rose">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" stroke-dasharray="3, 3" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="0.8" />
            <!-- 北向指針 -->
            <polygon points="50,10 55,50 50,45" fill="#f43f5e" />
            <polygon points="50,10 45,50 50,45" fill="#fb7185" />
            <!-- 南向指針 -->
            <polygon points="50,90 55,50 50,55" fill="#64748b" />
            <polygon points="50,90 45,50 50,55" fill="#94a3b8" />
            <!-- 東西指針 -->
            <polygon points="90,50 50,55 55,50" fill="#475569" />
            <polygon points="10,50 50,55 45,50" fill="#475569" />
            <circle cx="50" cy="50" r="4" fill="#38bdf8" />
            <text x="50" y="8" fill="#f43f5e" font-size="10" font-weight="900" text-anchor="middle">N</text>
            <text x="96" y="53" fill="#94a3b8" font-size="9" text-anchor="middle">E</text>
            <text x="50" y="99" fill="#94a3b8" font-size="9" text-anchor="middle">S</text>
            <text x="4" y="53" fill="#94a3b8" font-size="9" text-anchor="middle">W</text>
          </svg>
        </div>

        <!-- 底部 HUD 狀態欄 -->
        <div class="ecdis-hud-status">
          <span class="mode-badge">ECDIS NIGHT S-52</span>
          <span>WGS-84 LAT 23°N-31°N / LON 47°E-60°E</span>
          <span>DEPTH: SOUNDINGS IN METRES</span>
          <span style="color:#10b981;">TSS ACTIVE</span>
        </div>

        <!-- 浮動提示框 Tooltip -->
        <div id="ecdisTooltip" class="ecdis-tooltip"></div>
      </div>
    `;
  }

  // 繪製經緯度刻度線
  generateGraticulesHtml() {
    let html = '';
    // 緯線: 24°N, 26°N, 28°N, 30°N
    [24, 26, 28, 30].forEach(lat => {
      const p = this.project(47, lat);
      html += `
        <line x1="0" y1="${p.y}" x2="${this.width}" y2="${p.y}" class="ecdis-graticule" />
        <text x="10" y="${p.y - 4}" class="ecdis-coord-label">${lat}°00'N</text>
      `;
    });
    // 經線: 48°E, 50°E, 52°E, 54°E, 56°E, 58°E, 60°E
    [48, 50, 52, 54, 56, 58, 60].forEach(lon => {
      const p = this.project(lon, 23);
      html += `
        <line x1="${p.x}" y1="0" x2="${p.x}" y2="${this.height}" class="ecdis-graticule" />
        <text x="${p.x + 4}" y="${this.height - 10}" class="ecdis-coord-label">${lon}°00'E</text>
      `;
    });
    return html;
  }

  // 繪製五條動態光流航道
  generateShippingLanesHtml() {
    if (!window.SHIPPING_LANES) return '';
    return window.SHIPPING_LANES.map(lane => {
      const d = lane.path.map((pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `L ${pt.x},${pt.y}`)).join(' ');
      let activeClass = '';
      if (lane.id === 'lane_fareast') activeClass = 'flow-active-fareast';
      if (lane.id === 'lane_europe') activeClass = 'flow-active-europe';
      if (lane.id === 'lane_vlcc') activeClass = 'flow-active-vlcc';
      if (lane.id === 'lane_feeder') activeClass = 'flow-active-feeder';
      if (lane.id === 'lane_adcop') activeClass = 'flow-active-adcop';

      return `
        <g id="group_${lane.id}" class="shipping-lane-group">
          <!-- 光暈底層 -->
          <path d="${d}" class="flow-line flow-line-glow" stroke="${lane.color}" stroke-width="${lane.strokeWidth * 2}" />
          <!-- 動態實體光流 -->
          <path d="${d}" id="${lane.id}" class="flow-line ${activeClass}" 
                stroke="${lane.color}" 
                stroke-width="${lane.strokeWidth}" 
                stroke-dasharray="${lane.dashArray === 'solid' ? 'none' : lane.dashArray}" />
        </g>
      `;
    }).join('');
  }

  // 繪製 12 大樞紐港口
  generatePortsHtml() {
    if (!window.PORTS_DATA) return '';
    return window.PORTS_DATA.map(port => {
      const pos = port.svgPos;
      return `
        <g id="port_${port.id}" class="ecdis-port-group" data-port-id="${port.id}" transform="translate(${pos.x}, ${pos.y})">
          <!-- 雷達脈動圈 -->
          <circle cx="0" cy="0" r="8" class="ecdis-port-radar" stroke="${port.type === 'energy_lng' ? '#ffd700' : '#0ea5e9'}" />
          <!-- 港口核心節點 -->
          <circle cx="0" cy="0" r="5.5" class="ecdis-port-node ${port.id === this.activePortId ? 'active' : ''}" id="node_${port.id}" />
          <!-- 港口中文名稱標註 -->
          <text x="0" y="-12" class="ecdis-port-label">${port.nameZh.split('（')[0]}</text>
          <!-- 港口代碼與吃水 -->
          <text x="0" y="16" class="ecdis-port-code">${port.code} (${port.depth})</text>
        </g>
      `;
    }).join('');
  }

  bindEvents() {
    const tooltip = document.getElementById('ecdisTooltip');
    const portGroups = this.container.querySelectorAll('.ecdis-port-group');

    portGroups.forEach(group => {
      const portId = group.getAttribute('data-port-id');
      const port = window.PORTS_DATA.find(p => p.id === portId);

      // 點擊事件：切換選中港口
      group.addEventListener('click', () => {
        this.selectPort(portId);
        if (typeof this.options.onPortSelect === 'function') {
          this.options.onPortSelect(port);
        }
      });

      // Hover Tooltip
      group.addEventListener('mouseenter', (e) => {
        if (!tooltip || !port) return;
        tooltip.innerHTML = `
          <h4>⚓ ${port.nameZh}</h4>
          <div class="tt-row"><span>國家:</span> <span class="tt-val">${port.countryZh}</span></div>
          <div class="tt-row"><span>吞吐量:</span> <span class="tt-val">${port.throughput}</span></div>
          <div class="tt-row"><span>最大吃水:</span> <span class="tt-val">${port.depth}</span></div>
          <div class="tt-row"><span>營運商:</span> <span class="tt-val">${port.operator.split('（')[0]}</span></div>
        `;
        tooltip.style.display = 'block';
        this.updateTooltipPosition(e);
      });

      group.addEventListener('mousemove', (e) => {
        this.updateTooltipPosition(e);
      });

      group.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  updateTooltipPosition(e) {
    const tooltip = document.getElementById('ecdisTooltip');
    if (!tooltip) return;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  // 選中特定港口
  selectPort(portId) {
    this.activePortId = portId;
    const port = window.PORTS_DATA.find(p => p.id === portId);
    if (!port) return;

    // 更新港口節點 active 樣式
    this.container.querySelectorAll('.ecdis-port-node').forEach(node => {
      node.classList.remove('active');
    });
    const targetNode = document.getElementById(`node_${portId}`);
    if (targetNode) {
      targetNode.classList.add('active');
    }

    // 觸發右側卡片更新
    if (typeof this.options.onPortSelect === 'function') {
      this.options.onPortSelect(port);
    }
  }

  // 航商快速選擇器與航線高亮連動
  highlightCarrier(carrierId) {
    this.activeCarrierId = carrierId;
    const lanes = window.SHIPPING_LANES;
    const companies = window.SHIPPING_COMPANIES;
    const ports = window.PORTS_DATA;

    if (carrierId === 'all') {
      // 恢復全部正常顯示
      lanes.forEach(l => {
        const el = document.getElementById(l.id);
        const grp = document.getElementById(`group_${l.id}`);
        if (el) el.classList.remove('flow-dimmed', 'flow-highlighted');
        if (grp) grp.classList.remove('flow-dimmed');
      });
      ports.forEach(p => {
        const grp = document.getElementById(`port_${p.id}`);
        if (grp) grp.style.opacity = '1.0';
      });
      return;
    }

    const carrier = companies.find(c => c.id === carrierId);
    if (!carrier) return;

    // 根據航商群組高亮對應航線
    let relevantLanes = [];
    if (carrier.group === 'container') {
      relevantLanes = ['lane_fareast', 'lane_europe'];
    } else if (carrier.group === 'tanker_vlcc') {
      relevantLanes = ['lane_vlcc'];
      if (carrierId === 'adnoc_ls' || carrierId === 'bahri') {
        relevantLanes.push('lane_adcop');
      }
    } else if (carrier.group === 'lng_gas') {
      relevantLanes = ['lane_vlcc'];
    } else if (carrier.group === 'regional_feeder') {
      relevantLanes = ['lane_feeder'];
    }

    // 更新航線樣式
    lanes.forEach(l => {
      const el = document.getElementById(l.id);
      const grp = document.getElementById(`group_${l.id}`);
      if (!el || !grp) return;

      if (relevantLanes.includes(l.id)) {
        el.classList.remove('flow-dimmed');
        el.classList.add('flow-highlighted');
        grp.classList.remove('flow-dimmed');
      } else {
        el.classList.add('flow-dimmed');
        el.classList.remove('flow-highlighted');
        grp.classList.add('flow-dimmed');
      }
    });

    // 高亮該船商掛靠之港口
    ports.forEach(p => {
      const grp = document.getElementById(`port_${p.id}`);
      if (!grp) return;
      if (carrier.corePorts.includes(p.id)) {
        grp.style.opacity = '1.0';
        grp.querySelector('.ecdis-port-node').style.fill = carrier.color;
      } else {
        grp.style.opacity = '0.25';
      }
    });
  }

  // 切換單一航道顯示/隱藏
  toggleLane(laneId, isVisible) {
    this.visibleLanes[laneId] = isVisible;
    const grp = document.getElementById(`group_${laneId}`);
    if (grp) {
      grp.style.display = isVisible ? 'block' : 'none';
    }
  }
}

window.ECDISChart = ECDISChart;
