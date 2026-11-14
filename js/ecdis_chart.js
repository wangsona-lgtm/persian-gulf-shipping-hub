/**
 * 专业级 ECDIS 數位海圖引擎 (Professional Leaflet ECDIS GIS Chart Engine)
 * 整合真實 GIS 經緯度投影、國際暗夜海圖圖層 (CartoDB Dark Matter / Esri Ocean / OpenSeaMap)、
 * 荷姆茲海峽 IMO 分道通航制 (TSS) 真實航道多邊形、12 大樞紐港口雷達脈動與動態航線光流
 */

class ECDISChart {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
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

    this.map = null;
    this.portMarkers = {};
    this.laneLayers = {};
    this.tssLayers = [];

    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // 清空舊容器內容並重構 DOM 結構
    container.innerHTML = `
      <div class="ecdis-map-wrapper">
        <div id="ecdisLeafletMap" class="ecdis-leaflet-canvas"></div>
        
        <!-- ECDIS 浮動控制面板 -->
        <div class="ecdis-floating-hud">
          <div class="hud-tag">
            <span class="live-dot" style="width:6px; height:6px;"></span>
            <span>IMO ECDIS S-52 · WGS-84</span>
          </div>
          <div class="hud-latlon" id="ecdisCursorCoord">LAT: 26°00'N | LON: 53°30'E</div>
          <div class="hud-basemap-select">
            <select id="ecdisBasemapSelector" class="basemap-dropdown">
              <option value="dark">戰術暗夜海圖 (Tactical Dark)</option>
              <option value="ocean">深海等深水圖 (Esri Ocean)</option>
              <option value="satellite">高解析衛星遙測 (Satellite)</option>
            </select>
          </div>
        </div>

        <!-- 羅經盤 (Compass Rose) -->
        <div class="ecdis-compass-rose">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" stroke-dasharray="3, 3" />
            <polygon points="50,10 55,50 50,45" fill="#f43f5e" />
            <polygon points="50,10 45,50 50,45" fill="#fb7185" />
            <polygon points="50,90 55,50 50,55" fill="#64748b" />
            <polygon points="50,90 45,50 50,55" fill="#94a3b8" />
            <circle cx="50" cy="50" r="4" fill="#38bdf8" />
            <text x="50" y="8" fill="#f43f5e" font-size="10" font-weight="900" text-anchor="middle">N</text>
          </svg>
        </div>
      </div>
    `;

    // 檢查 Leaflet 庫
    if (typeof L === 'undefined') {
      console.error('Leaflet library is not loaded!');
      return;
    }

    // 初始化 Leaflet 地圖，中心對準波斯灣中心點 [26.0, 53.5]，Zoom 7
    this.map = L.map('ecdisLeafletMap', {
      center: [26.1, 53.6],
      zoom: 7,
      minZoom: 5,
      maxZoom: 14,
      zoomControl: true,
      attributionControl: false
    });

    // 定義三大底圖圖層
    this.baseLayers = {
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }),
      ocean: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 13
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      })
    };

    // 預設載入暗夜戰術海圖
    this.baseLayers.dark.addTo(this.map);

    // 疊加 OpenSeaMap 國際海事航標圖層 (提供燈塔、浮標與航道標記)
    this.seamarkLayer = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      maxZoom: 18,
      opacity: 0.85
    }).addTo(this.map);

    // 監聽經緯度游標移動
    this.map.on('mousemove', (e) => {
      const coordEl = document.getElementById('ecdisCursorCoord');
      if (coordEl) {
        const lat = e.latlng.lat.toFixed(3);
        const lon = e.latlng.lng.toFixed(3);
        coordEl.textContent = `LAT: ${lat}°N | LON: ${lon}°E`;
      }
    });

    // 監聽底圖切換
    const basemapSelect = document.getElementById('ecdisBasemapSelector');
    if (basemapSelect) {
      basemapSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        Object.values(this.baseLayers).forEach(layer => this.map.removeLayer(layer));
        if (this.baseLayers[selected]) {
          this.baseLayers[selected].addTo(this.map);
          this.seamarkLayer.bringToFront();
        }
      });
    }

    // 繪製荷姆茲海峽 TSS 分道通航制
    this.drawHormuzTSS();

    // 繪製五大動態光流航道
    this.drawShippingLanes();

    // 繪製 12 大樞紐港口
    this.drawPortMarkers();

    // 預設選中 Jebel Ali 港
    this.selectPort("jebel_ali");
  }

  /**
   * 繪製荷姆茲海峽 IMO 分道通航制 (TSS) 真實幾何
   */
  drawHormuzTSS() {
    // 1. 北行進港分道 (Inbound Westbound Lane - 240°)
    const inboundCoords = [
      [26.42, 56.68],
      [26.58, 56.45],
      [26.68, 56.22],
      [26.62, 55.95]
    ];
    const inboundLine = L.polyline(inboundCoords, {
      color: '#00ff88',
      weight: 4,
      dashArray: '8, 6',
      opacity: 0.9,
      className: 'flow-active-fareast'
    }).addTo(this.map);
    inboundLine.bindTooltip('IMO TSS 北行進港航道 (Inbound 240°)', { permanent: false, className: 'ecdis-map-tooltip' });
    this.tssLayers.push(inboundLine);

    // 2. 中央安全緩衝隔離帶 (Separation Zone)
    const separationPolygon = [
      [26.35, 56.65],
      [26.50, 56.42],
      [26.59, 56.18],
      [26.52, 55.92],
      [26.46, 55.93],
      [26.53, 56.20],
      [26.44, 56.43],
      [26.30, 56.66]
    ];
    const sepZone = L.polygon(separationPolygon, {
      color: '#eab308',
      weight: 1.5,
      fillColor: '#eab308',
      fillOpacity: 0.35,
      dashArray: '4, 4'
    }).addTo(this.map);
    sepZone.bindTooltip('TSS 中央安全隔離緩衝帶 (非航行區)', { permanent: false, className: 'ecdis-map-tooltip' });
    this.tssLayers.push(sepZone);

    // 3. 南行出港分道 (Outbound Eastbound Lane - 060°)
    const outboundCoords = [
      [26.40, 55.90],
      [26.47, 56.17],
      [26.38, 56.40],
      [26.22, 56.62]
    ];
    const outboundLine = L.polyline(outboundCoords, {
      color: '#ffd700',
      weight: 4,
      dashArray: '8, 6',
      opacity: 0.9,
      className: 'flow-active-vlcc'
    }).addTo(this.map);
    outboundLine.bindTooltip('IMO TSS 南行出港航道 (Outbound 060° - VLCC 原油動脈)', { permanent: false, className: 'ecdis-map-tooltip' });
    this.tssLayers.push(outboundLine);

    // 4. 深水航道註記 (Deep Water Route - Draft > 20m)
    const dwrCoords = [
      [26.70, 56.15],
      [26.55, 56.38],
      [26.30, 56.62]
    ];
    const dwrLine = L.polyline(dwrCoords, {
      color: '#38bdf8',
      weight: 2,
      dashArray: '3, 6',
      opacity: 0.8
    }).addTo(this.map);
    dwrLine.bindTooltip('深水航槽 (DWR - 水深 >80m，供滿載 30萬噸 VLCC 專用)', { permanent: false, className: 'ecdis-map-tooltip' });
    this.tssLayers.push(dwrLine);
  }

  /**
   * 繪製五大動態光流航線 (利用真實地理 GPS 座標)
   */
  drawShippingLanes() {
    // 1. 遠東直達幹線 (Asia Direct: 綠色光流)
    const fareastCoords = [
      [23.5, 59.5], // 阿拉伯海進口
      [24.502, 56.638], // 經蘇哈爾外海
      [25.178, 56.368], // 經富吉拉外海
      [26.42, 56.68], // 荷姆茲進港 TSS
      [26.68, 56.22],
      [26.62, 55.95],
      [24.985, 55.027], // Jebel Ali (杜拜)
      [24.862, 54.654], // Khalifa Port (阿布達比)
      [25.5, 52.8],
      [26.495, 50.145], // Dammam (達曼)
      [27.025, 49.658]  // Jubail (朱拜勒)
    ];
    this.laneLayers['lane_fareast'] = L.polyline(fareastCoords, {
      color: '#00ff88',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '12, 6',
      className: 'flow-active-fareast'
    }).addTo(this.map).bindTooltip('遠東直達幹線 (Asia Direct Mainline)', { className: 'ecdis-map-tooltip' });

    // 2. 歐洲/地中海幹線 (Europe/Med: 橘色光流)
    const europeCoords = [
      [23.0, 58.5],
      [24.2, 57.2],
      [25.178, 56.368], // 富吉拉
      [26.42, 56.68],
      [26.62, 55.95],
      [24.985, 55.027], // Jebel Ali
      [25.018, 51.615], // Hamad Port (卡達)
      [26.495, 50.145]  // Dammam
    ];
    this.laneLayers['lane_europe'] = L.polyline(europeCoords, {
      color: '#ff9900',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '10, 5',
      className: 'flow-active-europe'
    }).addTo(this.map).bindTooltip('歐洲/地中海幹線 (Europe/Med Mainline)', { className: 'ecdis-map-tooltip' });

    // 3. VLCC 原油與 LNG 出口動脈 (Crude & Gas Export: 金黃色光流)
    const vlccCoords = [
      [30.038, 47.948], // 伊拉克巴士拉/烏姆蓋斯爾出港
      [28.5, 49.5],
      [27.025, 49.658], // 朱拜勒 / 拉斯塔努拉
      [25.912, 51.583], // 卡達拉斯拉凡 LNG 出口
      [26.2, 53.5], // 波斯灣中央深槽
      [26.40, 55.90], // 荷姆茲出港 TSS
      [26.22, 56.62],
      [25.178, 56.368], // 富吉拉外海
      [24.0, 57.8],
      [23.0, 59.8] // 駛向印度洋與東亞
    ];
    this.laneLayers['lane_vlcc'] = L.polyline(vlccCoords, {
      color: '#ffd700',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '14, 7',
      className: 'flow-active-vlcc'
    }).addTo(this.map).bindTooltip('VLCC 原油與卡達 LNG 超級出口動脈', { className: 'ecdis-map-tooltip' });

    // 4. 灣內支線駁運 (Regional Feeders: 青藍色虛線)
    const feederBranches = [
      // Jebel Ali -> Shuwaikh (科威特)
      [[24.985, 55.027], [26.0, 53.0], [27.5, 50.5], [29.355, 47.925]],
      // Jebel Ali -> Umm Qasr (伊拉克)
      [[24.985, 55.027], [26.5, 52.0], [28.5, 49.5], [30.038, 47.948]],
      // Jebel Ali -> Bahrain
      [[24.985, 55.027], [25.5, 53.0], [26.208, 50.697]],
      // Jebel Ali -> Hamad (卡達)
      [[24.985, 55.027], [25.018, 51.615]]
    ];
    const feederGroup = L.featureGroup();
    feederBranches.forEach(branch => {
      L.polyline(branch, {
        color: '#00d2ff',
        weight: 2.2,
        dashArray: '6, 6',
        opacity: 0.8,
        className: 'flow-active-feeder'
      }).addTo(feederGroup);
    });
    feederGroup.addTo(this.map);
    this.laneLayers['lane_feeder'] = feederGroup;

    // 5. 阿聯酋哈布善—富吉拉陸上繞道油管 (ADCOP: 紫色高光實線)
    const adcopCoords = [
      [23.75, 53.75], // 阿布達比內陸 Habshan 油田基地
      [24.2, 54.5],
      [24.6, 55.4],
      [25.0, 56.0], // 穿越哈賈爾山脈
      [25.178, 56.368] // 抵達荷姆茲海峽外之富吉拉港 (Port of Fujairah)
    ];
    this.laneLayers['lane_adcop'] = L.polyline(adcopCoords, {
      color: '#d946ef',
      weight: 4.5,
      opacity: 1.0,
      className: 'flow-active-adcop'
    }).addTo(this.map).bindTooltip('阿聯酋 ADCOP 陸上輸油管 (繞過荷姆茲海峽直通富吉拉港)', { className: 'ecdis-map-tooltip' });
  }

  /**
   * 繪製 12 大樞紐港口雷達脈動標記
   */
  drawPortMarkers() {
    if (!window.PORTS_DATA) return;

    window.PORTS_DATA.forEach(port => {
      const lat = port.coords.lat;
      const lon = port.coords.lon;

      // 建立高科技雷達標記 HTML
      const isLng = port.type === 'energy_lng';
      const nodeColor = isLng ? '#ffd700' : '#0ea5e9';
      const radarColor = isLng ? 'rgba(255, 215, 0, 0.4)' : 'rgba(14, 165, 233, 0.4)';

      const markerHtml = `
        <div class="leaflet-port-radar-marker" id="marker_dom_${port.id}">
          <div class="radar-pulse" style="background:${radarColor};"></div>
          <div class="radar-core" style="background:${nodeColor};"></div>
          <div class="radar-label">${port.nameZh.split('（')[0]}</div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'leaflet-custom-port-icon',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);

      // 點擊事件
      marker.on('click', () => {
        this.selectPort(port.id);
        if (typeof this.options.onPortSelect === 'function') {
          this.options.onPortSelect(port);
        }
      });

      // Hover Tooltip
      marker.bindTooltip(`
        <div style="font-size:12px; font-weight:bold; color:#38bdf8;">⚓ ${port.nameZh}</div>
        <div style="font-size:10px; color:#cbd5e1;">吞吐量: ${port.throughput}</div>
        <div style="font-size:10px; color:#cbd5e1;">水深: ${port.depth} · ${port.countryZh}</div>
      `, { className: 'ecdis-map-tooltip', direction: 'top' });

      this.portMarkers[port.id] = marker;
    });
  }

  /**
   * 選中指定港口
   */
  selectPort(portId) {
    this.activePortId = portId;
    const port = window.PORTS_DATA.find(p => p.id === portId);
    if (!port) return;

    // 平滑聚焦至該港口中心（保持良好視野，不 zoom 過深）
    this.map.panTo([port.coords.lat, port.coords.lon], { animate: true, duration: 0.8 });

    // 更新 DOM Active 樣式
    document.querySelectorAll('.leaflet-port-radar-marker').forEach(el => el.classList.remove('active'));
    const targetDom = document.getElementById(`marker_dom_${portId}`);
    if (targetDom) targetDom.classList.add('active');

    // 觸發外部面板回調
    if (typeof this.options.onPortSelect === 'function') {
      this.options.onPortSelect(port);
    }
  }

  /**
   * 航商專屬航線高亮連動
   */
  highlightCarrier(carrierId) {
    this.activeCarrierId = carrierId;
    const companies = window.SHIPPING_COMPANIES;
    const ports = window.PORTS_DATA;

    if (carrierId === 'all') {
      // 恢復全部正常顯示
      Object.values(this.laneLayers).forEach(layer => {
        if (layer.setStyle) layer.setStyle({ opacity: 0.85, weight: 3.5 });
      });
      document.querySelectorAll('.leaflet-port-radar-marker').forEach(el => {
        el.style.opacity = '1.0';
      });
      return;
    }

    const carrier = companies.find(c => c.id === carrierId);
    if (!carrier) return;

    let targetLanes = [];
    if (carrier.group === 'container') targetLanes = ['lane_fareast', 'lane_europe'];
    else if (carrier.group === 'tanker_vlcc') targetLanes = ['lane_vlcc', 'lane_adcop'];
    else if (carrier.group === 'lng_gas') targetLanes = ['lane_vlcc'];
    else if (carrier.group === 'regional_feeder') targetLanes = ['lane_feeder'];

    // 調整航線透明度
    Object.keys(this.laneLayers).forEach(laneKey => {
      const layer = this.laneLayers[laneKey];
      if (!layer) return;
      const isTarget = targetLanes.includes(laneKey);
      if (layer.setStyle) {
        layer.setStyle({
          opacity: isTarget ? 1.0 : 0.15,
          weight: isTarget ? 5.5 : 2.0
        });
      }
    });

    // 高亮該船商掛靠之港口
    ports.forEach(p => {
      const markerDom = document.getElementById(`marker_dom_${p.id}`);
      if (!markerDom) return;
      if (carrier.corePorts.includes(p.id)) {
        markerDom.style.opacity = '1.0';
        markerDom.querySelector('.radar-core').style.background = carrier.color;
        markerDom.querySelector('.radar-pulse').style.background = carrier.color;
      } else {
        markerDom.style.opacity = '0.2';
      }
    });
  }

  /**
   * 單一航線切換顯示/隱藏
   */
  toggleLane(laneId, isVisible) {
    this.visibleLanes[laneId] = isVisible;
    const layer = this.laneLayers[laneId];
    if (!layer) return;
    if (isVisible) {
      this.map.addLayer(layer);
    } else {
      this.map.removeLayer(layer);
    }
  }
}

window.ECDISChart = ECDISChart;
