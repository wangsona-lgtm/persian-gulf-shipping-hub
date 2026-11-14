/**
 * 全球航運咽喉與大動脈專業 GIS 海圖 (Professional Global Choke Points & Mainlines Leaflet Map)
 * 整合真實全球經緯度座標投影、暗夜戰術衛星底圖、十大咽喉雷達排名標記與遠洋大動脈光流
 */

class GlobalChokePointMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.activePointId = "hormuz";
    this.map = null;
    this.chokeMarkers = {};
    this.mainlineLayers = [];

    // 全球十大海峽咽喉精準真實 GPS 經緯度座標
    this.chokeCoords = {
      hormuz: { lat: 26.56, lon: 56.25, name: "荷姆茲海峽", rank: 1, color: "#ffd700" },
      malacca: { lat: 1.43, lon: 103.10, name: "馬六甲海峽", rank: 2, color: "#00ff88" },
      suez_bab_mandeb: { lat: 12.58, lon: 43.33, name: "蘇伊士/曼德海峽", rank: 3, color: "#f43f5e" },
      panama: { lat: 9.08, lon: -79.68, name: "巴拿馬運河", rank: 4, color: "#00d2ff" },
      taiwan_strait: { lat: 24.50, lon: 119.80, name: "台灣海峽", rank: 5, color: "#38bdf8" },
      cape_good_hope: { lat: -34.35, lon: 18.47, name: "好望角", rank: 6, color: "#f59e0b" },
      turkish_straits: { lat: 41.11, lon: 29.07, name: "土耳其海峽", rank: 7, color: "#a855f7" },
      gibraltar: { lat: 35.96, lon: -5.60, name: "直布羅陀海峽", rank: 8, color: "#06b6d4" },
      dover: { lat: 51.10, lon: 1.45, name: "多佛海峽", rank: 9, color: "#3b82f6" },
      danish_straits: { lat: 55.33, lon: 11.00, name: "丹麥海峽", rank: 10, color: "#64748b" }
    };

    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="global-map-wrapper">
        <div id="globalLeafletMap" class="global-leaflet-canvas"></div>
        <div class="global-map-hud">
          <span style="color:#00ff88;">● 全球 10 大關鍵海峽咽喉</span>
          <span style="color:#ff9900;">━ 亞歐蘇伊士線</span>
          <span style="color:#ffd700;">━ 好望角繞道動脈</span>
          <span style="color:#00d2ff;">━ 美國巴拿馬線</span>
        </div>
      </div>
    `;

    if (typeof L === 'undefined') {
      console.error('Leaflet is not loaded!');
      return;
    }

    // 初始化全球地圖，中心點對準東半球偏中東/亞洲視野 [15, 45]，Zoom 2.5
    this.map = L.map('globalLeafletMap', {
      center: [18.0, 40.0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 9,
      zoomControl: true,
      attributionControl: false
    });

    // 載入暗夜戰術地圖
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(this.map);

    // 繪製全球遠洋動脈
    this.drawGlobalMainlines();

    // 繪製十大海峽咽喉標記
    this.drawChokeMarkers();

    // 預設選中荷姆茲海峽
    this.selectPoint("hormuz");
  }

  /**
   * 繪製全球遠洋大動脈 (Real Geodesics)
   */
  drawGlobalMainlines() {
    // 1. 亞歐幹線 (經馬六甲 -> 曼德海峽 -> 蘇伊士運河 -> 地中海 -> 多佛)
    const asiaEuropeRoute = [
      [31.2, 121.5], // 上海
      [22.3, 114.2], // 香港
      [1.43, 103.10], // 馬六甲
      [5.9, 80.5],   // 斯里蘭卡
      [12.58, 43.33], // 曼德海峽
      [27.8, 34.3],  // 紅海
      [30.58, 32.55], // 蘇伊士運河
      [36.0, 15.0],  // 地中海
      [35.96, -5.60], // 直布羅陀海峽
      [48.0, -5.0],
      [51.10, 1.45],  // 多佛海峽
      [51.9, 4.3]    // 鹿特丹
    ];
    L.polyline(asiaEuropeRoute, {
      color: '#ff9900',
      weight: 3,
      opacity: 0.85,
      dashArray: '8, 5',
      className: 'flow-active-europe'
    }).addTo(this.map).bindTooltip('亞歐蘇伊士直達幹線 (Suez Mainline)', { className: 'ecdis-map-tooltip' });

    // 2. 好望角繞道動脈 (Cape of Good Hope Bypass)
    const capeBypassRoute = [
      [1.43, 103.10], // 馬六甲海峽出口
      [-10.0, 75.0], // 印度洋南部
      [-25.0, 45.0], // 馬達加斯加南方
      [-34.35, 18.47], // 好望角 (南非)
      [-15.0, 5.0],  // 南大西洋
      [5.0, -15.0],
      [35.96, -5.60], // 直布羅陀
      [51.10, 1.45]  // 鹿特丹/多佛
    ];
    L.polyline(capeBypassRoute, {
      color: '#ffd700',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '12, 6',
      className: 'flow-active-vlcc'
    }).addTo(this.map).bindTooltip('好望角繞道終極動脈 (紅海危機替代航線)', { className: 'ecdis-map-tooltip' });

    // 3. 波斯灣至東亞原油動脈 (Persian Gulf to East Asia)
    const pgToAsiaRoute = [
      [26.56, 56.25], // 荷姆茲海峽
      [22.0, 65.0],
      [10.0, 75.0],
      [1.43, 103.10], // 馬六甲海峽
      [10.0, 110.0],
      [24.50, 119.80], // 台灣海峽
      [31.2, 121.5], // 中國上海/寧波
      [34.5, 138.0]  // 日本東京灣
    ];
    L.polyline(pgToAsiaRoute, {
      color: '#00ff88',
      weight: 4,
      opacity: 0.9,
      dashArray: '10, 5',
      className: 'flow-active-fareast'
    }).addTo(this.map).bindTooltip('波斯灣-東亞原油與 LNG 戰略動脈', { className: 'ecdis-map-tooltip' });

    // 4. 美東至東亞巴拿馬航線 (Panama Route)
    const panamaRoute = [
      [40.7, -74.0], // 紐約
      [25.0, -75.0],
      [9.08, -79.68], // 巴拿馬運河
      [15.0, -110.0],
      [22.0, -140.0],
      [24.50, 119.80] // 台灣海峽 / 東亞
    ];
    L.polyline(panamaRoute, {
      color: '#00d2ff',
      weight: 2.8,
      opacity: 0.85,
      dashArray: '6, 6',
      className: 'flow-active-feeder'
    }).addTo(this.map).bindTooltip('巴拿馬兩洋航線 (美國穀物與 LNG 運往東亞)', { className: 'ecdis-map-tooltip' });
  }

  /**
   * 繪製十大海峽咽喉雷達排名標記
   */
  drawChokeMarkers() {
    const data = window.CHOKEPOINTS_DATA;
    if (!data) return;

    data.forEach(cp => {
      const coord = this.chokeCoords[cp.id];
      if (!coord) return;

      const markerHtml = `
        <div class="leaflet-choke-rank-marker" id="choke_dom_${cp.id}">
          <div class="choke-pulse" style="background:${coord.color}44;"></div>
          <div class="choke-core" style="background:${coord.color};">${coord.rank}</div>
          <div class="choke-label">${cp.nameZh.split('（')[0].split(' ')[0]}</div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'leaflet-custom-choke-icon',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([coord.lat, coord.lon], { icon }).addTo(this.map);

      marker.on('click', () => {
        this.selectPoint(cp.id);
        if (typeof this.options.onPointSelect === 'function') {
          this.options.onPointSelect(cp);
        }
      });

      marker.bindTooltip(`
        <div style="font-size:13px; font-weight:bold; color:#ffd700;">⚔️ #${cp.rank} ${cp.nameZh}</div>
        <div style="font-size:11px; color:#fff;">每日原油: ${cp.dailyOilVolume.split('（')[0]}</div>
        <div style="font-size:11px; color:#00ff88;">每日貿易額: $${cp.tradeValueNum} 億美元</div>
        <div style="font-size:10px; color:#cbd5e1; margin-top:2px;">${cp.titleCategory}</div>
      `, { className: 'ecdis-map-tooltip', direction: 'top' });

      this.chokeMarkers[cp.id] = marker;
    });
  }

  /**
   * 選中指定咽喉海峽
   */
  selectPoint(cpId) {
    this.activePointId = cpId;
    const cp = window.CHOKEPOINTS_DATA.find(x => x.id === cpId);
    const coord = this.chokeCoords[cpId];
    if (!cp || !coord) return;

    // 平滑平移
    this.map.panTo([coord.lat, coord.lon], { animate: true, duration: 0.8 });

    // 更新 DOM Active 樣式
    document.querySelectorAll('.leaflet-choke-rank-marker').forEach(el => el.classList.remove('active'));
    const targetDom = document.getElementById(`choke_dom_${cpId}`);
    if (targetDom) targetDom.classList.add('active');

    // 觸發回調更新檔案卡片
    if (typeof this.options.onPointSelect === 'function') {
      this.options.onPointSelect(cp);
    }
  }
}

window.GlobalChokePointMap = GlobalChokePointMap;
