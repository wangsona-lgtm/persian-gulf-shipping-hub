/**
 * 全球航運咽喉與海峽重要性觀測站主控制器 (App Main Controller)
 * 負責分頁調度、波斯灣 ECDIS 與全球航運海圖雙引擎、海峽咽喉比較器與股票連動
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化波斯灣區域 ECDIS 數位海圖
  const ecdisChart = new ECDISChart('ecdisChartContainer', {
    onPortSelect: (port) => {
      renderPortDossier(port);
    }
  });

  // 2. 初始化全球海峽咽喉互動海圖
  const globalMap = new GlobalChokePointMap('globalChokeMapContainer', {
    onPointSelect: (point) => {
      renderChokeDossier(point);
    }
  });

  // 3. 頂部導航分頁 (Tab Switching)
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

      setTimeout(() => {
        if (ecdisChart && ecdisChart.map) ecdisChart.map.invalidateSize();
        if (globalMap && globalMap.map) globalMap.map.invalidateSize();
        window.dispatchEvent(new Event('resize'));
      }, 150);
    });
  });

  // 4. 波斯灣航道切換 Checkbox 事件綁定
  const laneCheckboxes = document.querySelectorAll('.lane-toggle-cb');
  laneCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const laneId = e.target.getAttribute('data-lane-id');
      ecdisChart.toggleLane(laneId, e.target.checked);
    });
  });

  // 5. 船商快速高亮選擇器事件綁定
  const carrierPills = document.querySelectorAll('.carrier-chip-btn');
  carrierPills.forEach(pill => {
    pill.addEventListener('click', () => {
      carrierPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const carrierId = pill.getAttribute('data-carrier-id');
      ecdisChart.highlightCarrier(carrierId);
      updateCarrierNotice(carrierId);
    });
  });

  // 6. 渲染各模組數據
  renderKpiSummary();
  renderChokePointsSection(globalMap);
  renderStocksSection();
  renderFreightSection();
  renderCalculatorSection();
  renderOrderbookSection();
  renderDirectorySection();
  renderPortsMatrixSection();
  renderGeopoliticsSection();

  // 7. 全局「點選股票代號跳轉並篩選」
  window.filterStocksByTicker = function(ticker) {
    const stockTabBtn = document.querySelector('.tab-btn[data-tab="tab-stocks"]');
    if (stockTabBtn) stockTabBtn.click();
    const searchInput = document.getElementById('stockSearchInput');
    if (searchInput) {
      searchInput.value = ticker.split(' ')[0];
      searchInput.dispatchEvent(new Event('input'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 8. 全局「股票連動海圖」按鈕功能
  window.syncStockToChart = function(carrierId, portId) {
    const ecdisTabBtn = document.querySelector('.tab-btn[data-tab="tab-ecdis"]');
    if (ecdisTabBtn) ecdisTabBtn.click();

    if (carrierId) {
      const targetPill = document.querySelector(`.carrier-chip-btn[data-carrier-id="${carrierId}"]`);
      if (targetPill) {
        carrierPills.forEach(p => p.classList.remove('active'));
        targetPill.classList.add('active');
      }
      ecdisChart.highlightCarrier(carrierId);
      updateCarrierNotice(carrierId);
    }

    if (portId) {
      ecdisChart.selectPort(portId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 8. 全局「跳轉特定海峽咽喉」按鈕功能
  window.jumpToChokePoint = function(chokeId) {
    const chokeTabBtn = document.querySelector('.tab-btn[data-tab="tab-chokepoints"]');
    if (chokeTabBtn) chokeTabBtn.click();

    globalMap.selectPoint(chokeId);
    const cp = window.CHOKEPOINTS_DATA.find(x => x.id === chokeId);
    if (cp) renderChokeDossier(cp);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

/**
 * 渲染「全球海峽咽喉比較器」模組 (Choke Points Comparator)
 */
function renderChokePointsSection(globalMap) {
  const rankListContainer = document.getElementById('chokePointsRankList');
  const verdictContainer = document.getElementById('chokeVerdictContainer');
  if (!rankListContainer || !window.CHOKEPOINTS_DATA) return;

  // 渲染四大維度權威裁決專區
  if (verdictContainer && window.CHOKEPOINT_VERDICT_ANALYSIS) {
    const vData = window.CHOKEPOINT_VERDICT_ANALYSIS;
    verdictContainer.innerHTML = `
      <div class="verdict-banner-box">
        <h2 style="font-size:20px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
          <span>⚖️</span> ${vData.title}
        </h2>
        <p style="color:#cbd5e1; font-size:13px; margin-top:4px;">${vData.summary}</p>
        
        <div class="verdict-grid">
          ${vData.dimensions.map(dim => `
            <div class="verdict-item-card">
              <div class="verdict-dimension-title">${dim.dimension}</div>
              <div class="verdict-champion">${dim.champion}</div>
              <div class="verdict-reason">${dim.reason}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 排序狀態
  let currentSort = 'composite';

  function displayRanks() {
    let list = [...window.CHOKEPOINTS_DATA];
    if (currentSort === 'composite') {
      list.sort((a, b) => b.compositeScore - a.compositeScore);
    } else if (currentSort === 'oil') {
      list.sort((a, b) => b.dailyOilNum - a.dailyOilNum);
    } else if (currentSort === 'trade') {
      list.sort((a, b) => b.tradeValueNum - a.tradeValueNum);
    } else if (currentSort === 'substitute') {
      list.sort((a, b) => b.substitutabilityScore - a.substitutabilityScore);
    } else if (currentSort === 'geopolitical') {
      list.sort((a, b) => b.geopoliticalRiskScore - a.geopoliticalRiskScore);
    }

    rankListContainer.innerHTML = list.map((cp, idx) => {
      let badgeClass = 'rank-badge-other';
      if (cp.rank === 1) badgeClass = 'rank-badge-1';
      else if (cp.rank === 2) badgeClass = 'rank-badge-2';
      else if (cp.rank === 3) badgeClass = 'rank-badge-3';

      return `
        <div class="choke-rank-card ${cp.id === globalMap.activePointId ? 'active' : ''}" data-cp-id="${cp.id}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:center;">
              <span class="choke-rank-badge ${badgeClass}">${cp.rank}</span>
              <div>
                <h3 style="font-size:16px; font-weight:800; color:#fff;">${cp.nameZh}</h3>
                <div style="font-size:11px; color:#94a3b8; font-family:var(--font-mono);">${cp.location}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:11px; padding:2px 8px; border-radius:12px; background:rgba(14,165,233,0.15); color:#38bdf8; font-weight:700;">
                綜合評分: ${cp.compositeScore}
              </span>
            </div>
          </div>

          <div style="margin-top:10px; font-size:12px; color:#cbd5e1;">
            <strong>定位：</strong> <span style="color:#00ff88;">${cp.titleCategory}</span>
          </div>

          <!-- 視覺化指標長條 (Comparison Bars) -->
          <div class="choke-metrics-bar-group">
            <div class="metric-bar-item">
              <span style="color:#94a3b8;">原油流通量</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${(cp.dailyOilNum / 21) * 100}%; background:#ffd700;"></div>
              </div>
              <span style="font-family:monospace; color:#ffd700;">${cp.dailyOilVolume.split('（')[0]}</span>
            </div>
            <div class="metric-bar-item">
              <span style="color:#94a3b8;">每日貿易額</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${(cp.tradeValueNum / 95) * 100}%; background:#00ff88;"></div>
              </div>
              <span style="font-family:monospace; color:#00ff88;">$${cp.tradeValueNum}B/日</span>
            </div>
            <div class="metric-bar-item">
              <span style="color:#94a3b8;">不可替代性</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${cp.substitutabilityScore}%; background:#f43f5e;"></div>
              </div>
              <span style="font-family:monospace; color:#f43f5e;">${cp.substitutabilityScore}分</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 點擊卡片切換
    rankListContainer.querySelectorAll('.choke-rank-card').forEach(card => {
      card.addEventListener('click', () => {
        const cpId = card.getAttribute('data-cp-id');
        rankListContainer.querySelectorAll('.choke-rank-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        globalMap.selectPoint(cpId);
        const cp = window.CHOKEPOINTS_DATA.find(x => x.id === cpId);
        if (cp) renderChokeDossier(cp);
      });
    });
  }

  // 排序按鈕監聽
  const sortBtns = document.querySelectorAll('.choke-sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.getAttribute('data-sort');
      displayRanks();
    });
  });

  displayRanks();
  // 預設渲染第一名荷姆茲海峽檔案
  const firstPoint = window.CHOKEPOINTS_DATA.find(x => x.id === 'hormuz');
  if (firstPoint) renderChokeDossier(firstPoint);
}

/**
 * 渲染右側海峽深度檔案面板 (Choke Point Dossier Panel)
 */
function renderChokeDossier(cp) {
  const panel = document.getElementById('chokeDossierPanel');
  if (!panel || !cp) return;

  const stocksHtml = cp.coreAffectedStocks.map(ticker => `
    <span class="carrier-tag" style="cursor:pointer;" onclick="filterStocksByTicker('${ticker}')">${ticker}</span>
  `).join('');

  panel.innerHTML = `
    <div class="port-dossier-card" style="border-top: 3px solid #38bdf8;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="dossier-badge" style="background:rgba(234,179,8,0.2); color:#ffd700;">全球戰略排名 #${cp.rank}</span>
        <span style="font-family:monospace; font-size:12px; color:#38bdf8; font-weight:700;">綜合評分: ${cp.compositeScore}</span>
      </div>

      <h2 class="dossier-name-zh" style="margin-top:6px;">⚔️ ${cp.nameZh}</h2>
      <div class="dossier-name-en">${cp.nameEn} · ${cp.location}</div>

      <div class="dossier-stats-grid">
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">每日原油流通</div>
          <div class="dossier-stat-val" style="color:#ffd700;">${cp.dailyOilVolume.split('（')[0]}</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">每日貿易總額</div>
          <div class="dossier-stat-val" style="color:#00ff88;">$${cp.tradeValueNum} 億美元</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">全球海運噸位比重</div>
          <div class="dossier-stat-val">${cp.globalCargoShare}</div>
        </div>
        <div class="dossier-stat-item">
          <div class="dossier-stat-label">最窄水道寬度</div>
          <div class="dossier-stat-val">${cp.widthNarrowest}</div>
        </div>
      </div>

      <div class="dossier-section-title">📊 替代難易度與代價（不可替代分：${cp.substitutabilityScore}/100）</div>
      <div style="font-size:12px; line-height:1.6; color:#cbd5e1; background:rgba(15,23,42,0.6); padding:8px 10px; border-radius:6px; margin-bottom:10px;">
        ${cp.substitutabilityDesc}
      </div>

      <div class="dossier-section-title">⚠️ 地緣軍事風險（脆弱度評分：${cp.geopoliticalRiskScore}/100）</div>
      <div style="font-size:12px; line-height:1.6; color:#fca5a5; background:rgba(239,68,68,0.1); padding:8px 10px; border-radius:6px; margin-bottom:10px; border-left:3px solid #f43f5e;">
        ${cp.geopoliticalRiskDesc}
      </div>

      <div class="dossier-section-title">🏆 「是否為最重要海峽？」權威結論</div>
      <div class="dossier-role-text" style="border-left-color:#ffd700;">
        ${cp.verdict}
      </div>

      <div class="dossier-section-title" style="margin-top:14px;">📈 關聯航運上市公司 (點擊查看)</div>
      <div class="dossier-carriers-tags">${stocksHtml}</div>
    </div>
  `;
}

/**
 * 依股票代號跳轉並篩選
 */
window.filterStocksByTicker = function(ticker) {
  const stockTabBtn = document.querySelector('.tab-btn[data-tab="tab-stocks"]');
  if (stockTabBtn) stockTabBtn.click();
  const searchInput = document.getElementById('stockSearchInput');
  if (searchInput) {
    searchInput.value = ticker.split('.')[0];
    searchInput.dispatchEvent(new Event('input'));
  }
};

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
        <span style="margin-left:8px; font-size:11px; color:#38bdf8;">主力停靠港: ${portsStr}</span>
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
      } else if (currentCategory === 'dry_bulk') {
        list = list.filter(s => s.sector === 'dry_bulk');
      } else if (currentCategory === 'lng_gas') {
        list = list.filter(s => s.sector === 'lng_gas');
      } else if (currentCategory === 'ports_logistics') {
        list = list.filter(s => s.sector === 'ports_logistics');
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

      const cpTagsHtml = (stock.chokepoints || []).map(cpId => {
        const cp = (window.CHOKEPOINTS_DATA || []).find(x => x.id === cpId);
        const name = cp ? cp.nameZh.split('（')[0].split(' ')[0] : cpId;
        return `<span class="carrier-tag" style="cursor:pointer; background:rgba(234,179,8,0.15); color:#ffd700;" onclick="jumpToChokePoint('${cpId}')">${name}</span>`;
      }).join(' ');

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
            <div>🚢 <strong>運力/航線比重:</strong> <span class="gulf-share-highlight">${stock.gulfSharePct}</span></div>
            <div style="margin-top:4px; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
              <span style="color:#94a3b8; font-size:10px;">涉險海峽:</span> ${cpTagsHtml}
            </div>
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
    "2605": "frontline",
    "2606": "wan_hai",
    "2637": "wan_hai",
    "maersk_stock": "maersk",
    "hapag_stock": "hapag_lloyd",
    "cosco_stock": "cosco",
    "zim_stock": "msc",
    "frontline_stock": "frontline",
    "dht_stock": "dht",
    "stng_stock": "frontline",
    "sblk_stock": "wan_hai",
    "gogl_stock": "frontline",
    "wawi_stock": "one",
    "nakilat_stock": "nakilat",
    "bwlp_stock": "bw_group",
    "bahri_stock": "bahri",
    "adnocls_stock": "adnoc_ls",
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

/** ==========================================================================
 * 模組一：全球航運三大基準運價指數即時大盤渲染 (Freight Rate Benchmarks)
 * ========================================================================== */
function renderFreightSection() {
  const container = document.getElementById('freightBenchmarksContainer');
  if (!container || !window.FREIGHT_INDICES_DATA) return;

  const data = window.FREIGHT_INDICES_DATA;
  const groups = [data.container, data.tanker, data.dryBulk];

  let html = `
    <div style="margin-bottom:20px; padding:14px 18px; background:rgba(14,165,233,0.1); border:1px solid rgba(56,189,248,0.3); border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <h3 style="color:#38bdf8; font-size:16px; font-weight:800;">📊 全球航運即期與長約運價基準綜合看板</h3>
        <p style="color:#cbd5e1; font-size:12px; margin-top:2px;">涵蓋貨櫃現貨 SCFI、超大型油輪 VLCC TD3C 等價日租金 (TCE)、波羅的海原油與散裝綜合指數。</p>
      </div>
      <span style="font-family:monospace; font-size:12px; color:#ffd700;">發布基準：${data.lastUpdated}</span>
    </div>
  `;

  groups.forEach(grp => {
    html += `
      <div class="freight-section-group">
        <div class="freight-header-row">
          <div>
            <h2 style="font-size:17px; font-weight:800; color:#fff;">${grp.categoryZh}</h2>
            <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${grp.description}</div>
          </div>
        </div>

        <div class="freight-indices-grid">
          ${grp.indices.map(idx => {
            const isUp = idx.changePct >= 0;
            let chgClass = isUp ? 'chg-up' : 'chg-down';
            if (idx.status === 'boom') chgClass = 'chg-boom';

            // 52 週高低區間進度條
            const rangePct = Math.round(((idx.currentValue - idx.low52w) / (idx.high52w - idx.low52w)) * 100);

            return `
              <div class="freight-card">
                <div class="freight-card-top">
                  <div class="freight-name">${idx.nameZh}</div>
                  <div class="freight-unit">${idx.unit}</div>
                </div>

                <div class="freight-val-row">
                  <div class="freight-val">${idx.currentValue.toLocaleString()}</div>
                  <div class="freight-chg-pill ${chgClass}">
                    ${isUp ? '▲ +' : '▼ '}${idx.changePct}% (${isUp ? '+' : ''}${idx.changeWeekly})
                  </div>
                </div>

                <div class="freight-range-bar">
                  <div style="display:flex; justify-content:space-between;">
                    <span>52週低: ${idx.low52w}</span>
                    <span style="color:#38bdf8;">目前位階 ${rangePct}%</span>
                    <span>52週高: ${idx.high52w}</span>
                  </div>
                  <div class="range-track">
                    <div class="range-fill" style="width:${rangePct}%;"></div>
                  </div>
                </div>

                <div class="freight-desc">${idx.commentary}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/** ==========================================================================
 * 模組二：海峽繞道成本與航期互動試算器渲染與事件 (Detour Calculator)
 * ========================================================================== */
function renderCalculatorSection() {
  const container = document.getElementById('detourCalculatorContainer');
  if (!container || !window.DetourCalculator) return;

  container.innerHTML = `
    <div class="calc-layout-grid">
      <!-- 左欄：輸入與滑桿控制項 -->
      <div class="calc-controls-card">
        <h2 style="font-size:18px; font-weight:800; color:#fff; margin-bottom:6px;">🧮 航線繞道財務與單箱成本換算模型</h2>
        <p style="font-size:12px; color:#94a3b8; margin-bottom:16px;">拉動下方數值滑桿，系統將即時計算船東繞道總成本、通行費節省、損益平衡點與單箱運費加價！</p>

        <!-- 場景切換按鈕 -->
        <div class="scenario-selector-row">
          <button class="cat-pill active calc-scene-btn" data-scene="suez_cape">蘇伊士運河 vs. 繞道好望角</button>
          <button class="cat-pill calc-scene-btn" data-scene="panama_horn">巴拿馬運河競拍 vs. 繞道合恩角</button>
          <button class="cat-pill calc-scene-btn" data-scene="hormuz_pipe">荷姆茲戰險 vs. ADCOP 陸上油管</button>
        </div>

        <!-- 場景一輸入項：蘇伊士 vs 好望角 -->
        <div id="sceneInputs_suez_cape" class="calc-scene-inputs">
          <div class="calc-input-row">
            <div>
              <label style="font-size:11px; color:#94a3b8;">貨櫃船裝載容量 (TEU):</label>
              <select id="suez_teuCapacity" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
                <option value="15000" selected>15,000 TEU (遠洋新主力船)</option>
                <option value="20000">20,000 TEU (超大型巨輪)</option>
                <option value="24000">24,000 TEU (長榮A級/現代旗艦)</option>
                <option value="10000">10,000 TEU (中型貨櫃船)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px; color:#94a3b8;">艙位裝載率 (%):</label>
              <input type="number" id="suez_loadFactor" value="85" min="50" max="100" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
          </div>

          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>繞道好望角增加航程天數:</span>
              <strong id="disp_extraDays" style="color:#ffd700; font-family:monospace;">12 天</strong>
            </div>
            <input type="range" id="suez_extraDays" min="8" max="18" value="12" step="1" class="calc-range-slider">
          </div>

          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>船用低硫燃油價格 ($/噸 VLSFO):</span>
              <strong id="disp_fuelPrice" style="color:#38bdf8; font-family:monospace;">$620 / 噸</strong>
            </div>
            <input type="range" id="suez_fuelPrice" min="450" max="850" value="620" step="10" class="calc-range-slider">
          </div>

          <div class="calc-input-row">
            <div>
              <label style="font-size:11px; color:#94a3b8;">船舶每日營運/租金成本 ($/天):</label>
              <input type="number" id="suez_charterCost" value="45000" step="1000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
            <div>
              <label style="font-size:11px; color:#94a3b8;">蘇伊士運河省下通行費 ($/趟):</label>
              <input type="number" id="suez_tollSaved" value="550000" step="10000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
          </div>
        </div>

        <!-- 場景二輸入項：巴拿馬競拍 vs 合恩角 -->
        <div id="sceneInputs_panama_horn" class="calc-scene-inputs" style="display:none;">
          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>巴拿馬運河特別拍賣插隊費 ($):</span>
              <strong id="disp_auctionFee" style="color:#f43f5e; font-family:monospace;">$1,500,000</strong>
            </div>
            <input type="range" id="panama_auctionFee" min="200000" max="4000000" value="1500000" step="50000" class="calc-range-slider">
          </div>
          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>繞道南美合恩角額外天數:</span>
              <strong id="disp_detourDays" style="color:#ffd700; font-family:monospace;">18 天</strong>
            </div>
            <input type="range" id="panama_detourDays" min="12" max="25" value="18" step="1" class="calc-range-slider">
          </div>
          <div class="calc-input-row">
            <div>
              <label style="font-size:11px; color:#94a3b8;">每日船舶營運租金 ($/天):</label>
              <input type="number" id="panama_dailyShipCost" value="35000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
            <div>
              <label style="font-size:11px; color:#94a3b8;">正常運河通行費 ($):</label>
              <input type="number" id="panama_normalToll" value="400000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
          </div>
        </div>

        <!-- 場景三輸入項：荷姆茲戰險 vs 陸上油管 -->
        <div id="sceneInputs_hormuz_pipe" class="calc-scene-inputs" style="display:none;">
          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>荷姆茲過境附加戰險費率 (AWRP %):</span>
              <strong id="disp_warRiskRate" style="color:#f43f5e; font-family:monospace;">0.35 %</strong>
            </div>
            <input type="range" id="hormuz_warRiskRate" min="0.05" max="0.75" value="0.35" step="0.01" class="calc-range-slider">
          </div>
          <div class="calc-slider-group">
            <div class="slider-label-row">
              <span>阿聯酋 ADCOP 油管過境費 ($/桶):</span>
              <strong id="disp_pipeTariff" style="color:#10b981; font-family:monospace;">$1.80 / 桶</strong>
            </div>
            <input type="range" id="hormuz_pipeTariff" min="0.80" max="3.00" value="1.80" step="0.10" class="calc-range-slider">
          </div>
          <div class="calc-input-row">
            <div>
              <label style="font-size:11px; color:#94a3b8;">VLCC 滿載原油桶數:</label>
              <input type="number" id="hormuz_barrels" value="2000000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
            <div>
              <label style="font-size:11px; color:#94a3b8;">超大型油輪船體保額 ($):</label>
              <input type="number" id="hormuz_hullValue" value="120000000" class="search-input-box" style="width:100%; min-width:auto; margin-top:4px;">
            </div>
          </div>
        </div>
      </div>

      <!-- 右欄：即時量化試算結果面板 -->
      <div class="calc-results-card" id="calcResultsBox">
        <!-- 由 updateCalcDisplay 即時計算渲染 -->
      </div>
    </div>
  `;

  // 綁定事件監聽
  bindCalculatorEvents();
  updateCalcDisplay('suez_cape');
}

function bindCalculatorEvents() {
  const sceneBtns = document.querySelectorAll('.calc-scene-btn');
  let currentScene = 'suez_cape';

  sceneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sceneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScene = btn.getAttribute('data-scene');

      document.querySelectorAll('.calc-scene-inputs').forEach(el => el.style.display = 'none');
      const targetDiv = document.getElementById(`sceneInputs_${currentScene}`);
      if (targetDiv) targetDiv.style.display = 'block';

      updateCalcDisplay(currentScene);
    });
  });

  // 監聽所有 input 與 slider
  const allInputs = document.querySelectorAll('#detourCalculatorContainer input, #detourCalculatorContainer select');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      // 即時更新數值顯示
      const extraDays = document.getElementById('suez_extraDays');
      if (extraDays) document.getElementById('disp_extraDays').textContent = `${extraDays.value} 天`;
      const fuelPrice = document.getElementById('suez_fuelPrice');
      if (fuelPrice) document.getElementById('disp_fuelPrice').textContent = `$${fuelPrice.value} / 噸`;

      const auctionFee = document.getElementById('panama_auctionFee');
      if (auctionFee) document.getElementById('disp_auctionFee').textContent = `$${Number(auctionFee.value).toLocaleString()}`;
      const detourDays = document.getElementById('panama_detourDays');
      if (detourDays) document.getElementById('disp_detourDays').textContent = `${detourDays.value} 天`;

      const warRisk = document.getElementById('hormuz_warRiskRate');
      if (warRisk) document.getElementById('disp_warRiskRate').textContent = `${warRisk.value} %`;
      const pipeTariff = document.getElementById('hormuz_pipeTariff');
      if (pipeTariff) document.getElementById('disp_pipeTariff').textContent = `$${Number(pipeTariff.value).toFixed(2)} / 桶`;

      updateCalcDisplay(currentScene);
    });
  });
}

function updateCalcDisplay(scene) {
  const resBox = document.getElementById('calcResultsBox');
  if (!resBox || !window.DetourCalculator) return;

  if (scene === 'suez_cape') {
    const res = window.DetourCalculator.calculateSuezCape({
      teuCapacity: Number(document.getElementById('suez_teuCapacity').value),
      loadFactor: Number(document.getElementById('suez_loadFactor').value),
      extraDays: Number(document.getElementById('suez_extraDays').value),
      fuelPrice: Number(document.getElementById('suez_fuelPrice').value),
      charterCostPerDay: Number(document.getElementById('suez_charterCost').value),
      suezTollSaved: Number(document.getElementById('suez_tollSaved').value)
    });

    resBox.innerHTML = `
      <div style="font-size:12px; color:#38bdf8; font-weight:700; text-transform:uppercase;">蘇伊士 vs. 繞道好望角 試算結果</div>
      <h3 style="font-size:18px; font-weight:800; color:#fff; margin:4px 0 14px 0;">單箱損益平衡需轉嫁運費</h3>

      <div class="calc-kpi-block">
        <div class="calc-kpi-main">+$${res.costPerTeu} <span style="font-size:14px; font-weight:normal; color:#cbd5e1;">/ TEU</span></div>
        <div style="font-size:11px; color:#94a3b8; margin-top:4px;">船東為彌補好望角繞道淨成本，每只標準貨櫃需加收之附加費</div>
      </div>

      <div class="calc-breakdown-list">
        <div class="calc-breakdown-item"><span>實際載貨量:</span> <strong>${res.actualTeu.toLocaleString()} TEU</strong></div>
        <div class="calc-breakdown-item"><span>額外燃油消耗 (${res.extraDays}天):</span> <strong>${res.extraFuelTons} 噸 ($${res.extraFuelCost.toLocaleString()})</strong></div>
        <div class="calc-breakdown-item"><span>船舶租金/運營額外成本:</span> <strong>$${res.extraCharterCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item"><span>歐盟碳稅 (EU ETS) 增項:</span> <strong>$${res.euEtsCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item" style="color:#10b981;"><span>省下蘇伊士單趟通行費:</span> <strong>-$${res.suezTollSaved.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item" style="border-top:1px solid #38bdf8; font-weight:bold; color:#fff;">
          <span>單趟淨增加成本:</span> <span style="color:#ffd700;">$${res.netCost.toLocaleString()}</span>
        </div>
      </div>

      <div style="margin-top:auto; padding:10px; background:rgba(2,132,199,0.15); border-radius:6px; font-size:11px; color:#cbd5e1;">
        💡 <strong>全球運力緊縮效果：</strong> 繞道好望角增加 ${res.extraDays} 天航期，實質將該航線船隊運力消耗吸收約 <strong style="color:#00ff88;">${res.absorbedCapacityPct}%</strong>，是支撐長榮、陽明即期運價高檔的最根本原因！
      </div>
    `;
  } else if (scene === 'panama_horn') {
    const res = window.DetourCalculator.calculatePanamaHorn({
      auctionFee: Number(document.getElementById('panama_auctionFee').value),
      detourDays: Number(document.getElementById('panama_detourDays').value),
      dailyShipCost: Number(document.getElementById('panama_dailyShipCost').value),
      normalToll: Number(document.getElementById('panama_normalToll').value)
    });

    resBox.innerHTML = `
      <div style="font-size:12px; color:#38bdf8; font-weight:700; text-transform:uppercase;">巴拿馬競拍 vs. 繞道合恩角 試算結果</div>
      <h3 style="font-size:18px; font-weight:800; color:#fff; margin:4px 0 14px 0;">決策效益評估</h3>

      <div class="calc-kpi-block">
        <div class="calc-kpi-main" style="color:${res.savings > 0 ? '#10b981' : '#f43f5e'};">
          ${res.savings > 0 ? '省下 $' + res.savings.toLocaleString() : '多花 $' + Math.abs(res.savings).toLocaleString()}
        </div>
        <div style="font-size:12px; font-weight:700; color:#fff; margin-top:6px;">${res.recommendation}</div>
      </div>

      <div class="calc-breakdown-list">
        <div class="calc-breakdown-item"><span>巴拿馬通行總成本 (含拍賣費):</span> <strong>$${res.directThroughCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item"><span>繞道合恩角租金成本 (${document.getElementById('panama_detourDays').value}天):</span> <strong>$${res.detourCharterCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item"><span>繞道額外燃油總耗費:</span> <strong>$${res.detourFuelCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item" style="border-top:1px solid #38bdf8; font-weight:bold; color:#fff;">
          <span>繞道南美總代價:</span> <span style="color:#ffd700;">$${res.detourTotalCost.toLocaleString()}</span>
        </div>
      </div>
    `;
  } else if (scene === 'hormuz_pipe') {
    const res = window.DetourCalculator.calculateHormuzPipeline({
      barrels: Number(document.getElementById('hormuz_barrels').value),
      hullValue: Number(document.getElementById('hormuz_hullValue').value),
      warRiskRate: Number(document.getElementById('hormuz_warRiskRate').value),
      pipelineTariff: Number(document.getElementById('hormuz_pipeTariff').value)
    });

    resBox.innerHTML = `
      <div style="font-size:12px; color:#38bdf8; font-weight:700; text-transform:uppercase;">荷姆茲海峽戰險 vs. 陸上油管 試算結果</div>
      <h3 style="font-size:18px; font-weight:800; color:#fff; margin:4px 0 14px 0;">單趟戰略避險成本對比</h3>

      <div class="calc-kpi-block">
        <div class="calc-kpi-main" style="color:#f43f5e;">$${res.warRiskPremium.toLocaleString()}</div>
        <div style="font-size:11px; color:#94a3b8; margin-top:4px;">VLCC 單航次過境荷姆茲海峽需額外繳納之戰險 (AWRP)</div>
      </div>

      <div class="calc-breakdown-list">
        <div class="calc-breakdown-item"><span>原油每桶戰險分攤:</span> <strong>+$${res.warRiskCostPerBarrel} / 桶</strong></div>
        <div class="calc-breakdown-item"><span>ADCOP 陸上油管總過境費:</span> <strong>$${res.pipelineTotalCost.toLocaleString()}</strong></div>
        <div class="calc-breakdown-item"><span>油管管輸費率:</span> <strong>$${res.pipelineTariff} / 桶</strong></div>
      </div>

      <div style="margin-top:auto; padding:10px; background:rgba(217,70,239,0.15); border-radius:6px; font-size:11px; color:#cbd5e1;">
        💡 <strong>戰略意義：</strong> 阿聯酋透過 ADCOP 管道每日輸送 150 萬桶，既避開荷姆茲海峽戰險，更完全免受水雷封鎖風險！
      </div>
    `;
  }
}

/** ==========================================================================
 * 模組三：全球船隊供需剪刀差與造船廠手持訂單比渲染 (Orderbook-to-Fleet)
 * ========================================================================== */
function renderOrderbookSection() {
  const container = document.getElementById('orderbookContainer');
  if (!container || !window.ORDERBOOK_DATA) return;

  container.innerHTML = `
    <div style="margin-bottom:24px; padding:16px 20px; background:linear-gradient(135deg, rgba(234,179,8,0.1), rgba(14,165,233,0.1)); border:1px solid rgba(234,179,8,0.3); border-radius:10px;">
      <h2 style="font-size:18px; font-weight:800; color:#ffd700;">🏗️ 全球各大船型手持訂單比與供需剪刀差分析 (Orderbook-to-Fleet)</h2>
      <p style="font-size:12px; color:#cbd5e1; margin-top:4px;">
        決定航運股長線多空週期的最硬核數據：<strong>手持訂單佔比越低（如 VLCC 僅 7.8%），未來新船交船壓力越小，運價爆發力越持久；反之若訂單比過高（如貨櫃 22.5%），則極度依賴地緣繞道來消化運力！</strong>
      </p>
    </div>

    <div class="orderbook-grid">
      ${window.ORDERBOOK_DATA.map(ob => `
        <div class="orderbook-card" style="border-top: 3px solid ${ob.statusColor};">
          <div class="ob-header">
            <div>
              <h3 style="font-size:17px; font-weight:800; color:#fff;">${ob.sectorZh}</h3>
              <div style="font-size:11px; color:#94a3b8; font-family:var(--font-mono);">${ob.sectorEn}</div>
            </div>
            <div class="ob-ratio-badge" style="color:${ob.statusColor}; border:1px solid ${ob.statusColor}55;">
              ${ob.orderbookRatio}% <span style="font-size:10px; font-weight:normal;">訂單比</span>
            </div>
          </div>

          <div style="font-size:12px; color:#cbd5e1; margin-bottom:6px;">
            <span>現役船隊總量:</span> <strong style="color:#fff;">${ob.currentFleet}</strong>
          </div>

          <div class="ob-bar-wrapper">
            <div style="display:flex; justify-content:space-between; font-size:11px;">
              <span style="color:${ob.statusColor}; font-weight:bold;">● 供需狀態：${ob.statusZh}</span>
              <span style="color:#94a3b8;">手持訂單比重</span>
            </div>
            <div class="ob-progress-track">
              <div class="ob-progress-fill" style="width:${Math.min(ob.orderbookRatio * 2.2, 100)}%; background:${ob.statusColor};"></div>
            </div>
          </div>

          <div class="delivery-timeline-box">
            <div style="font-weight:700; color:#94a3b8; margin-bottom:4px;">📅 未來 3 年新船交付排程預估：</div>
            <div class="timeline-row"><span>2025 年交船:</span> <strong>${ob.deliveries.y2025}</strong></div>
            <div class="timeline-row"><span>2026 年交船:</span> <strong>${ob.deliveries.y2026}</strong></div>
            <div class="timeline-row"><span>2027 年及以後:</span> <strong>${ob.deliveries.y2027plus}</strong></div>
            <div class="timeline-row" style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:4px; margin-top:4px;">
              <span>年均淨供給增速:</span> <strong style="color:${ob.netSupplyGrowth.includes('幾無') ? '#ffd700' : '#38bdf8'};">${ob.netSupplyGrowth}</strong>
            </div>
          </div>

          <div style="font-size:12px; line-height:1.6; color:#cbd5e1; background:rgba(10,18,32,0.6); padding:10px; border-radius:6px; margin:8px 0;">
            ${ob.strategicTakeaway}
          </div>

          <div style="margin-top:auto; padding-top:10px;">
            <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">核心受惠標的:</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${ob.coreBeneficiaryStocks.map(s => `<span class="carrier-tag" style="cursor:pointer;" onclick="filterStocksByTicker('${s}')">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
