/**
 * 全球船隊供需剪刀差與造船廠手持訂單比資料庫 (Orderbook-to-Fleet Ratio)
 * 涵蓋貨櫃、超大型油輪 VLCC、LNG 氣體船、乾散裝、汽車專用船 PCTC 五大族群
 * 呈現 2025、2026、2027+ 新船交付排程與基本面供需剪刀差
 */

window.ORDERBOOK_DATA = [
  {
    id: "vlcc_tanker",
    sectorZh: "超大型原油輪 (VLCC Tankers)",
    sectorEn: "Very Large Crude Carriers",
    currentFleet: "約 910 艘 (2.7 億 DWT 載重噸)",
    orderbookRatio: 7.8, // 7.8% 歷史極端低檔
    status: "extremely_tight",
    statusZh: "極度供不應求 / 歷史性結構大缺船",
    statusColor: "#ffd700",
    deliveries: {
      y2025: "約 12 艘 (僅佔現役 1.3%)",
      y2026: "約 24 艘 (佔現役 2.6%)",
      y2027plus: "約 35 艘 (佔現役 3.8%)"
    },
    scrappingRatio: "年均老舊拆船需求約 3.5% (船齡 >20 年佔比已達 16%)",
    netSupplyGrowth: "+0.5% ~ +1.2% / 年 (供給幾無增長！)",
    demandDrivers: "大西洋至亞洲長途跨洋運送擴張（噸浬數激增）、中東波斯灣地緣避險",
    strategicTakeaway: "【超級多頭大王牌】全球主要造船廠（中韓）船台全被貨櫃船與 LNG 船塞滿到 2027 年，VLCC 即使現在下單最快也要 2028 年後才能交船！未來 2~3 年若波斯灣或荷姆茲出現任何動盪，VLCC 日租金極易出現報復性噴發，是 Frontline (FRO)、DHT Holdings 與新興 (2605) 最堅實的長線護城河。",
    coreBeneficiaryStocks: ["FRO", "DHT", "CMBT", "4030.SR", "2605.TW"]
  },
  {
    id: "container",
    sectorZh: "全球貨櫃海運 (Container Fleet)",
    sectorEn: "Container Vessels",
    currentFleet: "約 6,100 艘 (3,150 萬 TEU)",
    orderbookRatio: 22.5, // 22.5% 高檔
    status: "absorbed_by_redsea",
    statusZh: "名義供給偏高 / 全靠紅海繞道吸收",
    statusColor: "#00d2ff",
    deliveries: {
      y2025: "約 220 萬 TEU (佔現役 7.0%)",
      y2026: "約 180 萬 TEU (佔現役 5.7%)",
      y2027plus: "約 120 萬 TEU (佔現役 3.8%)"
    },
    scrappingRatio: "老船拆解率約 1.0% (因運價好，船東延後拆船)",
    netSupplyGrowth: "+6.0% ~ +7.5% / 年 (名義供給增速快)",
    demandDrivers: "紅海危機繞道好望角單趟多 14 天，吸收全球約 9%~11% 有效運力",
    strategicTakeaway: "【地緣繞道依賴型】若紅海持續受阻，繞道好望角能完美抵銷新船交船潮，維持運價高檔暴利；但若蘇伊士運河突然全面復航，市場將面臨巨量新船下水之運力過剩考驗，長榮 (2603)、陽明 (2609) 的高現金儲備是抵禦週期的最佳盾牌。",
    coreBeneficiaryStocks: ["2603.TW", "2615.TW", "2609.TW", "MAERSK-B.CO", "HLAG.DE"]
  },
  {
    id: "lng_gas",
    sectorZh: "液化天然氣船 (LNG Carriers)",
    sectorEn: "LNG Tankers",
    currentFleet: "約 750 艘大型低溫船",
    orderbookRatio: 42.0, // 42% 高訂單
    status: "long_term_expansion",
    statusZh: "訂單龐大 / 但多數已被卡達長約綁定",
    statusColor: "#38bdf8",
    deliveries: {
      y2025: "約 78 艘",
      y2026: "約 95 艘",
      y2027plus: "約 120 艘"
    },
    scrappingRatio: "蒸汽渦輪老船退役加速 (約 2.5% / 年)",
    netSupplyGrowth: "+9.0% / 年",
    demandDrivers: "卡達北方氣田產能自 7,700 萬噸拉升至 1.42 億噸、美國墨西哥灣 LNG 出口站",
    strategicTakeaway: "【長約鎖定型擴產】雖然手持訂單比達 42%，但其中 70% 以上早已被卡達國營 Nakilat 與美歐長約項目綁定專用，現貨市場流通可用船極少，清潔能源長線供需相對穩定。",
    coreBeneficiaryStocks: ["QGTS.QA", "BWLP", "9104.T"]
  },
  {
    id: "dry_bulk",
    sectorZh: "乾散裝海運 (Dry Bulk)",
    sectorEn: "Dry Bulk Carriers (Capesize/Panamax)",
    currentFleet: "約 13,800 艘 (10.2 億 DWT 載重噸)",
    orderbookRatio: 9.2, // 9.2% 歷史低檔
    status: "healthy_low",
    statusZh: "供給極度克制 / 景氣下檔支撐強勁",
    statusColor: "#10b981",
    deliveries: {
      y2025: "約 3,200 萬 DWT (佔現役 3.1%)",
      y2026: "約 2,800 萬 DWT (佔現役 2.7%)",
      y2027plus: "約 2,200 萬 DWT (佔現役 2.1%)"
    },
    scrappingRatio: "IMO CII 碳排法規驅使 20 年以上老船加速淘汰 (約 2.0%/年)",
    netSupplyGrowth: "+1.5% ~ +2.0% / 年 (健康低增速)",
    demandDrivers: "幾內亞西芒杜大型鐵礦投產、巴西淡水河谷遠程長途出口、印度煤炭進口",
    strategicTakeaway: "【結構性健康防守】散裝船手持訂單處於近 20 年低水位，船東下單極為克制。一旦全球基建或原物料需求小幅回溫，BDI 指數彈性極大，裕民 (2606)、慧洋-KY (2637)、Star Bulk (SBLK) 下檔風險極低。",
    coreBeneficiaryStocks: ["SBLK", "GOGL", "2606.TW", "2637.TW"]
  },
  {
    id: "pctc_car",
    sectorZh: "汽車專用滾裝船 (PCTC / Car Carriers)",
    sectorEn: "Pure Car and Truck Carriers",
    currentFleet: "約 780 艘大型滾裝船",
    orderbookRatio: 28.5, // 28.5%
    status: "ev_boom",
    statusZh: "全球電動車出海狂潮 / 日租金處歷史天價",
    statusColor: "#f43f5e",
    deliveries: {
      y2025: "約 48 艘",
      y2026: "約 55 艘",
      y2027plus: "約 35 艘"
    },
    scrappingRatio: "老船因改裝新安全標準（鋰電池防火防爆）加速淘汰",
    netSupplyGrowth: "+5.5% / 年",
    demandDrivers: "中國電動車全球出口激增、中東與歐洲豪車進口強勁",
    strategicTakeaway: "【利基高暴利期】雖然新船訂單達 28.5%，但目前全球汽車滾裝船嚴重供不應求，日租金曾突破 10 萬美元大關，華輪威爾森 (WAWI.OL) 現金殖利率維持 10% 以上，獲利處於歷史頂峰。",
    coreBeneficiaryStocks: ["WAWI.OL", "9107.T", "9104.T"]
  }
];
