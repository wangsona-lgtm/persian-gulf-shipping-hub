/**
 * 全球通往中東波斯灣主要船運公司名錄 (Shipping Lines Directory)
 * 涵蓋四大族群：貨櫃巨頭、超大型原油輪 VLCC、LNG 特殊氣體、中東本土支線
 * 包含聯盟、專屬航線 Loops、主力掛靠港與專屬通道設定
 */

window.SHIPPING_COMPANIES = [
  // 一、全球貨櫃海運巨頭 (Container Carriers)
  {
    id: "msc",
    nameZh: "地中海航運",
    nameEn: "MSC (Mediterranean Shipping Company)",
    country: "瑞士 / 義大利",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "獨立運作（全球貨櫃運力龍頭）",
    fleetTeu: "約 620 萬 TEU（全球市佔 ~20%）",
    fleetShips: "860+ 艘貨櫃船",
    loops: ["Falcon Service", "Clang Express", "Himalaya Express", "IPAK Service"],
    corePorts: ["jebel_ali", "dammam", "hamad", "khalifa", "shuwaikh", "umm_qasr"],
    color: "#eab308",
    stockTicker: "非上市（家族全資掌控）",
    description: "全球運力第一龍頭。以杜拜 Jebel Ali 為中東超級大樞紐，佈局直航波斯灣每週多班，並在灣內自營密集支線，是歐亞中東航線最關鍵的承運人。",
    flowPriority: 1
  },
  {
    id: "maersk",
    nameZh: "馬士基航運",
    nameEn: "A.P. Moller - Maersk",
    country: "丹麥",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Gemini Cooperation（雙子星聯盟，與赫伯羅德聯手）",
    fleetTeu: "約 430 萬 TEU（全球市佔 ~14.5%）",
    fleetShips: "710+ 艘貨櫃船",
    loops: ["ME1 (Middle East 1)", "ME2 (Middle East 2)", "ME3", "FM3 (Far East-Middle East)"],
    corePorts: ["jebel_ali", "khalifa_bin_salman", "dammam", "hamad", "sohar"],
    color: "#38bdf8",
    stockTicker: "MAERSK-B.CO / AMKBY",
    description: "雙子星聯盟旗艦。著重以阿曼塞拉萊 (Salalah) 與杜拜 Jebel Ali 為雙核心之軸輻式 (Hub & Spoke) 超高準點率航網，擁有巴林 KBSP 碼頭特許營運權。",
    flowPriority: 1
  },
  {
    id: "cma_cgm",
    nameZh: "達飛海運",
    nameEn: "CMA CGM Group",
    country: "法國",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Ocean Alliance（海洋聯盟）",
    fleetTeu: "約 380 萬 TEU（全球市佔 ~12.8%）",
    fleetShips: "630+ 艘貨櫃船",
    loops: ["FAL (French Asia Line)", "EPIC", "CIMEX 1/2", "GEMINI"],
    corePorts: ["jebel_ali", "khalifa", "dammam", "umm_qasr", "sohar"],
    color: "#f43f5e",
    stockTicker: "非上市（Saadé 家族持股，僅發行上市債券）",
    description: "深耕阿布達比哈里發港（持有專用碼頭股權）與伊拉克烏姆蓋斯爾港，是戰後伊拉克與黎凡特地區最具統治力之歐洲航商。",
    flowPriority: 1
  },
  {
    id: "cosco",
    nameZh: "中遠海運控股",
    nameEn: "COSCO SHIPPING Lines / OOCL",
    country: "中國",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Ocean Alliance（海洋聯盟）",
    fleetTeu: "約 320 萬 TEU（全球市佔 ~10.9%）",
    fleetShips: "510+ 艘貨櫃船",
    loops: ["MEX (Middle East Express)", "CPX", "RES1", "AGX"],
    corePorts: ["khalifa", "jebel_ali", "dammam", "jubail", "umm_qasr"],
    color: "#ef4444",
    stockTicker: "1919.HK / 601919.SS",
    description: "「一帶一路」中東核心骨幹。在阿布達比哈里發港獨資建設 CSP 大型半自動化樞紐碼頭，中國至波斯灣進出口商品最主要的國家級通道。",
    flowPriority: 1
  },
  {
    id: "hapag_lloyd",
    nameZh: "赫伯羅德",
    nameEn: "Hapag-Lloyd",
    country: "德國",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Gemini Cooperation（雙子星聯盟）",
    fleetTeu: "約 220 萬 TEU（全球市佔 ~7.4%）",
    fleetShips: "280+ 艘貨櫃船",
    loops: ["AGX (Arabian Gulf Express)", "CGX", "IMX (India-Middle East)", "IGX"],
    corePorts: ["jebel_ali", "dammam", "jubail", "shuwaikh", "hamad"],
    color: "#f97316",
    stockTicker: "HLAG.DE / HPGLY",
    description: "2017 年合併了波斯灣六國合資的阿拉伯聯合輪船 (UASC)，沙烏地與卡達主權基金為其主要股東，在中東擁有最深厚的在地政府與石油巨頭合作關係。",
    flowPriority: 1
  },
  {
    id: "one",
    nameZh: "海洋網聯船務",
    nameEn: "Ocean Network Express (ONE)",
    country: "日本",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Premier Alliance（卓越聯盟）",
    fleetTeu: "約 195 萬 TEU（全球市佔 ~6.5%）",
    fleetShips: "240+ 艘貨櫃船",
    loops: ["AGX", "PSX (Persian Gulf Express)", "FME (Far East-Middle East)"],
    corePorts: ["jebel_ali", "dammam", "hamad"],
    color: "#ec4899",
    stockTicker: "母公司三大日本船社：商船三井 9104.T / 日本郵船 9101.T / 川崎汽船 9107.T",
    description: "整合日本三大船社貨櫃業務。專注於東亞汽車零組件、高精密儀器直航中東，在 Jebel Ali 及 Dammam 維持極高準點率航線。",
    flowPriority: 1
  },
  {
    id: "evergreen",
    nameZh: "長榮海運",
    nameEn: "Evergreen Marine Corp",
    country: "台灣",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Ocean Alliance（海洋聯盟）",
    fleetTeu: "約 170 萬 TEU（全球第七大貨櫃船隊）",
    fleetShips: "215+ 艘貨櫃船",
    loops: ["APG (Asia-Persian Gulf)", "PEM", "MEX 聯營"],
    corePorts: ["jebel_ali", "dammam", "hamad", "sohar"],
    color: "#10b981",
    stockTicker: "2603.TW",
    description: "台灣遠洋貨櫃旗艦。主力佈局遠東直航杜拜、達曼與阿曼蘇哈爾快線，部署 12,000 ~ 15,000 TEU 大型貨輪，提供優質冷鏈及重載電子設備運送。",
    flowPriority: 1
  },
  {
    id: "wan_hai",
    nameZh: "萬海航運",
    nameEn: "Wan Hai Lines",
    country: "台灣",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "獨立自主營運 / 多方聯營",
    fleetTeu: "約 50 萬 TEU（全球第十一大）",
    fleetShips: "120+ 艘貨櫃船",
    loops: ["CMS (China-Middle East)", "APG", "CVX", "PMX (Pakistan-Middle East)"],
    corePorts: ["jebel_ali", "dammam", "hamad", "jubail"],
    color: "#06b6d4",
    stockTicker: "2615.TW",
    description: "亞洲近洋王者深度拓展中東！萬海是台灣船商中中東波斯灣運力佔比最高者（佔其總營收達 18%~22%），以高彈性、高密度航班橫掃朱拜勒、達曼與杜拜。",
    flowPriority: 1
  },
  {
    id: "yang_ming",
    nameZh: "陽明海運",
    nameEn: "Yang Ming Marine Transport",
    country: "台灣",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Premier Alliance（卓越聯盟）",
    fleetTeu: "約 72 萬 TEU（全球第九大）",
    fleetShips: "95+ 艘貨櫃船",
    loops: ["CGX (China Gulf Express)", "AGX"],
    corePorts: ["jebel_ali", "dammam", "hamad"],
    color: "#3b82f6",
    stockTicker: "2609.TW",
    description: "卓越聯盟主力成員。每週定期由高雄、香港直達杜拜與達曼，提供台灣石化原料與機械製品穩定通往波斯灣的定期定班幹線服務。",
    flowPriority: 1
  },
  {
    id: "hmm",
    nameZh: "韓新遠洋",
    nameEn: "HMM Co., Ltd.",
    country: "韓國",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "Premier Alliance（卓越聯盟）",
    fleetTeu: "約 90 萬 TEU（全球第八大）",
    fleetShips: "85+ 艘貨櫃船",
    loops: ["OGY (Ocean Gulf Yang)", "KMS (Korea-Middle East Service)"],
    corePorts: ["jebel_ali", "dammam", "hamad"],
    color: "#8b5cf6",
    stockTicker: "011200.KS",
    description: "韓國唯一旗艦遠洋航商。主導韓國汽車製造業（現代/起亞）、浦項鋼鐵及三星電子特化產品輸往沙烏地與阿聯酋之專用骨幹。",
    flowPriority: 1
  },
  {
    id: "pil",
    nameZh: "太平船務",
    nameEn: "Pacific International Lines (PIL)",
    country: "新加坡",
    group: "container",
    groupZh: "全球貨櫃海運巨頭",
    alliance: "獨立自主營運",
    fleetTeu: "約 32 萬 TEU（全球第十二大）",
    fleetShips: "80+ 艘貨櫃船",
    loops: ["CS2 (China Gulf)", "GCS (Gulf China Service)"],
    corePorts: ["jebel_ali", "dammam", "hamad"],
    color: "#a855f7",
    stockTicker: "非上市（淡馬錫 Heliconia 戰略注資）",
    description: "新加坡老牌中型利基航商，數十年專注東南亞與遠東通往中東、非洲利基型航線，覆蓋杜拜與二線港口轉口市場。",
    flowPriority: 2
  },

  // 二、超大型原油輪與能源海運 (VLCC & Tanker Operators)
  {
    id: "bahri",
    nameZh: "沙烏地國家航運",
    nameEn: "Bahri (The National Shipping Company of Saudi Arabia)",
    country: "沙烏地阿拉伯",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "沙烏地阿美官方承載主力（國營戰略船隊）",
    fleetTeu: "非貨櫃 / 40+ 艘 VLCC、40+ 艘化學品船",
    fleetShips: "95+ 艘特種原油與化學品船",
    loops: ["Ras Tanura / Jubail -> 全球遠東與歐美原油專線"],
    corePorts: ["jubail", "dammam", "fujairah"],
    color: "#eab308",
    stockTicker: "4030.SR（沙烏地證交所）",
    description: "沙烏地主權基金 (PIF) 與沙烏地阿美 (Aramco) 共同掌控的官方海運旗艦。全球最大 VLCC 船東之一，波斯灣原油對外輸出不可或缺的主導者。",
    flowPriority: 1
  },
  {
    id: "frontline",
    nameZh: "前線海運",
    nameEn: "Frontline plc",
    country: "挪威 / 百慕達",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "全球最大獨立上市原油輪旗艦（Fredriksen 集團）",
    fleetTeu: "非貨櫃 / 42 艘 VLCC、24 艘 Suezmax、18 艘 LR2",
    fleetShips: "84+ 艘現代化超大型油輪",
    loops: ["荷姆茲 TSS 出口 -> 中日韓台煉油廠與歐美深水碼頭"],
    corePorts: ["jubail", "fujairah", "ras_laffan"],
    color: "#f59e0b",
    stockTicker: "FRO (NYSE / 奧斯陸證交所)",
    description: "全球最大獨立上市原油航運龍頭，國際原油現貨租船指數（BDTI / TD3C）的關鍵定價指標。船隊滿載波斯灣重質原油穿越荷姆茲海峽。",
    flowPriority: 1
  },
  {
    id: "euronav",
    nameZh: "歐航 / CMB.TECH",
    nameEn: "Euronav NV / CMB.TECH",
    country: "比利時",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "獨立原油船東 / 氫氨綠色能源轉型先鋒",
    fleetTeu: "非貨櫃 / 50+ 艘 VLCC 與 Suezmax 油輪",
    fleetShips: "55+ 艘原油輪",
    loops: ["伊拉克 Basrah / 沙烏地 Ras Tanura -> 大西洋盆地與東亞"],
    corePorts: ["fujairah", "jubail"],
    color: "#d97706",
    stockTicker: "CMBT (Euronext Brussels / NYSE)",
    description: "歐洲老牌原油航運霸主，與比利時 Saverys 家族 CMB 合併轉型，以極致安全標準承運沙烏地與伊拉克巴士拉原油。",
    flowPriority: 1
  },
  {
    id: "dht",
    nameZh: "DHT 控股",
    nameEn: "DHT Holdings, Inc.",
    country: "百慕達 / 挪威",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "純 100% VLCC 頂級專業上市船東",
    fleetTeu: "非貨櫃 / 24 艘純 VLCC",
    fleetShips: "24 艘超大型現代化原油輪（全數配脫硫塔）",
    loops: ["Ras Tanura / Das Island -> 中日韓亞洲各大煉油中心"],
    corePorts: ["fujairah", "jubail"],
    color: "#b45309",
    stockTicker: "DHT (NYSE)",
    description: "全美股最純粹的超大型原油輪 (VLCC) 標的，24 艘現代化 30 萬噸級油輪幾乎 100% 部署於波斯灣載運原油至亞洲各大國家戰略儲備庫。",
    flowPriority: 1
  },
  {
    id: "cosco_energy",
    nameZh: "中遠海運能源",
    nameEn: "COSCO SHIPPING Energy Transportation",
    country: "中國",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "中國國家能源戰略船隊",
    fleetTeu: "非貨櫃 / 160+ 艘油輪（含 40+ 艘 VLCC）+ 40+ 艘大型 LNG 船",
    fleetShips: "200+ 艘大型能源船舶",
    loops: ["Ras Tanura / 伊拉克 Basrah -> 寧波/大連/青島國儲基地"],
    corePorts: ["jubail", "ras_laffan", "fujairah"],
    color: "#dc2626",
    stockTicker: "1138.HK / 600026.SS",
    description: "中國能源海上生命線。承攬中國自中東波斯灣進口原油三成以上運力，並大量經營卡達拉斯拉凡 LNG 長途冷溫專船運輸。",
    flowPriority: 1
  },
  {
    id: "adnoc_ls",
    nameZh: "阿布達比國油海運",
    nameEn: "ADNOC Logistics & Services",
    country: "阿拉伯聯合大公國 (UAE)",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "阿聯酋國有綜合海運能源航商",
    fleetTeu: "非貨櫃 / 240+ 艘油輪、LNG、自升式鑽井船與近海支援船",
    fleetShips: "240+ 艘",
    loops: ["Das Island / Ruwais / 富吉拉 ADCOP -> 全球海運市場"],
    corePorts: ["khalifa", "fujairah"],
    color: "#059669",
    stockTicker: "ADNOCLS.AE (ADX 阿布達比證交所)",
    description: "阿聯酋國家石油公司海運旗艦。充分掌握哈布善-富吉拉 (ADCOP) 繞道輸油管道終端裝船，完全不受荷姆茲海峽封鎖威脅。",
    flowPriority: 1
  },
  {
    id: "japan_tankers",
    nameZh: "日本三大船社能源部",
    nameEn: "Japan Big 3 Energy (MOL, NYK, K-Line)",
    country: "日本",
    group: "tanker_vlcc",
    groupZh: "超大型原油輪與能源巨頭",
    alliance: "日本戰略原油儲備與公用事業長約船隊",
    fleetTeu: "非貨櫃 / 百艘級大型原油輪與化學品船",
    fleetShips: "120+ 艘 VLCC / Aframax",
    loops: ["波斯灣各油港 -> 台灣中油高雄/沙崙、日本各大煉油廠"],
    corePorts: ["jubail", "fujairah", "ras_laffan"],
    color: "#6366f1",
    stockTicker: "商船三井 9104.T / 日本郵船 9101.T / 川崎汽船 9107.T",
    description: "數十年如一日承攬東亞戰略能源儲備運輸，亦為台灣中油公司長期原油租船重要合約夥伴。",
    flowPriority: 2
  },

  // 三、液化天然氣與特殊氣體船隊 (LNG / LPG Carriers)
  {
    id: "nakilat",
    nameZh: "卡達天然氣運輸",
    nameEn: "Nakilat (Qatar Gas Transport Company)",
    country: "卡達",
    group: "lng_gas",
    groupZh: "液化天然氣與特殊氣體船隊",
    alliance: "全球最大 LNG 船隊掌控者（卡達國家專屬航運）",
    fleetTeu: "非貨櫃 / 74 艘超級大型低溫 LNG 船",
    fleetShips: "74 艘（含世界最大 14 艘 Q-Max 及 31 艘 Q-Flex）",
    loops: ["卡達 Ras Laffan -> 台灣永安/台中、日本 JERA、南韓 KOGAS、歐洲"],
    corePorts: ["ras_laffan"],
    color: "#0284c7",
    stockTicker: "QGTS.QA（卡達證交所）",
    description: "全球最大 LNG 船隊掌控者！擁有世界最頂級的 Q-Max（載運量 26.6 萬立方米）超級冷卻船，直接供應台灣中油與台電發電燃氣生命線。",
    flowPriority: 1
  },
  {
    id: "bw_group",
    nameZh: "BW 集團 / BW LPG",
    country: "新加坡 / 百慕達",
    nameEn: "BW Group / BW LPG / BW LNG",
    group: "lng_gas",
    groupZh: "液化天然氣與特殊氣體船隊",
    alliance: "全球清潔能源氣體船隊先驅",
    fleetTeu: "非貨櫃 / 45+ 艘 VLGC 超大型液化石油氣船 + 30+ 艘 LNG/FSRU",
    fleetShips: "80+ 艘低溫氣體船",
    loops: ["沙烏地阿美 / 卡達天然氣副產物（丙烷/丁烷） -> 東亞裂解廠"],
    corePorts: ["ras_laffan", "jubail"],
    color: "#0ea5e9",
    stockTicker: "BWLP (NYSE) / BWLPG.OL (奧斯陸)",
    description: "全球最大 VLGC (LPG) 船東兼領先 LNG 運營商，具備浮式儲存再氣化 (FSRU) 設施與長途低溫載運能力。",
    flowPriority: 2
  },

  // 四、中東本土與灣內支線駁運商 (Regional & Feeder Lines)
  {
    id: "unifeeder",
    nameZh: "優聯支線船務 / DP World",
    nameEn: "Unifeeder Group / DP World Marine",
    country: "阿聯酋（杜拜環球港務全資）",
    group: "regional_feeder",
    groupZh: "中東本土與灣內支線駁運商",
    alliance: "中東最大獨立支線物流駁運網絡",
    fleetTeu: "約 16 萬 TEU",
    fleetShips: "150+ 艘支線駁船（1,000 ~ 2,500 TEU）",
    loops: ["Jebel Ali Hub 樞紐輻射駁運圈 (Kuwait / Bahrain / Qatar / Iraq / Oman)"],
    corePorts: ["jebel_ali", "shuwaikh", "khalifa_bin_salman", "hamad", "umm_qasr", "sohar"],
    color: "#14b8a6",
    stockTicker: "母公司為 DP World（杜拜政府掌控）",
    description: "波斯灣支線駁運心臟！遠洋 2 萬 TEU 超級母船只靠 Jebel Ali，後續通往科威特、伊拉克、巴林等二線港口全由 Unifeeder 高頻率駁運接力完成。",
    flowPriority: 1
  },
  {
    id: "milaha",
    nameZh: "卡達航運",
    nameEn: "Milaha (Qatar Navigation)",
    country: "卡達",
    group: "regional_feeder",
    groupZh: "中東本土與灣內支線駁運商",
    alliance: "卡達國家級綜合物流上市公司",
    fleetTeu: "多元船隊（貨櫃、近海支援、油品、散裝）",
    fleetShips: "80+ 艘綜合船舶",
    loops: ["Hamad Port -> 沙烏地、阿聯酋、阿曼與印度次大陸直達專線"],
    corePorts: ["hamad", "sohar", "jebel_ali"],
    color: "#065f46",
    stockTicker: "QNNS.QA（卡達證交所）",
    description: "卡達國家級海運物流巨頭，與 QTerminals 共同運營哈馬德深水港，維繫卡達對外貿易暢通的生命線。",
    flowPriority: 2
  },
  {
    id: "folk_maritime",
    nameZh: "沙烏地民俗海運",
    nameEn: "Folk Maritime",
    country: "沙烏地阿拉伯",
    group: "regional_feeder",
    groupZh: "中東本土與灣內支線駁運商",
    alliance: "沙烏地公共投資基金 (PIF) 支持的新銳國家近海船隊",
    fleetTeu: "支線專用船隊（擴建中）",
    fleetShips: "10+ 艘專用近海貨櫃船",
    loops: ["紅海延布/吉達 <-> 波斯灣達曼/朱拜勒接駁鏈"],
    corePorts: ["dammam", "jubail"],
    color: "#15803d",
    stockTicker: "未上市（PIF 國有全資戰略孵化）",
    description: "沙烏地 2030 願景新成立之國家近海航運公司，主力打通沙國東部波斯灣港口與西部紅海港口之接駁網絡。",
    flowPriority: 3
  },
  {
    id: "irisl",
    nameZh: "伊朗伊斯蘭共和國航運",
    nameEn: "IRISL Group (Islamic Republic of Iran Shipping Lines)",
    country: "伊朗",
    group: "regional_feeder",
    groupZh: "中東本土與灣內支線駁運商",
    alliance: "伊朗國營海運船隊",
    fleetTeu: "約 15 萬 TEU + 散裝油輪",
    fleetShips: "115+ 艘",
    loops: ["Bandar Abbas -> 中國主要港口、印度孟買、裏海南北走廊 (INSTC)"],
    corePorts: ["bandar_abbas"],
    color: "#64748b",
    stockTicker: "伊朗德黑蘭證交所上市",
    description: "伊朗國營船隊，主要維持阿巴斯港至中國、印度及裏海南北走廊 (INSTC) 的戰略物資進出口運補，長期受歐美嚴密監控。",
    flowPriority: 3
  }
];

// 波斯灣五大動態航道與輸油管道光流幾何定義
window.SHIPPING_LANES = [
  {
    id: "lane_fareast",
    nameZh: "遠東直達幹線 (Asia Direct Mainline)",
    code: "FE-ME",
    color: "#00ff88",
    flowSpeed: 18,
    strokeWidth: 3.5,
    dashArray: "12, 6",
    type: "mainline_asia",
    description: "連接上海、寧波、深圳、高雄、新加坡，經馬六甲海峽、斯里蘭卡科倫坡，跨越阿拉伯海與阿曼灣，由荷姆茲海峽進港道 (Inbound) 進入波斯灣直達杜拜 Jebel Ali 與沙烏地 Dammam。",
    path: [
      { x: 780, y: 560 }, // 遠東進口方向（阿拉伯海東南）
      { x: 710, y: 500 },
      { x: 650, y: 450 }, // 阿曼外海
      { x: 625, y: 395 }, // 富吉拉外海
      { x: 615, y: 320 }, // 荷姆茲海峽進港 TSS 入口
      { x: 595, y: 305 }, // 海峽狹窄處
      { x: 565, y: 288 }, // 進入波斯灣內側
      { x: 535, y: 395 }, // 掛靠 Jebel Ali (杜拜)
      { x: 495, y: 405 }, // Khalifa Port (阿布達比)
      { x: 380, y: 360 }, // 中部航槽
      { x: 235, y: 305 }, // Dammam (達曼)
      { x: 200, y: 260 }  // Jubail (朱拜勒)
    ]
  },
  {
    id: "lane_europe",
    nameZh: "歐洲/地中海幹線 (Europe/Med Mainline)",
    code: "EU-ME",
    color: "#ff9900",
    flowSpeed: 22,
    strokeWidth: 3.2,
    dashArray: "10, 5",
    type: "mainline_europe",
    description: "連接西北歐（鹿特丹/漢堡）及地中海（熱那亞/比雷埃夫斯）。紅海危機期間大部分船舶繞經非洲好望角，由阿曼灣外海北上，經荷姆茲進港道停靠杜拜 Jebel Ali 與卡達 Hamad。",
    path: [
      { x: 740, y: 580 }, // 好望角/印度洋繞道來向
      { x: 670, y: 510 },
      { x: 635, y: 440 }, // 阿曼外海
      { x: 615, y: 320 }, // 荷姆茲進港 TSS
      { x: 595, y: 305 },
      { x: 565, y: 288 },
      { x: 535, y: 395 }, // Jebel Ali (杜拜)
      { x: 400, y: 385 },
      { x: 330, y: 390 }, // Hamad Port (卡達)
      { x: 235, y: 305 }  // Dammam (達曼)
    ]
  },
  {
    id: "lane_vlcc",
    nameZh: "VLCC 原油與 LNG 出口動脈 (Crude & Gas Export Artery)",
    code: "ENERGY-VLCC",
    color: "#ffd700",
    flowSpeed: 14,
    strokeWidth: 4.2,
    dashArray: "16, 8",
    type: "energy_export",
    description: "全球海運原油心臟！自伊拉克巴士拉、沙烏地拉斯塔努拉/朱拜勒及卡達拉斯拉凡 (LNG) 出港，走波斯灣中央深水航槽 (>20m)，經荷姆茲出港 TSS 駛向東亞（中日韓台）與西方。",
    path: [
      { x: 120, y: 150 }, // 巴士拉/伊拉克油港起點
      { x: 190, y: 240 }, // 沙烏地石油終端 (Ras Tanura / Jubail)
      { x: 325, y: 340 }, // 卡達 Ras Laffan (全球最大 LNG 出口港)
      { x: 450, y: 330 }, // 波斯灣中央深槽 (Deep Water Channel)
      { x: 540, y: 295 },
      { x: 575, y: 312 }, // 荷姆茲海峽出港 TSS (Outbound Lane)
      { x: 582, y: 330 },
      { x: 595, y: 350 }, // 駛出海峽南口
      { x: 630, y: 410 }, // 經富吉拉外海
      { x: 710, y: 510 },
      { x: 800, y: 590 }  // 通向印度洋與東亞原油航線
    ]
  },
  {
    id: "lane_feeder",
    nameZh: "灣內支線駁運 (Regional Feeders)",
    code: "FEEDER-GULF",
    color: "#00d2ff",
    flowSpeed: 20,
    strokeWidth: 2.2,
    dashArray: "6, 6",
    type: "feeder_network",
    description: "以杜拜 Jebel Ali 為樞紐母港，由 1,000~2,500 TEU 支線駁船接力分流至科威特舒威赫、伊拉克烏姆蓋斯爾、巴林、卡達及阿曼蘇哈爾港。",
    path: [
      { x: 535, y: 395 }, // 起點：Jebel Ali 母港
      { x: 330, y: 390 }, // -> 卡達 Hamad
      { x: 275, y: 320 }, // -> 巴林 KBSP
      { x: 235, y: 305 }, // -> 沙烏地 Dammam
      { x: 200, y: 260 }, // -> 朱拜勒 Jubail
      { x: 130, y: 180 }, // -> 往科威特航道
      { x: 95, y: 125 },  // -> 科威特 Shuwaikh
      { x: 90, y: 80 }    // -> 伊拉克 Umm Qasr
    ]
  },
  {
    id: "lane_adcop",
    nameZh: "阿聯酋哈布善—富吉拉陸上繞道油管 (ADCOP Overland Pipeline)",
    code: "ADCOP-PIPE",
    color: "#d946ef",
    flowSpeed: 0, // 陸上固定管線，高亮光暈脈動
    strokeWidth: 4.0,
    dashArray: "solid",
    type: "overland_pipeline",
    description: "阿布達比原油陸上繞道戰略生命線！全長 380 公里，起自內陸 Habshan 油田，橫穿阿聯酋陸地山脈直達荷姆茲海峽外的富吉拉港，每日將 150 萬桶原油直接裝船，徹底避開海峽軍事封鎖風險。",
    path: [
      { x: 440, y: 470 }, // 阿布達比內陸 Habshan 油田基地
      { x: 480, y: 445 },
      { x: 530, y: 425 },
      { x: 580, y: 405 }, // 穿越哈賈爾山脈
      { x: 620, y: 385 }  // 終點：富吉拉港 (Port of Fujairah - 阿曼灣)
    ]
  }
];
