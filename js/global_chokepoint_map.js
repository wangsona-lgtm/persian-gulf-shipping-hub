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
          <span style="color:#00ff88;">● 全球 10 大關鍵海峽</span>
          <span style="color:#ff9900;">━ 亞歐蘇伊士線</span>
          <span style="color:#ffd700;">━ 好望角繞道線</span>
          <span style="color:#00ff88;">━ 波斯灣東亞原油線</span>
          <span style="color:#00d2ff;">━ 美國巴拿馬兩洋線</span>
          <span style="color:#a855f7;">━ 跨太平洋北線</span>
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
    // 1. 亞歐蘇伊士直達幹線 (經台灣海峽 -> 南海深水區 -> 馬六甲 -> 曼德海峽 -> 蘇伊士 -> 直布羅陀 -> 多佛)
    const asiaEuropeRoute = [
      [31.20, 121.50], // 上海洋山深水港
      [24.50, 119.80], // 台灣海峽 (Taiwan Strait)
      [22.30, 114.20], // 香港葵青貨櫃碼頭
      [16.50, 114.20], // 南海深水主航道 (西沙以東深水槽，水深 >2000m，徹底避開越南陸地)
      [11.50, 111.50], // 越南外海百浬深水區
      [6.00, 107.50],  // 納土納群島以西
      [1.35, 104.30],  // 新加坡海峽東口
      [1.25, 103.75],  // 新加坡港 (PSA Hub)
      [1.43, 103.10],  // 馬六甲海峽主航道 TSS
      [3.00, 100.50],  // 馬六甲中段
      [5.50, 96.00],   // 蘇門答臘西北韋島外海
      [5.80, 80.50],   // 斯里蘭卡南端 (Dondra Head 深水航道)
      [7.50, 75.00],   // 印度洋中央通道
      [9.50, 72.00],   // 八度海峽安全走廊 (Eight Degree Channel)
      [12.50, 52.00],  // 索科特拉島北側 (Socotra Channel)
      [12.00, 46.50],  // 亞丁灣國際推薦安全走廊 (IRTC)
      [12.58, 43.33],  // 曼德海峽 TSS 分道通航制
      [17.00, 41.50],  // 紅海中央深水航槽
      [22.00, 38.00],  // 紅海中段
      [27.50, 34.50],  // 蒂朗海峽西南外海
      [30.58, 32.55],  // 蘇伊士運河 (Suez Canal)
      [32.00, 31.50],  // 地中海塞得港外海
      [34.50, 24.50],  // 地中海中央航道 (克里特島南側)
      [36.50, 15.00],  // 西西里海峽深槽
      [37.20, 8.50],   // 突尼斯以北海域
      [36.50, 0.00],   // 西地中海
      [35.96, -5.60],  // 直布羅陀海峽 TSS (Strait of Gibraltar)
      [37.00, -9.50],  // 聖文森角 (葡萄牙西南深水區)
      [44.00, -9.50],  // 比斯開灣外緣
      [48.50, -5.50],  // 烏埃尚島 (Ushant TSS)
      [50.00, -1.00],  // 英吉利海峽中央航道
      [51.10, 1.45],   // 多佛海峽 TSS (Strait of Dover)
      [51.90, 4.30]    // 鹿特丹港 (Port of Rotterdam)
    ];
    L.polyline(asiaEuropeRoute, {
      color: '#ff9900',
      weight: 3.2,
      opacity: 0.85,
      dashArray: '8, 5',
      className: 'flow-active-europe'
    }).addTo(this.map).bindTooltip('亞歐蘇伊士直達幹線 (Suez Mainline - 經台灣海峽、南海、馬六甲與紅海)', { className: 'ecdis-map-tooltip' });

    // 2. 好望角繞道動脈 (Cape of Good Hope Bypass - 紅海危機替代大動脈)
    const capeBypassRoute = [
      [1.25, 103.75],   // 新加坡
      [-1.00, 103.50],
      [-5.80, 105.80],  // 巽他海峽出口 / 印度洋南道
      [-10.00, 95.00],  // 東印度洋深海
      [-18.00, 80.00],  // 南印度洋盛行西風走廊
      [-28.00, 55.00],  // 馬達加斯加東南深海
      [-34.00, 32.00],  // 厄加勒斯洋流槽 (Agulhas Current)
      [-35.00, 24.00],  // 厄加勒斯角外海深水
      [-34.35, 18.47],  // 好望角 (Cape of Good Hope TSS)
      [-30.00, 14.00],  // 南大西洋本格拉洋流深水帶
      [-15.00, 2.00],   // 聖赫勒拿島海域
      [0.00, -12.00],   // 赤道幾內亞灣西側大洋
      [15.00, -20.00],  // 維德角群島西側
      [30.00, -18.00],  // 加那利群島西側
      [36.00, -10.00],  // 葡萄牙外海 (連通直布羅陀/北歐走廊)
      [44.00, -9.50],
      [48.50, -5.50],
      [51.10, 1.45],   // 多佛海峽
      [51.90, 4.30]    // 鹿特丹/漢堡
    ];
    L.polyline(capeBypassRoute, {
      color: '#ffd700',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '12, 6',
      className: 'flow-active-vlcc'
    }).addTo(this.map).bindTooltip('好望角繞道終極動脈 (紅海危機全球貨櫃船替代航線 · 繞行非洲)', { className: 'ecdis-map-tooltip' });

    // 3. 波斯灣至東亞原油動脈 (Persian Gulf to East Asia)
    const pgToAsiaRoute = [
      [27.00, 50.00],   // 沙烏地拉斯塔努拉 / 達曼
      [26.40, 53.50],   // 波斯灣深槽
      [26.56, 56.25],   // 荷姆茲海峽 TSS
      [24.50, 58.50],   // 阿曼灣深海
      [18.00, 68.00],   // 阿拉伯海中央走廊
      [9.50, 73.00],    // 八度海峽
      [5.80, 80.50],    // 斯里蘭卡南端
      [5.50, 96.00],    // 蘇門答臘西北外海
      [3.00, 100.50],
      [1.43, 103.10],   // 馬六甲海峽
      [1.35, 104.30],   // 新加坡海峽東口
      [6.00, 107.50],
      [11.50, 111.50],  // 南海深水航道
      [16.50, 114.20],
      [22.30, 114.20],  // 香港
      [24.50, 119.80],  // 台灣海峽 (Taiwan Strait)
      [31.20, 121.50],  // 上海/寧波
      [34.50, 138.00]   // 日本東京灣
    ];
    L.polyline(pgToAsiaRoute, {
      color: '#00ff88',
      weight: 3.8,
      opacity: 0.9,
      dashArray: '10, 5',
      className: 'flow-active-fareast'
    }).addTo(this.map).bindTooltip('波斯灣-東亞原油與 LNG 戰略動脈 (承載東亞 75% 進口原油)', { className: 'ecdis-map-tooltip' });

    // 4. 巴拿馬兩洋航線 (Panama Canal Mainline - 美東/美灣至美西太平洋)
    const panamaRoute = [
      [40.70, -74.00],  // 紐約港 (Port of New York)
      [32.00, -75.00],  // 查爾斯頓外海
      [25.00, -78.00],  // 巴哈馬西北水道 (大西洋深水)
      [18.00, -76.00],  // 牙買加深海海盆
      [9.35, -79.90],   // 巴拿馬運河大西洋端 (Colon / Cristobal)
      [8.95, -79.55],   // 巴拿馬運河太平洋端 (Balboa)
      [7.00, -82.00],   // 太平洋進出口
      [12.00, -95.00],  // 中美洲太平洋深水航槽
      [18.00, -107.00], // 墨西哥外海
      [26.00, -116.00], // 下加利福尼亞深海走廊
      [33.70, -118.20]  // 洛杉磯/長灘港 (Port of Los Angeles / Long Beach)
    ];
    L.polyline(panamaRoute, {
      color: '#00d2ff',
      weight: 3.0,
      opacity: 0.85,
      dashArray: '8, 6',
      className: 'flow-active-feeder'
    }).addTo(this.map).bindTooltip('巴拿馬兩洋幹線 (美國穀物、化學品與貨櫃大動脈 · 紐約—巴拿馬—洛杉磯)', { className: 'ecdis-map-tooltip' });

    // 5. 跨太平洋遠洋大圓航線 (Transpacific Great Circle - 遠東至北美西岸)
    const transpacificAsiaRoute = [
      [24.50, 119.80],  // 台灣海峽
      [31.20, 121.50],  // 上海
      [35.00, 140.00],  // 東京灣
      [40.00, 150.00],  // 津輕外海大圓動脈
      [45.00, 165.00],  // 北太平洋西風帶深水走廊
      [48.00, 178.00]   // 接近國際換日線深海
    ];
    L.polyline(transpacificAsiaRoute, {
      color: '#a855f7',
      weight: 2.8,
      opacity: 0.8,
      dashArray: '6, 6',
      className: 'flow-active-fareast'
    }).addTo(this.map).bindTooltip('跨太平洋北線大圓航道 (亞洲—美西貨櫃動脈)', { className: 'ecdis-map-tooltip' });
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
