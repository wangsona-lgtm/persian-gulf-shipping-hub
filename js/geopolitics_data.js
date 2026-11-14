/**
 * 波斯灣航運三大地緣戰略關鍵與戰情分析數據 (Geopolitical Maritime Analytics)
 */

window.GEOPOLITICS_DATA = {
  summary: {
    title: "波斯灣航運三大地緣戰略關鍵 (Three Strategic Pillars)",
    updatedAt: "2026-11-14",
    threatLevel: "ELEVATED (高度戒備 / 戰險費率走揚)",
    dailyCrudeTransit: "約 2,100 萬桶 / 日（佔全球海運原油約 21%）",
    dailyLngTransit: "約佔全球海運液化天然氣 24%",
    warRiskPremium: "0.20% ~ 0.35% 船體價值 (依荷姆茲過境與停留港口遞增)"
  },
  pillars: [
    {
      id: "pillar_hormuz",
      title: "一、荷姆茲海峽（Strait of Hormuz）TSS 航制咽喉",
      badge: "航運最窄死穴",
      color: "#ef4444",
      highlight: "最窄處僅 21 海浬，滿載 VLCC 只能走深水槽，完全無迴避空間",
      content: `
        <p><strong>1. 分道通航制（TSS）之嚴格物理限制：</strong><br>
        荷姆茲海峽連通波斯灣與阿曼灣，最窄處僅約 21 海浬（約 39 公里）。根據國際海事組織 (IMO) 制定的分道通航制（TSS）：
        <ul>
          <li><strong>北側進港航道 (Inbound)：</strong>寬 2 海浬，航向約 240°，靠近伊朗南部島嶼（格什姆島、霍爾木茲島、拉拉克島）。</li>
          <li><strong>中央安全隔離帶 (Separation Zone)：</strong>寬 2 海浬的非航行緩衝帶。</li>
          <li><strong>南側出港航道 (Outbound)：</strong>寬 2 海浬，航向約 060°，緊鄰阿曼穆桑代姆半島 (Musandam Peninsula) 險峻峭壁。</li>
        </ul>
        </p>
        <p><strong>2. 滿載 VLCC 吃水限制與無替代深槽：</strong><br>
        吃水深達 20 ~ 22 公尺的滿載 30 萬噸超大型油輪（VLCC）及超級 Q-Max LNG 船，受水深限制只能航行於特定深水槽（Deep Water Route）。船舶無法為了躲避軍事威脅而隨意偏離航道，極易受無人機、水面快艇攔截或水雷封鎖，因此任何局勢風吹草動都會使保險公司啟動「戰險額外加費（Additional War Risk Premium）」，直接推升全球運價。
        </p>
      `
    },
    {
      id: "pillar_redsea_seaair",
      title: "二、紅海危機外溢推升 Jebel Ali 海空聯運地位",
      badge: "海空聯運爆發",
      color: "#06b6d4",
      highlight: "繞道好望角耗時 10~14 天，亞洲先海運至杜拜 Jebel Ali，再空運至歐洲成新常態",
      content: `
        <p><strong>1. 曼德海峽受阻導致之供應鏈重組：</strong><br>
        胡塞武裝封鎖曼德海峽後，歐亞主要航線大型貨櫃輪被迫繞道非洲好望角，航期單程增加 10 至 14 天，港口塞港與空櫃周轉失衡外溢至中東各大支線。
        </p>
        <p><strong>2. 杜拜「海空聯運模式（Sea-Air Logistics）」成為最大受益者：</strong><br>
        針對具高時效要求之高科技電子零件、精密元件、汽車零組件及生鮮藥品，全球供應鏈發展出成熟的「Sea-Air」雙聯運解決方案：
        <ul>
          <li><strong>亞洲出發段（海運）：</strong>自台灣（高雄）、中國或東南亞裝箱，海運航行約 10~14 天直達杜拜 <strong>Jebel Ali 港</strong>。</li>
          <li><strong>自貿區極速通關（陸運保稅）：</strong>貨物在 JAFZA 保稅區內於 4~8 小時內極速拆箱、打板、過安檢，經由專用保稅快速道路直接運抵<strong>阿勒馬克圖姆國際機場（杜拜世界中心 DWC）</strong>或杜拜國際機場 (DXB)。</li>
          <li><strong>歐洲段（空運）：</strong>搭乘阿聯酋航空 (Emirates SkyCargo) 等貨機，約 6~8 小時直達法蘭克福、阿姆斯特丹、倫敦。</li>
        </ul>
        <strong>成果：</strong>比全程海運節省 12~15 天時間，且運費僅為全程純空運的 35%~45%，使杜拜 Jebel Ali 港之貨運樞紐戰略價值再度被大幅重估！
        </p>
      `
    },
    {
      id: "pillar_bypass_pipelines",
      title: "三、繞行荷姆茲海峽的陸上戰略輸油管道",
      badge: "戰略繞道生命線",
      color: "#d946ef",
      highlight: "阿聯酋 ADCOP 油管（150萬桶/日）與沙烏地 Petroline 油管（500萬桶/日）打破海峽封鎖瓶頸",
      content: `
        <p>為避免伊朗封鎖荷姆茲海峽掐死國家命脈，海灣兩大產油國斥巨資興建了橫跨國土的戰略繞道陸上輸油管道：</p>
        <p><strong>1. 阿聯酋哈布善—富吉拉輸油管（ADCOP）：</strong><br>
        <ul>
          <li><strong>全長：</strong>380 公里，穿越阿聯酋沙漠與險峻哈賈爾山脈。</li>
          <li><strong>起迄點：</strong>阿布達比內陸 Habshan 油田直達<strong>阿曼灣外的富吉拉港（Port of Fujairah）</strong>。</li>
          <li><strong>日運能：</strong>每日可輸送 <strong>150 萬桶</strong>原油（最高可擴充至 180 萬桶），約佔阿聯酋原油出口量的一半以上。</li>
          <li><strong>重大戰略意義：</strong>原油裝船地點富吉拉港<strong>位在荷姆茲海峽之外！</strong>即便海峽遭到完全封鎖，阿聯酋原油仍可不受任何阻礙直接駛入印度洋。</li>
        </ul>
        </p>
        <p><strong>2. 沙烏地東西輸油管道（Petroline / East-West Pipeline）：</strong><br>
        <ul>
          <li><strong>全長：</strong>約 1,200 公里，橫跨沙烏地全境沙漠。</li>
          <li><strong>起迄點：</strong>波斯灣沿岸的布蓋格（Abqaiq）油田直通<strong>西側紅海之延布港（Yanbu）</strong>。</li>
          <li><strong>日運能：</strong>目前運能高達每日 <strong>500 萬桶</strong>原油。</li>
          <li><strong>重大戰略意義：</strong>沙烏地可彈性將波斯灣原油直接導向紅海裝船，運往歐洲或蘇伊士運河以西市場。</li>
        </ul>
        </p>
      `
    }
  ],
  marketIndicators: [
    { name: "荷姆茲日均原油流通量", value: "2,050 萬桶", sub: "佔全球海運原油 21%", status: "critical" },
    { name: "VLCC 中東-遠東 (TD3C) 日租金", value: "$52,000 / 日", sub: "季增 +18.5%", status: "up" },
    { name: "SCFI 波斯灣線貨櫃運價", value: "$1,420 / TEU", sub: "較低點反彈 +65%", status: "up" },
    { name: "卡達 LNG 對東亞出口比重", value: "72.4%", sub: "台日韓長約基石", status: "stable" },
    { name: "杜拜 Jebel Ali 海空聯運量", value: "年增 +38%", sub: "紅海危機替代急單", status: "boom" },
    { name: "荷姆茲過境附加險 (AWRP)", value: "0.25% ~ 0.35%", sub: "百萬美元保費溢價", status: "warning" }
  ]
};
