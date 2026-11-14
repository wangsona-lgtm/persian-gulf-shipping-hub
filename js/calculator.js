/**
 * 海峽繞道成本與航期互動試算器邏輯引擎 (Choke Point Detour & Cost Calculator)
 * 提供蘇伊士 vs 好望角、巴拿馬運河 vs 合恩角、荷姆茲海峽 vs 陸上油管三大真實量化模型
 */

class DetourCalculator {
  constructor() {
    this.currentScenario = 'suez_cape';
  }

  // 計算蘇伊士 vs 好望角繞道
  calculateSuezCape(params) {
    const {
      teuCapacity = 15000,
      loadFactor = 0.85,
      extraDays = 12,
      fuelPerDay = 95,
      fuelPrice = 620,
      charterCostPerDay = 45000,
      euEtsCost = 135000,
      suezTollSaved = 550000
    } = params;

    const actualTeu = teuCapacity * (loadFactor / 100);
    const extraFuelTons = extraDays * fuelPerDay;
    const extraFuelCost = extraFuelTons * fuelPrice;
    const extraCharterCost = extraDays * charterCostPerDay;
    const grossCost = extraFuelCost + extraCharterCost + euEtsCost;
    const netCost = grossCost - suezTollSaved;
    const costPerTeu = netCost / actualTeu;

    return {
      actualTeu: Math.round(actualTeu),
      extraDays,
      extraFuelTons: Math.round(extraFuelTons),
      extraFuelCost: Math.round(extraFuelCost),
      extraCharterCost: Math.round(extraCharterCost),
      euEtsCost: Math.round(euEtsCost),
      suezTollSaved: Math.round(suezTollSaved),
      grossCost: Math.round(grossCost),
      netCost: Math.round(netCost),
      costPerTeu: Math.round(costPerTeu * 10) / 10,
      absorbedCapacityPct: Math.round((extraDays / (35 + extraDays)) * 1000) / 10 // 吸收運力比率
    };
  }

  // 計算巴拿馬拍賣 vs 合恩角繞道
  calculatePanamaHorn(params) {
    const {
      auctionFee = 1500000,
      normalToll = 400000,
      detourDays = 18,
      dailyShipCost = 35000,
      detourFuelTons = 1200,
      fuelPrice = 620
    } = params;

    const directThroughCost = auctionFee + normalToll;
    const detourCharterCost = detourDays * dailyShipCost;
    const detourFuelCost = detourFuelTons * fuelPrice;
    const detourTotalCost = detourCharterCost + detourFuelCost;
    const savings = detourTotalCost - directThroughCost;

    return {
      directThroughCost: Math.round(directThroughCost),
      detourCharterCost: Math.round(detourCharterCost),
      detourFuelCost: Math.round(detourFuelCost),
      detourTotalCost: Math.round(detourTotalCost),
      savings: Math.round(savings),
      recommendation: savings > 0 ? "建議【參加拍賣直接通航】（繞道總代價高於拍賣費）" : "建議【繞道合恩角】（拍賣通行費過於昂貴）"
    };
  }

  // 計算荷姆茲戰險 vs ADCOP 油管
  calculateHormuzPipeline(params) {
    const {
      barrels = 2000000,
      hullValue = 120000000,
      warRiskRate = 0.35, // 0.35%
      pipelineTariff = 1.80 // 1.80 $/桶
    } = params;

    const warRiskPremium = hullValue * (warRiskRate / 100);
    const pipelineTotalCost = barrels * pipelineTariff;
    const warRiskCostPerBarrel = warRiskPremium / barrels;

    return {
      warRiskPremium: Math.round(warRiskPremium),
      warRiskCostPerBarrel: Math.round(warRiskCostPerBarrel * 100) / 100,
      pipelineTotalCost: Math.round(pipelineTotalCost),
      pipelineTariff
    };
  }
}

window.DetourCalculator = new DetourCalculator();
