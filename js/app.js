/**
 * 波斯灣航運與地緣戰情觀測站主控制器 (App Main Controller)
 * 負責分頁調度、海圖與股票連動、即時篩選與數據矩陣渲染
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化 ECDIS 數位海圖
  const chart = new ECDISChart('ecdisChartContainer', {
    onPortSelect: (port) => {
      renderPortDossier(port);
    }
  });

  // 2. 初始化頂部導航分頁 (Tab Switching)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // 如果切換回海圖分頁，重整地圖尺寸
      if (targetTab === 'tab-ecdis') {
        window.dispatchEvent(new Event('resize'));
      }
    });
  });

  // 3. 航道切換 Checkbox 事件綁定
  const laneCheckboxes = document.querySelectorAll('.lane-toggle-cb');
  laneCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const laneId = e.target.getAttribute('data-lane-id');
      chart.toggleLane(laneId, e.target.checked);
    });
  });

  // 4. 船商快速高亮選擇器事件綁定
  const carrierPills = document.querySelectorAll('.carrier-chip-btn');
  carrierPills.forEach(pill => {
    pill.addEventListener('click', () => {
      carrierPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const carrierId = pill.getAttribute('data-carrier-id');
      chart.highlightCarrier(carrierId);
      updateCarrierNotice(carrierId);
    });
  });

  // 5. 渲染各模組數據
  renderKpiSummary();
  renderStocksSection();
  renderDirectorySection();
  renderPortsMatrixSection();
  renderGeopoliticsSection();

  // 6. 註冊全局「股票連動海圖」按鈕功能
  window.syncStockToChart = function(carrierId, portId) {
    // 切換至海圖分頁
    const ecdisTabBtn = document.querySelector('.tab-btn[data-tab="tab-ecdis"]');
    if (ecdisTabBtn) ecdisTabBtn.click();

    // 觸發航商高亮
    if (carrierId) {
      const targetPill = document.querySelector(`.carrier-chip-btn[data-carrier-id="${carrierId}"]`);
      if (targetPill) {
        carrierPills.forEach(p => p.classList.remove('active'));
        targetPill.classList.add('active');
      }
      chart.highlightCarrier(carrierId);
      updateCarrierNotice(carrierId);
    }

    // 若有指定港口，選中該港口
    if (portId) {
      chart.selectPort(portId);
    }

    // 平滑滾動到海圖頂端
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

/**
 * 渲染右側港口卡片 (Port Dossier Panel)
 */
function renderPortDossier(port) {
  const panel = document.getElementById('portDossierPanel');
  if (!panel || !port) return;

  const carrierTagsHtml = port.carriers.map(c => `<span class="carrier-tag">${c}</span>`).join('');
  const terminalsHtml = port.keyTerminals.map(t => `<li style="margin-bottom:4px; color:#cbd5e1;">${t}</li>`).join('');

  panel.innerHTML = `
    <div class="port-dossier-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <span class="dossier-badge">${port.categoryZh}</span>
        <span style="font-family:monospace; font-size:11px; color:#94a3b8;">${port.depth} 水深</span>
      </div>
      <h2 class="dossier-name-zh">⚓ ${port.nameZh}</h2>
      <div class="dossier-name-en">${port.nameEn} · ${port.code} · ${port.countryZh}</div>
      
      <div class="dossier-stats-grid">
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">年吞吐量 / 貨量</div>
          <div class="dossier-stat-val">${port.throughput}</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">最大靠泊吃水</div>
          <div class="dossier-stat-val">${port.depth}</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">泊位與設施</div>
          <div class="dossier-stat-val">${port.berths}</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">碼頭營運商</div>
          <div class="dossier-stat-val" style="font-size:11px;">${port.operator.split('（')[0]}</div>
        </div>
      </div>

      <div class="dossier-section-title">🚢 核心掛靠船商</div>
      <div class="dossier-carriers-tags">${carrierTagsHtml}</div>

      <div class="dossier-section-title">🏗️ 專用樞紐設施</div>
      <ul style="margin: 0 0 12px 18px; font-size:11px;">${terminalsHtml}</ul>

      <div class="dossier-section-title">🌐 地緣戰略地位與航道特性</div>
      <div class="dossier-role-text">${port.strategicRole}</div>

      <div style="margin-top:12px; font-size:11px; color:#94a3b8; display:flex; justify-content:space-between;">
        <span>📍 <strong>TSS 距離:</strong> ${port.tssDistance}</span>
        <span style="color:#f43f5e;">⚠️ <strong>風險評級:</strong> ${port.riskRating.split('（')[0]}</span>
      </div>
    </div>
  `;
}

/**
 * 更新航商高亮提示 Banner
 */
function updateCarrierNotice(carrierId) {
  const noticeBox = document.getElementById('carrierNoticeBox');
  if (!noticeBox) return;

  if (carrierId === 'all') {
    noticeBox.style.display = 'none';
    return;
  }

  const carrier = window.SHIPPING_COMPANIES.find(c => c.id === carrierId);
  if (!carrier) return;

  const portsStr = carrier.corePorts.map(pid => {
    const p = window.PORTS_DATA.find(x => x.id === pid);
    return p ? p.nameZh.split('（')[0] : pid;
  }).join('、');

  noticeBox.style.display = 'block';
  noticeBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="color:${carrier.color}; font-size:13px;">🚢 ${carrier.nameZh} (${carrier.nameEn})</strong>
        <span style="margin-left:8px; font-size:11px; color:#cbd5e1;">聯盟: ${carrier.alliance}</span>
        <span style="margin-left:8px; font-size:11px; color:#38bdf8;">波斯灣主力停靠港: ${portsStr}</span>
      </div>
      <span style="font-size:11px; color:#94a3b8;">股票: <strong>${carrier.stockTicker}</strong></span>
    </div>
  `;
}

/**
 * 渲染頂部 KPI 跑馬卡片
 */
function renderKpiSummary() {
  const container = document.getElementById('kpiTickerContainer');
  if (!container || !window.GEOPOLITICS_DATA) return;

  const indicators = window.GEOPOLITICS_DATA.marketIndicators;
  container.innerHTML = indicators.map(ind => `
    <div class="kpi-ticker-card">
      <div class="kpi-label">${ind.name}</div>
      <div class="kpi-val">${ind.value}</div>
      <div class="kpi-sub">${ind.sub}</div>
    </div>
  `).join('');
}

/**
 * 渲染「航運股票終端」分頁
 */
function renderStocksSection() {
  const grid = document.getElementById('stocksGrid');
  const tableBody = document.getElementById('stocksTableBody');
  if (!grid || !window.SHIPPING_STOCKS) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function filterAndDisplay() {
    let list = window.SHIPPING_STOCKS;

    if (currentCategory !== 'all') {
      if (currentCategory === 'taiwan') {
        list = list.filter(s => s.countryZh === '台灣');
      } else if (currentCategory === 'container') {
        list = list.filter(s => s.sector === 'container');
      } else if (currentCategory === 'tanker_vlcc') {
        list = list.filter(s => s.sector === 'tanker_vlcc');
      } else if (currentCategory === 'lng_gas') {
        list = list.filter(s => s.sector === 'lng_gas');
      } else if (currentCategory === 'regional_feeder') {
        list = list.filter(s => s.sector === 'regional_feeder');
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.nameZh.toLowerCase().includes(q) || 
        s.ticker.toLowerCase().includes(q) || 
        s.nameEn.toLowerCase().includes(q) ||
        s.countryZh.toLowerCase().includes(q)
      );
    }

    // 渲染卡片網格
    grid.innerHTML = list.map(stock => {
      const isUp = stock.changePct >= 0;
      const chgClass = isUp ? 'up' : 'down';
      const chgSign = isUp ? '+' : '';

      return `
        <div class="stock-card">
          <div class="stock-card-header">
            <div class="stock-title-group">
              <h3>${stock.nameZh} <span style="font-size:12px; color:#94a3b8;">${stock.countryZh}</span></h3>
              <div class="stock-sub-ticker">${stock.ticker} · ${stock.exchange}</div>
            </div>
            <div class="stock-price-block">
              <div class="stock-price">${stock.price} <span style="font-size:11px; font-weight:normal; color:#94a3b8;">${stock.currency}</span></div>
              <div class="stock-chg ${chgClass}">${chgSign}${stock.changePct}%</div>
            </div>
          </div>

          <div class="stock-metrics-row">
            <div class="metric-item">
              <span class="metric-lbl">本益比 P/E</span>
              <span class="metric-val">${stock.peRatio}x</span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">股息殖利率</span>
              <span class="metric-val" style="color:#10b981;">${stock.dividendYield}</span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">地緣敏感情境</span>
              <span class="metric-val" style="color:#f43f5e;">${stock.geopoliticalIndex}/100</span>
            </div>
          </div>

          <div class="stock-gulf-exposure">
            <div>🚢 <strong>波斯灣運力/業務佔比:</strong> <span class="gulf-share-highlight">${stock.gulfSharePct}</span></div>
            <div style="margin-top:2px; color:#cbd5e1;">航線與掛靠: ${stock.gulfLoops}</div>
          </div>

          <div class="stock-chips-panel">
            <div class="chips-line"><span>外資動向:</span> <strong>${stock.chipAnalysis.foreignBias}</strong></div>
            <div class="chips-line"><span>主力籌碼:</span> <strong style="color:#38bdf8;">${stock.chipAnalysis.chipSignal}</strong></div>
            <div class="chips-line"><span>法人評級:</span> <strong style="color:#f59e0b;">${stock.chipAnalysis.rating}</strong></div>
          </div>

          <div class="stock-card-footer">
            <button class="btn-highlight-route" onclick="syncStockToChart('${mapStockToCarrier(stock.id)}', '${stock.gulfPorts[0]}')">
              🗺️ 連動海圖高亮專屬航線
            </button>
          </div>
        </div>
      `;
    }).join('');

    // 渲染比較大表
    if (tableBody) {
      tableBody.innerHTML = list.map(s => `
        <tr>
          <td><strong>${s.ticker}</strong></td>
          <td><strong>${s.nameZh}</strong><br><span style="font-size:10px; color:#94a3b8;">${s.nameEn}</span></td>
          <td>${s.countryZh}</td>
          <td><span class="carrier-tag">${s.sectorZh}</span></td>
          <td><strong style="font-family:monospace; color:#fff;">${s.price} ${s.currency}</strong></td>
          <td class="stock-chg ${s.changePct >= 0 ? 'up' : 'down'}">${s.changePct >= 0 ? '+' : ''}${s.changePct}%</td>
          <td>${s.peRatio}x</td>
          <td style="color:#10b981; font-weight:700;">${s.dividendYield}</td>
          <td><strong style="color:#38bdf8;">${s.gulfSharePct}</strong></td>
          <td>${s.chipAnalysis.chipSignal}</td>
          <td>
            <button class="btn-highlight-route" style="padding:3px 8px; font-size:10px;" onclick="syncStockToChart('${mapStockToCarrier(s.id)}', '${s.gulfPorts[0]}')">
              連動海圖
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 分類 Pill 切換
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      filterAndDisplay();
    });
  });

  // 搜尋框輸入監聽
  const searchInput = document.getElementById('stockSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndDisplay();
    });
  }

  filterAndDisplay();
}

/**
 * 股票 ID 與海圖船商 ID 映射
 */
function mapStockToCarrier(stockId) {
  const map = {
    "2603": "evergreen",
    "2615": "wan_hai",
    "2609": "yang_ming",
    "2605": "frontline", // 租入油輪聯營池，以原油航線高亮
    "2606": "wan_hai",
    "maersk_stock": "maersk",
    "hapag_stock": "hapag_lloyd",
    "cosco_stock": "cosco",
    "hmm_stock": "hmm",
    "mol_stock": "one",
    "frontline_stock": "frontline",
    "dht_stock": "dht",
    "cmbt_stock": "euronav",
    "bahri_stock": "bahri",
    "adnocls_stock": "adnoc_ls",
    "nakilat_stock": "nakilat",
    "bwlp_stock": "bw_group",
    "milaha_stock": "milaha",
    "adports_stock": "adnoc_ls"
  };
  return map[stockId] || "all";
}

/**
 * 渲染「船運公司名錄」分頁 (Shipping Directory)
 */
function renderDirectorySection() {
  const container = document.getElementById('shippingDirectoryContainer');
  if (!container || !window.SHIPPING_COMPANIES) return;

  const groups = [
    { key: "container", title: "一、全球貨櫃海運巨頭（Container Carriers）" },
    { key: "tanker_vlcc", title: "二、超大型原油輪與能源海運（VLCC & Tanker Operators）" },
    { key: "lng_gas", title: "三、液化天然氣與特殊氣體船隊（LNG / LPG Carriers）" },
    { key: "regional_feeder", title: "四、中東本土與灣內支線駁運商（Regional & Feeder Lines）" }
  ];

  let html = '';
  groups.forEach(g => {
    const list = window.SHIPPING_COMPANIES.filter(c => c.group === g.key);
    html += `
      <div class="carrier-category-section">
        <div class="carrier-category-header">
          <h2>${g.title}</h2>
          <span style="font-size:12px; color:#94a3b8;">(${list.length} 家核心航商)</span>
        </div>
        <div class="directory-grid">
          ${list.map(c => `
            <div class="directory-card" style="border-top: 3px solid ${c.color};">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h3>${c.nameZh}</h3>
                <span style="font-size:11px; color:#94a3b8; font-family:monospace;">${c.country}</span>
              </div>
              <div style="font-size:12px; color:#94a3b8; font-family:monospace; margin-bottom:6px;">${c.nameEn}</div>
              <span class="dir-alliance-badge">${c.alliance}</span>

              <div class="dir-meta-row"><strong>船隊規模:</strong> ${c.fleetShips} (${c.fleetTeu})</div>
              <div class="dir-meta-row"><strong>波斯灣服務航線:</strong> ${c.loops.join(', ')}</div>
              <div class="dir-meta-row"><strong>股票關聯:</strong> <span style="color:#38bdf8;">${c.stockTicker}</span></div>

              <div class="dir-desc">${c.description}</div>

              <div style="margin-top:auto; padding-top:14px;">
                <button class="btn-highlight-route" onclick="syncStockToChart('${c.id}', '${c.corePorts[0]}')">
                  🗺️ 在海圖上高亮該航商路徑與停靠港
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * 渲染 12 大樞紐港口全覽矩陣
 */
function renderPortsMatrixSection() {
  const container = document.getElementById('portsMatrixContainer');
  if (!container || !window.PORTS_DATA) return;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:18px;">
      ${window.PORTS_DATA.map(p => `
        <div class="directory-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="dossier-badge">${p.categoryZh}</span>
            <span style="font-family:monospace; font-size:11px; color:#38bdf8;">吃水: ${p.depth}</span>
          </div>
          <h3 style="font-size:17px;">⚓ ${p.nameZh}</h3>
          <div style="font-size:11px; color:#94a3b8; font-family:monospace; margin-bottom:12px;">${p.nameEn} · ${p.code}</div>
          
          <div class="dir-meta-row"><strong>國家:</strong> ${p.countryZh}</div>
          <div class="dir-meta-row"><strong>年吞吐量:</strong> ${p.throughput}</div>
          <div class="dir-meta-row"><strong>營運商:</strong> ${p.operator}</div>
          <div class="dir-meta-row"><strong>荷姆茲距離:</strong> ${p.tssDistance}</div>

          <div style="margin:8px 0;">
            <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">主要靠泊船商:</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${p.carriers.map(c => `<span class="carrier-tag">${c}</span>`).join('')}
            </div>
          </div>

          <div class="dir-desc" style="background:rgba(10,18,32,0.6); padding:8px; border-radius:6px;">
            ${p.strategicRole}
          </div>

          <div style="margin-top:auto; padding-top:12px;">
            <button class="btn-highlight-route" onclick="syncStockToChart('all', '${p.id}')">
              🗺️ 在數位海圖中聚焦此港口
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 渲染地緣戰略戰情分析模組
 */
function renderGeopoliticsSection() {
  const container = document.getElementById('geopoliticsContainer');
  if (!container || !window.GEOPOLITICS_DATA) return;

  const data = window.GEOPOLITICS_DATA;
  container.innerHTML = `
    <div style="margin-bottom:24px; padding:16px 20px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h3 style="color:#ef4444; font-size:16px; font-weight:800;">⚠️ 波斯灣海域即時防務與航行安全警訊</h3>
        <p style="color:#cbd5e1; font-size:12px; margin-top:2px;">荷姆茲海峽 TSS 通行狀態：常態維持，但聯合海上安全部隊 (CMF) 與波斯灣護航聯盟實施 24 小時雷達戒備。</p>
      </div>
      <div style="display:flex; gap:14px; font-family:monospace; font-size:12px;">
        <span style="color:#ffd700;">原油日流通: <strong>${data.summary.dailyCrudeTransit}</strong></span>
        <span style="color:#38bdf8;">戰險費率 (AWRP): <strong>${data.summary.warRiskPremium}</strong></span>
      </div>
    </div>

    ${data.pillars.map(p => `
      <div class="pillar-card" style="border-left: 4px solid ${p.color};">
        <div class="pillar-header">
          <div class="pillar-title">${p.title}</div>
          <span class="pillar-badge" style="background:${p.color}22; color:${p.color};">${p.badge}</span>
        </div>
        <div class="pillar-highlight-box" style="border-left-color:${p.color};">
          💡 <strong>核心戰略結論：</strong> ${p.highlight}
        </div>
        <div class="pillar-body">
          ${p.content}
        </div>
      </div>
    `).join('')}
  `;
}
