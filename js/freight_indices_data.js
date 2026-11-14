/**
 * 全球航運三大基準運價指數即時大盤資料庫 (Global Freight Rate Benchmarks)
 * 涵蓋貨櫃海運 (SCFI, CCFI, FBX, WCI)、散裝海運 (BDI, BCI, BPI, BSI)、原油與成品油 (BDTI, BCTI, VLCC TD3C TCE)
 */

window.FREIGHT_INDICES_DATA = {
  lastUpdated: "2026-11-14",
  currency: "USD",
  
  // 1. 貨櫃海運基準指數 (Container Freight)
  container: {
    categoryZh: "貨櫃海運運價基準 (Container)",
    description: "反映全球貨櫃即期與長約運費水準，受紅海繞道好望角、港口塞港與歐美拉貨旺季深度影響。",
    indices: [
      {
        id: "scfi_composite",
        nameZh: "SCFI 上海出口集裝箱運價綜合指數",
        nameEn: "Shanghai Containerized Freight Index (Composite)",
        unit: "點 (Points)",
        currentValue: 2250.4,
        changeWeekly: 68.2,
        changePct: 3.12,
        high52w: 3733.8,
        low52w: 998.5,
        status: "up",
        commentary: "紅海危機常態化疊加歐美年底補庫存急單，綜合指數維持於歷史高檔區間震盪。"
      },
      {
        id: "scfi_europe",
        nameZh: "SCFI 歐洲基本港運價 (上海-鹿特丹/漢堡)",
        nameEn: "SCFI Europe Base Port",
        unit: "$/TEU",
        currentValue: 2680.0,
        changeWeekly: 110.0,
        changePct: 4.28,
        high52w: 4880.0,
        low52w: 1050.0,
        status: "up",
        commentary: "繞道好望角航期增加 14 天，歐洲線艙位緊俏，長榮、陽明、馬士基獲利核心來源。"
      },
      {
        id: "scfi_gulf",
        nameZh: "SCFI 波斯灣航線 (上海-杜拜/達曼)",
        nameEn: "SCFI Persian Gulf Route",
        unit: "$/TEU",
        currentValue: 1450.0,
        changeWeekly: 75.0,
        changePct: 5.45,
        high52w: 2200.0,
        low52w: 820.0,
        status: "up",
        commentary: "中東杜拜海空聯運 (Sea-Air) 轉運量爆發，萬海與長榮中東班次裝載率維持 95% 以上。"
      },
      {
        id: "scfi_uswc",
        nameZh: "SCFI 美西航線 (上海-美西基本港)",
        nameEn: "SCFI US West Coast",
        unit: "$/FEU",
        currentValue: 4250.0,
        changeWeekly: 85.0,
        changePct: 2.04,
        high52w: 7800.0,
        low52w: 1800.0,
        status: "up",
        commentary: "美中提前拉貨與罷工避險情緒推升跨太平洋美西長程運價。"
      },
      {
        id: "scfi_usec",
        nameZh: "SCFI 美東航線 (上海-美東基本港)",
        nameEn: "SCFI US East Coast",
        unit: "$/FEU",
        currentValue: 5380.0,
        changeWeekly: 95.0,
        changePct: 1.80,
        high52w: 9800.0,
        low52w: 2400.0,
        status: "up",
        commentary: "巴拿馬運河通航量受限與紅海繞道雙重夾擊，美東航程拉長支撐高運價。"
      },
      {
        id: "ccfi_composite",
        nameZh: "CCFI 中國出口集裝箱長約綜合指數",
        nameEn: "China Containerized Freight Index (Contract)",
        unit: "點 (Points)",
        currentValue: 1420.5,
        changeWeekly: 22.1,
        changePct: 1.58,
        high52w: 2150.0,
        low52w: 860.0,
        status: "up",
        commentary: "歐美直客 2025-2026 年長約結算價格大幅高於去年同期，鎖定船商基本獲利底線。"
      }
    ]
  },

  // 2. 原油輪與液態能源基準指數 (Tanker & VLCC)
  tanker: {
    categoryZh: "超大型油輪 VLCC 與液態能源基準 (Tanker)",
    description: "反映中東波斯灣與全球原油、成品油長程海運運費，直接牽動 Frontline、DHT、中遠海能獲利。",
    indices: [
      {
        id: "td3c_tce",
        nameZh: "VLCC 中東-中國航線等價日租金 (TD3C TCE)",
        nameEn: "TD3C Middle East to China VLCC TCE",
        unit: "$/天 (USD/Day)",
        currentValue: 54200.0,
        changeWeekly: 4800.0,
        changePct: 9.72,
        high52w: 86500.0,
        low52w: 26000.0,
        status: "boom",
        commentary: "全球最關鍵原油海運指標！船東損益平衡點約 2.5~3 萬美元，現行 $5.4 萬/日處於超額暴利區間！"
      },
      {
        id: "td3c_ws",
        nameZh: "VLCC TD3C 世界油輪名義費率 (Worldscale)",
        nameEn: "TD3C WS Rate",
        unit: "WS 點數",
        currentValue: 66.5,
        changeWeekly: 5.2,
        changePct: 8.48,
        high52w: 95.0,
        low52w: 42.0,
        status: "up",
        commentary: "波斯灣至亞洲戰略原油長約訂艙熱絡，沙烏地阿美與中石化包船租金走堅。"
      },
      {
        id: "bdti_composite",
        nameZh: "BDTI 波羅的海原油運價綜合指數",
        nameEn: "Baltic Dirty Tanker Index",
        unit: "點 (Points)",
        currentValue: 1180.0,
        changeWeekly: 65.0,
        changePct: 5.83,
        high52w: 1650.0,
        low52w: 880.0,
        status: "up",
        commentary: "大西洋至亞洲長程跨洋原油載運拉長航程噸浬數 (Ton-Mile)，原油船隊供不應求。"
      },
      {
        id: "bcti_composite",
        nameZh: "BCTI 波羅的海成品油運價指數",
        nameEn: "Baltic Clean Tanker Index",
        unit: "點 (Points)",
        currentValue: 860.0,
        changeWeekly: 42.0,
        changePct: 5.13,
        high52w: 1350.0,
        low52w: 620.0,
        status: "up",
        commentary: "中東大型煉油廠柴油出口歐美航線持續繞道好望角，天蠍座成品油輪 (STNG) 直接受惠。"
      }
    ]
  },

  // 3. 散裝海運基準指數 (Dry Bulk)
  dryBulk: {
    categoryZh: "乾散裝航運基準指數 (Dry Bulk)",
    description: "反映全球鐵礦石、煤炭、穀物與化肥海運景氣，為 Star Bulk、裕民、慧洋-KY 營收晴雨表。",
    indices: [
      {
        id: "bdi_composite",
        nameZh: "BDI 波羅的海乾散貨綜合指數",
        nameEn: "Baltic Dry Index (Composite)",
        unit: "點 (Points)",
        currentValue: 1785.0,
        changeWeekly: 95.0,
        changePct: 5.62,
        high52w: 2450.0,
        low52w: 1220.0,
        status: "up",
        commentary: "巴西與西澳鐵礦季末衝刺出貨，全球大宗商品海運需求穩定回溫。"
      },
      {
        id: "bci_capesize",
        nameZh: "BCI 海岬型船指數 (Capesize - 18萬噸載重)",
        nameEn: "Baltic Capesize Index",
        unit: "點 (Points)",
        currentValue: 2840.0,
        changeWeekly: 210.0,
        changePct: 7.98,
        high52w: 4200.0,
        low52w: 1650.0,
        status: "boom",
        commentary: "日租金回升至 $23,500/天，金洋海運 (GOGL) 與裕民海岬型船隊獲利彈升。"
      },
      {
        id: "bpi_panamax",
        nameZh: "BPI 巴拿馬型船指數 (Panamax - 7~8萬噸載重)",
        nameEn: "Baltic Panamax Index",
        unit: "點 (Points)",
        currentValue: 1420.0,
        changeWeekly: 45.0,
        changePct: 3.27,
        high52w: 2100.0,
        low52w: 1100.0,
        status: "up",
        commentary: "南美大豆與北美大宗農產品出口旺季，巴拿馬運河通航量修復進展受矚目。"
      },
      {
        id: "bsi_supramax",
        nameZh: "BSI 超靈便型船指數 (Supramax - 5~6萬噸載重)",
        nameEn: "Baltic Supramax Index",
        unit: "點 (Points)",
        currentValue: 1210.0,
        changeWeekly: 28.0,
        changePct: 2.37,
        high52w: 1680.0,
        low52w: 920.0,
        status: "up",
        commentary: "非金屬礦產、鋼鐵件與肥料運輸需求穩健，慧洋-KY 節能中小型船隊受惠。"
      }
    ]
  }
};
