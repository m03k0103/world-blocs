import { useMemo } from 'react';
import type { Country, Framework, Language, StatIndicatorId } from '../../types';
import { COUNTRIES, getEntity } from '../../data/countries';
import {
  COUNTRY_STATS,
  formatStatValue,
  getChoroplethColor,
  INCOME_LEVEL_CONFIG,
} from '../../data/countryStats';
import type { CountryMapData } from '../WorldMap';
import { isFullMemberStatus } from '../../utils/entityUtils';

export interface IndicatorItem {
  country: Country;
  value: number | undefined;
  genderGapRank?: number;
  isIncludedInFramework: boolean;
}

export interface StatsAggregationResult {
  validCountries: Country[];
  regions: string[];
  worldTotals: {
    totalPop: number;
    totalGdp: number;
  };
  indicatorStatsData: {
    allList: IndicatorItem[];
    targetItems: IndicatorItem[];
    rankMap: Map<string, number>;
    minVal: number;
    maxVal: number;
    sumValue: number;
    countWithData: number;
    averageValue: number;
    targetTotalPop: number;
    targetTotalGdp: number;
    countHic: number;
    countUmic: number;
    countLmic: number;
    countLic: number;
    topItem: IndicatorItem | null;
    bottomItem: IndicatorItem | null;
  };
  mapDataMap: Record<string, CountryMapData>;
}

export function useStatsAggregation(
  activeIndicator: StatIndicatorId,
  selectedFramework: Framework | null,
  language: Language
): StatsAggregationResult {
  // 枠組み参加主体のうち、主権国家・特別実体の正式加盟国alpha3コード一覧
  const frameworkMemberCodes = useMemo(() => {
    if (!selectedFramework) return null;
    const set = new Set<string>();
    selectedFramework.members.forEach((m) => {
      if (isFullMemberStatus(m.status)) {
        const ent = getEntity(m.countryCode);
        if (ent && ent.entityType !== 'supranational' && ent.entityType !== 'regional_org') {
          set.add(m.countryCode);
        }
      }
    });
    return set;
  }, [selectedFramework]);

  // 全世界における有効国リスト（主権国家・特別実体）
  const validCountries = useMemo(() => {
    return COUNTRIES.filter(
      (c) =>
        c.alpha3 !== 'Cundefined' &&
        c.alpha3 !== 'ATA' &&
        c.alpha3 !== 'ATF' &&
        c.entityType !== 'supranational' &&
        c.entityType !== 'regional_org' &&
        c.entityType !== 'historical_state'
    );
  }, []);

  // 地域一覧
  const regions = useMemo(() => {
    const set = new Set<string>();
    validCountries.forEach((c) => {
      if (c.region) set.add(c.region);
    });
    return Array.from(set).sort();
  }, [validCountries]);

  // 全世界での合計値（シェア計算用）
  const worldTotals = useMemo(() => {
    let totalPop = 0;
    let totalGdp = 0;
    validCountries.forEach((c) => {
      const s = COUNTRY_STATS[c.alpha3];
      if (s) {
        if (s.population) totalPop += s.population;
        if (s.gdp) totalGdp += s.gdp;
      }
    });
    return { totalPop, totalGdp };
  }, [validCountries]);

  // 現在の指標における全有効国の値（最小値・最大値・順位計算用）
  const indicatorStatsData = useMemo(() => {
    const list: IndicatorItem[] = [];

    validCountries.forEach((country) => {
      const stats = COUNTRY_STATS[country.alpha3];
      const isIncluded = frameworkMemberCodes ? frameworkMemberCodes.has(country.alpha3) : true;
      let val: number | undefined;

      if (stats) {
        if (activeIndicator === 'population') val = stats.population;
        else if (activeIndicator === 'gdp') val = stats.gdp;
        else if (activeIndicator === 'gdp_per_capita') val = stats.gdpPerCapita;
        else if (activeIndicator === 'gender_gap') val = stats.genderGapScore;
        else if (activeIndicator === 'income_level') {
          val = stats.incomeLevel ? INCOME_LEVEL_CONFIG[stats.incomeLevel]?.order : undefined;
        }
      }

      list.push({
        country,
        value: val,
        genderGapRank: stats?.genderGapRank,
        isIncludedInFramework: isIncluded,
      });
    });

    // フィルタ対象内での有効数値リスト（順位付け用）
    const targetItems = list.filter((item) => item.isIncludedInFramework && item.value !== undefined);

    // 降順ソートで順位付け（ジェンダーギャップ・所得水準も数値が高いほど上位）
    targetItems.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const rankMap = new Map<string, number>();
    targetItems.forEach((item, index) => {
      rankMap.set(item.country.alpha3, index + 1);
    });

    // 最小値・最大値
    const values = targetItems.map((item) => item.value!).filter((v) => v > 0);
    const minVal = values.length > 0 ? Math.min(...values) : 0;
    const maxVal = values.length > 0 ? Math.max(...values) : 1;

    // 対象内での合計・加重平均・所得区分別カウント
    let sumValue = 0;
    let countWithData = 0;
    let targetTotalPop = 0;
    let targetTotalGdp = 0;
    let countHic = 0;
    let countUmic = 0;
    let countLmic = 0;
    let countLic = 0;

    targetItems.forEach((item) => {
      sumValue += item.value!;
      countWithData += 1;
      const s = COUNTRY_STATS[item.country.alpha3];
      if (s?.population) targetTotalPop += s.population;
      if (s?.gdp) targetTotalGdp += s.gdp;
      if (s?.incomeLevel === 'HIC') countHic += 1;
      else if (s?.incomeLevel === 'UMIC') countUmic += 1;
      else if (s?.incomeLevel === 'LMIC') countLmic += 1;
      else if (s?.incomeLevel === 'LIC') countLic += 1;
    });

    const averageValue = countWithData > 0 ? sumValue / countWithData : 0;

    return {
      allList: list,
      targetItems,
      rankMap,
      minVal,
      maxVal,
      sumValue,
      countWithData,
      averageValue,
      targetTotalPop,
      targetTotalGdp,
      countHic,
      countUmic,
      countLmic,
      countLic,
      topItem: targetItems.length > 0 ? targetItems[0] : null,
      bottomItem: targetItems.length > 0 ? targetItems[targetItems.length - 1] : null,
    };
  }, [validCountries, frameworkMemberCodes, activeIndicator]);

  // 地図描画用データマップ
  const mapDataMap = useMemo(() => {
    const map: Record<string, CountryMapData> = {};

    indicatorStatsData.allList.forEach(({ country, value, isIncludedInFramework }) => {
      const rank = indicatorStatsData.rankMap.get(country.alpha3);
      let shareStr: string | undefined;

      if (value !== undefined) {
        if (activeIndicator === 'population' && worldTotals.totalPop > 0) {
          const share = (value / worldTotals.totalPop) * 100;
          shareStr = `${share >= 0.1 ? share.toFixed(1) : '<0.1'}% (${language === 'ja' ? '世界シェア' : 'world'})`;
        } else if (activeIndicator === 'gdp' && worldTotals.totalGdp > 0) {
          const share = (value / worldTotals.totalGdp) * 100;
          shareStr = `${share >= 0.1 ? share.toFixed(1) : '<0.1'}% (${language === 'ja' ? '世界シェア' : 'world'})`;
        }
      }

      if (!isIncludedInFramework) {
        map[country.alpha3] = {
          isFilteredOut: true,
          statValue: value,
          statFormatted: formatStatValue(activeIndicator, value, language),
        };
      } else {
        const fill = getChoroplethColor(
          activeIndicator,
          value,
          indicatorStatsData.minVal,
          indicatorStatsData.maxVal,
          false
        );
        const hoverFill = getChoroplethColor(
          activeIndicator,
          value,
          indicatorStatsData.minVal,
          indicatorStatsData.maxVal,
          true
        );

        map[country.alpha3] = {
          customFill: fill,
          customHoverFill: hoverFill,
          statValue: value,
          statFormatted: formatStatValue(activeIndicator, value, language),
          statRank: rank,
          statShare: shareStr,
        };
      }
    });

    return map;
  }, [indicatorStatsData, activeIndicator, worldTotals, language]);

  return {
    validCountries,
    regions,
    worldTotals,
    indicatorStatsData,
    mapDataMap,
  };
}
