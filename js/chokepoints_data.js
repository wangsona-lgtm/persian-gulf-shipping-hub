/**
 * 全球十大關鍵海峽與運河咽喉 (Global Maritime Choke Points) 深度比較數據庫
 * 針對「哪一個海峽運輸最重要？」進行多維度量化比較：
 * 每日能源流通量、貿易總價值、全球噸位佔比、替代難易度、地緣軍事脆弱度與總體經濟衝擊
 */

window.CHOKEPOINTS_DATA = [
  {
    id: "hormuz",
    nameZh: "荷姆茲海峽 (Strait of Hormuz)",
    nameEn: "Strait of Hormuz",
    location: "波斯灣與阿曼灣之間（伊朗、阿曼、阿聯酋）",
    rank: 1, // 能源第一咽喉
    titleCategory: "全球能源安全心臟 / 不可替代性之王",
    dailyOilVolume: "2,100 萬桶 / 日（佔全球海運原油 21%）",
    dailyOilNum: 21.0,
    dailyLngShare: "約佔全球海運 LNG 24%（卡達與阿聯酋出口全靠它）",
    dailyTradeValue: "約 28 億美元 / 日（主要是高價值原油與液化氣）",
    tradeValueNum: 28,
    globalCargoShare: "約 11% 全球海運總噸位",
    widthNarrowest: "最窄處僅 21 海浬（分道通航制各 2 海浬）",
    depthLimit: "滿載 VLCC 只能走深水槽（水深 70-90m），偏離即面臨擱淺與水雷",
    substitutabilityScore: 98, // 100分制：分數越高越難以替代
    substitutabilityDesc: "極端困難！僅阿聯酋 ADCOP 油管（150萬桶/日）與沙國東西油管可微幅分流，其餘每日逾 1,500 萬桶原油完全無陸路或繞道替代方案！",
    geopoliticalRiskScore: 99,
    geopoliticalRiskDesc: "最高軍事熱點。伊朗革命衛隊快艇、反艦飛彈、水雷與無人機可輕易封鎖整條深水槽。一旦封鎖，全球油價立即破 $150~$200/桶。",
    compositeScore: 96.5,
    keyCommodities: ["重質與輕質原油", "液化天然氣 (LNG)", "液化石油氣 (LPG)", "沙烏地石化原料"],
    coreAffectedStocks: ["FRO", "DHT", "CMBT", "4030.SR", "ADNOCLS.AE", "QGTS.QA", "2605.TW"],
    verdict: "【能源維度絕對第一】若論對全球宏觀經濟與通貨膨脹的『瞬間毀滅性震撼』，荷姆茲海峽是無可爭議的全球第一咽喉。一旦完全中斷超過 2 週，將引發全球第三次能源危機與全球股市暴跌。"
  },
  {
    id: "malacca",
    nameZh: "馬六甲海峽 (Strait of Malacca)",
    nameEn: "Strait of Malacca & Singapore",
    location: "馬來半島與蘇門答臘島之間（新加坡、馬來西亞、印尼）",
    rank: 2, // 貿易總額與貨櫃第一咽喉
    titleCategory: "全球商品貿易大動脈 / 亞洲經濟臍帶",
    dailyOilVolume: "約 1,600 萬桶 / 日（中東原油運往中日韓台之必經咽喉）",
    dailyOilNum: 16.0,
    dailyLngShare: "約佔全球 LNG 海運量 32%",
    dailyTradeValue: "約 95 億美元 / 日（全球海運貿易總額近四分之一！）",
    tradeValueNum: 95,
    globalCargoShare: "約 25% ~ 30% 全球海運貿易總量（每年通航逾 9 萬艘船舶）",
    widthNarrowest: "最窄處菲利普斯水道 (Phillips Channel) 僅 1.5 海浬！",
    depthLimit: "馬六甲極限型 (Malaccamax) 吃水深度 20.5 公尺，超過此限必須繞道巽他或龍目海峽",
    substitutabilityScore: 85,
    substitutabilityDesc: "中等偏難。若遭封鎖，船舶需向南繞道印尼巽他海峽 (Sunda) 或龍目海峽 (Lombok)，航程增加 3~5 天，燃油與租船成本暴增，且龍目海峽後勤補給不發達。",
    geopoliticalRiskScore: 78,
    geopoliticalRiskDesc: "沿岸三國（星馬印）防務穩定，主要風險為海盜襲擊、狹窄水道碰撞事故及美中海權戰略扼喉競爭（中國『馬六甲困局』）。",
    compositeScore: 95.0,
    keyCommodities: ["貨櫃高科技成品", "中東進口原油", "澳洲鐵礦", "非洲大宗散貨", "汽車"],
    coreAffectedStocks: ["2603.TW", "2615.TW", "2609.TW", "MAERSK-B.CO", "1919.HK", "9104.T"],
    verdict: "【貿易總價值與實體商品維度第一】若以『每日通航貿易金額』與『全球實體貨櫃物流總量』衡量，馬六甲海峽是全球貿易量最高、船隻最密集的第一大動脈，維繫東亞與歐美供應鏈。"
  },
  {
    id: "suez_bab_mandeb",
    nameZh: "蘇伊士運河 ＆ 曼德海峽（紅海動脈）",
    nameEn: "Suez Canal & Bab el-Mandeb (Red Sea Corridor)",
    location: "埃及西奈半島 ＆ 葉門與吉布地之間（紅海南北雙門戶）",
    rank: 3, // 當前地緣運價推手第一
    titleCategory: "歐亞最短捷徑 / 當前運價飆漲最大推手",
    dailyOilVolume: "正常時約 850 萬桶 / 日（目前因紅海危機降至約 300 萬桶）",
    dailyOilNum: 8.5,
    dailyLngShare: "卡達通往歐洲 LNG 核心通道（目前全數繞道好望角）",
    dailyTradeValue: "約 45 億美元 / 日（佔全球貨櫃海運 30%、全球海運總量 12%）",
    tradeValueNum: 45,
    globalCargoShare: "約 12% 全球海運總量",
    widthNarrowest: "曼德海峽最窄 16 海浬；蘇伊士運河航道寬度僅約 200~300 公尺（長賜輪曾在此卡死）",
    depthLimit: "蘇伊士型 (Suezmax) 最大吃水 20.1 公尺（載重約 16~20 萬噸）",
    substitutabilityScore: 75,
    substitutabilityDesc: "有實體替代路線但代價高昂！船舶可全數繞道非洲好望角，但單程航期拉長 10~14 天，每趟航程增加燃油與碳稅成本數十萬美元，並吸收全球近 10% 遠洋貨櫃運力！",
    geopoliticalRiskScore: 95,
    geopoliticalRiskDesc: "當前全球最受干擾之航道！葉門胡塞武裝無人機與反艦飛彈襲擊商船，造成自 1970 年代以來最嚴重的歐亞航運改道危機。",
    compositeScore: 92.5,
    keyCommodities: ["歐亞雙向貨櫃產品", "卡達 LNG", "波斯灣出口歐洲原油", "歐洲機械汽車"],
    coreAffectedStocks: ["2603.TW", "2609.TW", "2615.TW", "MAERSK-B.CO", "HLAG.DE", "ZIM"],
    verdict: "【航運股獲利彈性第一】紅海危機是近年推升台灣貨櫃三雄與國際航運股運價與 EPS 的最大黑天鵝！繞道好望角大量消耗過剩船隊運力，是航運股多頭的最強催化劑。"
  },
  {
    id: "panama",
    nameZh: "巴拿馬運河 (Panama Canal)",
    nameEn: "Panama Canal",
    location: "中美洲巴拿馬地峽（連接太平洋與大西洋）",
    rank: 4, // 美洲兩洋樞紐
    titleCategory: "西半球水上橋樑 / 全球農糧與液化氣樞紐",
    dailyOilVolume: "成品油與 LPG / LNG 為主（每日約 200~300 萬桶當量）",
    dailyOilNum: 2.8,
    dailyLngShare: "美國墨西哥灣出口至亞洲 LNG 之核心通道",
    dailyTradeValue: "約 32 億美元 / 日（佔美東與亞洲貿易 46%）",
    tradeValueNum: 32,
    globalCargoShare: "約 5% 全球海運總量（美洲重要性達 40%+）",
    widthNarrowest: "新巴拿馬型 (Neopanamax) 船閘寬 55 公尺，長 427 公尺",
    depthLimit: "吃水受加通湖 (Gatun Lake) 淡水水位高度限制（正常 15.2m，乾旱期降至 13.4m 以下）",
    substitutabilityScore: 82,
    substitutabilityDesc: "替代成本極高！若無法通行，美東至亞洲貨物需繞道南美合恩角 (Cape Horn) 或穿過蘇伊士/好望角，航期增加 15~20 天；或改走美西陸橋鐵路 (Intermodal Rail)，成本增加 40%。",
    geopoliticalRiskScore: 45,
    geopoliticalRiskDesc: "地緣軍事風險極低（由巴林/美軍保障且政治穩定），但【氣候乾旱風險極高】！聖嬰現象導致加通湖水位下降引發限航拍賣，拍賣通行費曾創下單艘 400 萬美元天價！",
    compositeScore: 84.0,
    keyCommodities: ["美國出口亞洲 LNG / LPG", "美國大豆與玉米穀物", "東亞發往美東生活消費貨櫃"],
    coreAffectedStocks: ["BWLP", "SBLK", "GOGL", "2603.TW", "2606.TW"],
    verdict: "【氣候適應力與美洲貿易第一】連接大西洋與太平洋的最短命脈。它不是被飛彈封鎖，而是被氣候乾旱卡喉嚨，直接牽動美國液化氣輸出與糧食安全。"
  },
  {
    id: "taiwan_strait",
    nameZh: "台灣海峽 (Taiwan Strait)",
    nameEn: "Taiwan Strait",
    location: "台灣與歐亞大陸之間（連接南海與東海）",
    rank: 5, // 高科技與東北亞生命線
    titleCategory: "全球高科技晶片走廊 / 東北亞能源咽喉",
    dailyOilVolume: "中東與東南亞運往日韓的原油幾乎 100% 途經台海或台灣東部海域",
    dailyOilNum: 14.5,
    dailyLngShare: "日韓台三國進口 LNG（佔全球 55%）之核心航道",
    dailyTradeValue: "約 68 億美元 / 日（全球約 48% 貨櫃船隊穿梭此航道）",
    tradeValueNum: 68,
    globalCargoShare: "約 20% 全球海運總噸位（全球大型貨櫃船密度最高水道之一）",
    widthNarrowest: "最窄處約 70 海浬（平均寬度約 100 海浬）",
    depthLimit: "海峽多數水深 50~100 公尺，深水船舶可完全通行",
    substitutabilityScore: 60,
    substitutabilityDesc: "可繞道台灣東部太平洋深水海域（花東外海），航期僅增加 1~2 天，但季風與颱風季節海象險惡，且船險保費將出現幾何級數跳升。",
    geopoliticalRiskScore: 94,
    geopoliticalRiskDesc: "全球兩大超強（美中）地緣軍事戰略對峙前線。一旦台海爆發軍事封鎖，全球先進半導體供應鏈（台積電等）直接斷鏈，全球高科技工業陷入癱瘓。",
    compositeScore: 89.0,
    keyCommodities: ["半導體與高科技零組件", "日韓進口中東原油與卡達 LNG", "中日韓台出口美歐工業品"],
    coreAffectedStocks: ["2603.TW", "2615.TW", "2609.TW", "9101.T", "9104.T", "011200.KS"],
    verdict: "【高科技半導體與東北亞生命線】若台海受阻，不僅是航運改道問題，而是全球科技製造業供應鏈直接休克，其衍生之經濟總損失預估超過數兆美元。"
  },
  {
    id: "cape_good_hope",
    nameZh: "好望角 (Cape of Good Hope)",
    nameEn: "Cape of Good Hope",
    location: "非洲最南端南非海域（連接大西洋與印度洋）",
    rank: 6, // 全球終極避險通道
    titleCategory: "全球終極避險大動脈 / 運力消耗調節器",
    dailyOilVolume: "紅海危機後激增至 600~800 萬桶 / 日（原本僅 200 萬桶）",
    dailyOilNum: 7.0,
    dailyLngShare: "歐洲自卡達進口 LNG 及東亞至歐美船隻目前主力航道",
    dailyTradeValue: "目前承攬全球逾 40 億美元 / 日 之繞道貿易",
    tradeValueNum: 40,
    globalCargoShare: "目前激增至約 18% 全球海運貿易",
    widthNarrowest: "開闊大洋，無人為海峽瓶頸限制",
    depthLimit: "無限（大洋深槽，可通行最大型 Valemax 與 40 萬噸超級巨輪）",
    substitutabilityScore: 30, // 本身即是終極替代通道
    substitutabilityDesc: "無可替代的備份動脈。當蘇伊士運河或紅海中斷時，好望角是唯一能承接百萬 TEU 規模遠洋轉向的天然水域。",
    geopoliticalRiskScore: 25,
    geopoliticalRiskDesc: "地緣軍事衝突風險低，但自然海象惡劣（狂暴浪潮、強風），且南非沿岸港口（德班等）補給與加油設施擁擠不堪。",
    compositeScore: 80.0,
    keyCommodities: ["歐亞長程轉移貨櫃", "南非煤炭與錳礦", "大西洋超大型油輪"],
    coreAffectedStocks: ["2603.TW", "MAERSK-B.CO", "HLAG.DE", "2606.TW"],
    verdict: "【全球航運安全閥】沒有好望角，蘇伊士運河一旦出事全球貿易就會斷絕；它用額外的 10~14 天航期，為全世界撐起了供應鏈的安全底線。"
  },
  {
    id: "turkish_straits",
    nameZh: "土耳其海峽 (博斯普魯斯與達達尼爾海峽)",
    nameEn: "Turkish Straits (Bosphorus & Dardanelles)",
    location: "土耳其伊斯坦堡（連接黑海與地中海）",
    rank: 7, // 黑海糧倉唯一出口
    titleCategory: "黑海糧食與俄油唯一通道 / 蒙特勒公約守護者",
    dailyOilVolume: "約 300 萬桶 / 日（俄羅斯新羅西斯克港及哈薩克原油出海口）",
    dailyOilNum: 3.0,
    dailyLngShare: "極低（土耳其禁止大型 LNG 船穿越博斯普魯斯海峽以策伊斯坦堡安全）",
    dailyTradeValue: "約 12 億美元 / 日（主要是糧食小麥、原油與化肥）",
    tradeValueNum: 12,
    globalCargoShare: "約 3% 全球海運總量",
    widthNarrowest: "博斯普魯斯海峽最窄僅 700 公尺！貫穿伊斯坦堡千萬人口都會區",
    depthLimit: "水深約 36~124 公尺，水流強勁且彎角險峻",
    substitutabilityScore: 96,
    substitutabilityDesc: "完全無法替代！黑海沿岸六國（烏克蘭、羅馬尼亞、保加利亞、喬治亞、俄羅斯）唯一通往世界大洋的海運通道！",
    geopoliticalRiskScore: 88,
    geopoliticalRiskDesc: "受《蒙特勒公約》嚴格管制。俄烏戰爭爆發後，土耳其依公約關閉海峽禁止交戰國軍艦通行，直接主宰黑海制海權。",
    compositeScore: 78.5,
    keyCommodities: ["烏克蘭與俄羅斯小麥/葵花油", "哈薩克原油 (CPC Blend)", "肥料"],
    coreAffectedStocks: ["SBLK", "2606.TW", "CMBT"],
    verdict: "【全球糧食安全關鍵】掌控全球三成以上小麥出口的出海口，更是牽動北非、中東數億人口麵包價格的政治安全閥。"
  },
  {
    id: "gibraltar",
    nameZh: "直布羅陀海峽 (Strait of Gibraltar)",
    nameEn: "Strait of Gibraltar",
    location: "西班牙與摩洛哥之間（大西洋與地中海門戶）",
    rank: 8, // 地中海天然出海口
    titleCategory: "地中海西大門 / 歐非分界線",
    dailyOilVolume: "約 550 萬桶 / 日",
    dailyOilNum: 5.5,
    dailyLngShare: "阿爾及利亞出口歐洲天然氣之重要途徑",
    dailyTradeValue: "約 25 億美元 / 日",
    tradeValueNum: 25,
    globalCargoShare: "約 7% 全球海運總量（每年通航逾 10 萬艘）",
    widthNarrowest: "最窄處約 7.7 海浬（14.3 公里）",
    depthLimit: "水深達 300 公尺以上，完全無吃水限制",
    substitutabilityScore: 88,
    substitutabilityDesc: "無其他天然通道。地中海國家通往大西洋的唯一直接出海口。",
    geopoliticalRiskScore: 35,
    geopoliticalRiskDesc: "英國、西班牙與摩洛哥共同維護，北約強大海空力量駐防，軍事遭封鎖機率極低。",
    compositeScore: 75.0,
    keyCommodities: ["地中海進出口貨櫃", "北非原油", "西歐天然氣"],
    coreAffectedStocks: ["MAERSK-B.CO", "HLAG.DE", "2603.TW"],
    verdict: "【地中海天然門戶】地理位置無可替代，但因處於西方盟國絕對軍事控制之下，地緣政治風險溢價相對平穩。"
  },
  {
    id: "dover",
    nameZh: "多佛海峽 / 英吉利海峽 (Strait of Dover)",
    nameEn: "Strait of Dover / English Channel",
    location: "英國與法國之間（連接大西洋與北海）",
    rank: 9, // 北歐工業核心
    titleCategory: "歐洲最繁忙水道 / 鹿特丹前哨站",
    dailyOilVolume: "約 400 萬桶 / 日",
    dailyOilNum: 4.0,
    dailyLngShare: "北海天然氣與跨大西洋 LNG 關鍵路徑",
    dailyTradeValue: "約 35 億美元 / 日",
    tradeValueNum: 35,
    globalCargoShare: "約 8% 全球海運總量（每日通航逾 500 艘商船）",
    widthNarrowest: "最窄處約 18 海浬（33 公里）",
    depthLimit: "水深約 30~50 公尺，有嚴格的 TSS 分道通航",
    substitutabilityScore: 50,
    substitutabilityDesc: "可向北繞道蘇格蘭北部（北海航線），但航程增加且北大西洋風浪極大。",
    geopoliticalRiskScore: 20,
    geopoliticalRiskDesc: "英法雙方協同雷達監控，幾無地緣軍事威脅，主要風險為濃霧碰撞與繁忙交叉航行。",
    compositeScore: 72.0,
    keyCommodities: ["西北歐貨櫃", "汽車滾裝 (Ro-Ro)", "北海原油", "化學品"],
    coreAffectedStocks: ["MAERSK-B.CO", "HLAG.DE"],
    verdict: "【歐洲工業的心臟走廊】鹿特丹、漢堡、安特衛普三大歐洲頂級港口的海上主動脈。"
  },
  {
    id: "danish_straits",
    nameZh: "丹麥海峽 (Danish Straits - 厄勒海峽/大貝爾特海峽)",
    nameEn: "Danish Straits (Storebælt & Øresund)",
    location: "丹麥與瑞典之間（連接波羅的海與北海）",
    rank: 10, // 波羅的海出口
    titleCategory: "波羅的海唯一大門 / 俄羅斯原油影子船隊通道",
    dailyOilVolume: "約 320 萬桶 / 日（俄羅斯波羅的海 Primorsk 港原油出海口）",
    dailyOilNum: 3.2,
    dailyLngShare: "波羅的海三國與芬蘭天然氣進口生命線",
    dailyTradeValue: "約 15 億美元 / 日",
    tradeValueNum: 15,
    globalCargoShare: "約 4% 全球海運總量",
    widthNarrowest: "厄勒海峽狹窄處僅 2.5 海浬，大貝爾特橋有淨空高度限制 (65m)",
    depthLimit: "大貝爾特深水航道吃水限制約 15 公尺，大型油輪需減載航行",
    substitutabilityScore: 92,
    substitutabilityDesc: "波羅的海唯一深水出海口，無其他替代水道。",
    geopoliticalRiskScore: 82,
    geopoliticalRiskDesc: "俄烏戰爭後北約包圍波羅的海，俄羅斯「影子油輪船隊」頻繁在此遭遇丹麥引航與環保稽查，摩擦風險高。",
    compositeScore: 70.0,
    keyCommodities: ["俄羅斯烏拉爾原油", "北歐木材與紙漿", "波羅的海散貨"],
    coreAffectedStocks: ["FRO", "CMBT"],
    verdict: "【北約與俄羅斯地緣博弈前線】波羅的海出入大洋的咽喉，近年成為歐盟制裁俄羅斯石油走私監管的主戰場。"
  }
];

// 「哪一個海峽運輸最重要？」多維度權威裁決與結論
window.CHOKEPOINT_VERDICT_ANALYSIS = {
  title: "全世界哪一個海峽運輸最重要？—— 終極多維度權威裁決",
  summary: "海峽的『重要性』不能僅憑單一標準判斷，不同行業與維度對『重要』的定義截然不同：",
  dimensions: [
    {
      dimension: "1. 若論「全球宏觀經濟與能源安全的不可替代性」",
      champion: "👑 荷姆茲海峽 (Strait of Hormuz) 毫無爭議第一！",
      reason: "波斯灣佔全球海運原油 21% 與 LNG 24%，最致命的是【幾乎完全沒有替代繞道路線】！一旦封鎖，全球每天瞬間短缺 1,700 萬桶原油，油價將飆破 $150~$200/桶，直接引發全球通膨失控與經濟大蕭條。其他海峽大多能繞道，唯獨荷姆茲海峽無法繞過。"
    },
    {
      dimension: "2. 若論「全球實體商品貿易總值與貨櫃物流總量」",
      champion: "🚢 馬六甲海峽 (Strait of Malacca) 實質貿易量第一！",
      reason: "每天通行超過 95 億美元的實體商品，佔全球海運貿易量四分之一以上。作為『全球工廠（東亞）』通往『全球最大消費市場（歐洲/中東/美東）』的唯一臍帶，沒有馬六甲，全球高科技、汽車與消費品供應鏈將徹底中斷。"
    },
    {
      dimension: "3. 若論「當前地緣政治衝擊與航運股獲利催化劑」",
      champion: "🔥 曼德海峽 / 蘇伊士運河 (紅海走廊) 影響力第一！",
      reason: "胡塞武裝襲擊引發的紅海危機，迫使全球 80% 歐亞貨櫃輪繞道好望角（航期多 10-14 天），單槍匹馬吸收了全球近 10% 的船隊運力，直接引爆全球運價飆漲，是推升台灣長榮、陽明、萬海以及馬士基獲利爆發的最直接推手！"
    },
    {
      dimension: "4. 若論「全球高科技工業與大國軍事決戰關鍵」",
      champion: "⚡ 台灣海峽 (Taiwan Strait) 戰略威脅度第一！",
      reason: "全球 90% 最先進半導體產能與近一半大容量貨櫃船穿行此海域。台海一旦生變，全球科技產業鏈將面臨無可估量的斷鏈災難，各國智庫評估其經濟總損失將高達數兆至十兆美元。"
    }
  ]
};
