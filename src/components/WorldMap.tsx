import React, { useState, useMemo, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import countriesTopology from '../data/countries-110m.json';
import { COUNTRY_BY_NUMERIC, COUNTRY_BY_ALPHA3, getEntity, HISTORICAL_ENTITY_BY_ALPHA3 } from '../data/countries';
import type { Country, MembershipStatus, HistoricalEntity } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isNonStateParticipant, NON_STATE_ENTITY_COLOR, NON_STATE_ENTITY_HOVER_COLOR } from '../utils/entityUtils';
import { useSvgZoomPan } from '../hooks/useSvgZoomPan';
import { MapTooltip, type HoverInfo } from './map/MapTooltip';
import { MapEntityBadges } from './map/MapEntityBadges';

// TopoJSONをGeoJSON feature配列へ型安全に変換（モジュールロード時に1度だけ実行）
const topology = countriesTopology as unknown as Topology;
const geojson = topojson.feature(
  topology,
  topology.objects.countries
) as unknown as { features: Feature<Geometry, { name?: string }>[] };
const defaultGeographies = geojson.features;

export interface CountryMapData {
  status?: MembershipStatus;
  notes?: string;
  year?: number;
  // 比較モード用フラグ
  inFrameworkA?: boolean;
  inFrameworkB?: boolean;
  // コロプレス（統計）モード用プロパティ
  statValue?: number;
  statFormatted?: string;
  statRank?: number;
  statShare?: string;
  customFill?: string;
  customHoverFill?: string;
  isFilteredOut?: boolean;
}

interface WorldMapProps {
  countryDataMap: Record<string, CountryMapData>; // キーは alpha3
  mode?: 'single' | 'compare' | 'choropleth';
  colorA?: string;
  colorB?: string;
  colorBoth?: string;
  labelA?: string;
  labelB?: string;
  statIndicatorName?: string;
  onSelectCountry?: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
  hasFrameworkSelected?: boolean;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countryDataMap,
  mode = 'single',
  colorA = '#3b82f6', // 青
  colorB = '#ef4444', // 赤
  colorBoth = '#8b5cf6', // 紫
  labelA = '枠組みA',
  labelB = '枠組みB',
  statIndicatorName,
  onSelectCountry,
  selectedCountryAlpha3,
  hasFrameworkSelected = true,
}) => {
  const { t, language } = useLanguage();
  const geographies = defaultGeographies;
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  // ズーム & パン制御カスタムフック
  const {
    zoom,
    pan,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleReset,
  } = useSvgZoomPan({ minZoom: 0.8, maxZoom: 8, initialZoom: 1 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 960;
  const height = 500;

  // D3 投影法の計算（イコールアース図法: Equal Earth projection）
  const projection = useMemo(() => {
    return d3Geo
      .geoEqualEarth()
      .scale(172)
      .translate([width / 2, height / 2 + 10]);
  }, [width, height]);

  const pathGenerator = useMemo(() => {
    return d3Geo.geoPath().projection(projection);
  }, [projection]);

  // 地図上のポリゴンに存在する alpha3 の集合
  const mappedAlpha3Set = useMemo(() => {
    const set = new Set<string>();
    geographies.forEach((geo) => {
      const numericId = String(geo.id).padStart(3, '0');
      const country = COUNTRY_BY_NUMERIC[numericId];
      if (country) {
        set.add(country.alpha3);
      }
    });
    return set;
  }, [geographies]);

  // 歴史的主体の後継国家ポリゴンマッピング (SUN -> RUS, DDR -> DEU, CSK -> CZE/SVK 等)
  const historicalSuccessorMap = useMemo(() => {
    const map: Record<string, { historicalEntity: HistoricalEntity; data: CountryMapData }> = {};
    Object.entries(countryDataMap).forEach(([code, data]) => {
      const historical = HISTORICAL_ENTITY_BY_ALPHA3[code];
      if (historical && (data.status || data.inFrameworkA || data.inFrameworkB)) {
        historical.succession.successorCodes.forEach((succCode) => {
          // すでに直接の国家データが存在しない場合のみ代理マッピング
          if (!countryDataMap[succCode]?.status) {
            map[succCode] = { historicalEntity: historical, data };
          }
        });
      }
    });
    return map;
  }, [countryDataMap]);

  // 地域統合体・非国家メンバー（EUR: 欧州連合, AFU: アフリカ連合 等の動的抽出）
  const regionalBlocMembers = useMemo(() => {
    const list: { country: Country; data: CountryMapData }[] = [];
    Object.entries(countryDataMap).forEach(([code, data]) => {
      if (!data.status && !data.inFrameworkA && !data.inFrameworkB) return;
      const entity = getEntity(code);
      if (entity && (entity.entityType === 'supranational' || entity.entityType === 'regional_org')) {
        list.push({ country: entity as Country, data });
      }
    });
    return list;
  }, [countryDataMap]);

  // 低解像度 TopoJSON 110m でポリゴンが存在しない参加国・小島嶼国（SGP, MLT, VAT, AND, MCO, LIE等）
  const microstateMembers = useMemo(() => {
    const list: { country: Country; data: CountryMapData }[] = [];
    Object.entries(countryDataMap).forEach(([alpha3, data]) => {
      if (!data.status && !data.inFrameworkA && !data.inFrameworkB) return;
      const entity = getEntity(alpha3);
      if (!entity) return;
      // 超国家機関、地域組織、歴史的国家は小国リストから除外
      if (
        entity.entityType === 'supranational' ||
        entity.entityType === 'regional_org' ||
        entity.entityType === 'historical_state'
      ) {
        return;
      }
      if (!mappedAlpha3Set.has(alpha3)) {
        list.push({ country: entity as Country, data });
      }
    });
    return list.sort((a, b) => a.country.nameJa.localeCompare(b.country.nameJa, 'ja'));
  }, [countryDataMap, mappedAlpha3Set]);

  // 色判定関数
  const getCountryFill = useCallback(
    (alpha3: string, isHovered: boolean, isSelected: boolean) => {
      const directData = countryDataMap[alpha3];
      const fallback = historicalSuccessorMap[alpha3];
      const data = directData || fallback?.data;

      if (isSelected) {
        return '#f97316'; // 選択中は鮮やかなオレンジ
      }

      if (mode === 'choropleth') {
        if (data?.isFilteredOut) {
          return isHovered ? '#cbd5e1' : 'var(--map-neutral, #e2e8f0)';
        }
        if (data?.customFill) {
          return isHovered ? (data.customHoverFill || '#0ea5e9') : data.customFill;
        }
        return isHovered ? '#cbd5e1' : 'var(--map-neutral, #e2e8f0)';
      }

      if (mode === 'compare') {
        if (data?.inFrameworkA && data?.inFrameworkB) {
          return isHovered ? '#7c3aed' : colorBoth; // 両方
        }
        if (data?.inFrameworkA) {
          return isHovered ? '#2563eb' : colorA; // Aのみ
        }
        if (data?.inFrameworkB) {
          return isHovered ? '#dc2626' : colorB; // Bのみ
        }
        return isHovered ? '#cbd5e1' : 'var(--map-neutral, #e2e8f0)';
      }

      // 単一枠組みモード
      // 非国家主体（EU, AU 等）の場合は主権国家と区別して専用色（パープル）を適用
      if (isNonStateParticipant(alpha3)) {
        return isHovered ? NON_STATE_ENTITY_HOVER_COLOR : NON_STATE_ENTITY_COLOR;
      }
      if (!data || !data.status) {
        return isHovered ? '#cbd5e1' : 'var(--map-neutral, #e2e8f0)';
      }

      switch (data.status) {
        case 'member':
          return isHovered ? '#1d4ed8' : '#2563eb'; // ロイヤルブルー（正式加盟・メンバー）
        case 'party':
        case 'ratified':
          return isHovered ? '#4338ca' : '#4f46e5'; // インディゴ（条約締約国）
        case 'participating_state':
          return isHovered ? '#0369a1' : '#0284c7'; // ディープスカイブルー（参加国）
        case 'non_state_member':
        case 'non_state_party':
          return isHovered ? '#7c3aed' : '#8b5cf6'; // パープル（非国家参加者）
        case 'signatory':
        case 'signed':
          return isHovered ? '#0284c7' : '#38bdf8'; // ライトスカイブルー（署名国）
        case 'unsigned':
          return isHovered ? '#e11d48' : '#f43f5e'; // ローズレッド（署名撤回）
        case 'candidate':
          return isHovered ? '#059669' : '#10b981'; // エメラルドグリーン（候補国）
        case 'partner':
          return isHovered ? '#7c3aed' : '#8b5cf6'; // バイオレット（パートナー国）
        case 'dialogue':
          return isHovered ? '#8b5cf6' : '#a78bfa'; // ライトバイオレット（対話パートナー）
        case 'observer':
          return isHovered ? '#d97706' : '#f59e0b'; // 黄色・アンバー（オブザーバー）
        case 'suspended':
          return isHovered ? '#9a3412' : '#c2410c'; // 赤褐色・アンバー濃（資格停止）
        case 'withdrawn':
          return isHovered ? '#475569' : '#64748b'; // スレートグレー（脱退）
        case 'non_party':
        case 'non-party':
          return isHovered ? '#94a3b8' : '#cbd5e1'; // ニュートラルグレー（非当事国）
        default:
          return 'var(--map-neutral, #e2e8f0)';
      }
    },
    [countryDataMap, historicalSuccessorMap, mode, colorA, colorB, colorBoth]
  );

  return (
    <div className="relative w-full h-[480px] lg:h-[560px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner select-none">
      {/* ズーム操作コントロール */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
        <button
          onClick={handleZoomIn}
          title={t('mapZoomIn')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          title={t('mapZoomOut')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          title={t('mapReset')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 左上フローティングパネル：地域組織・非国家参加 & 地図未表示の参加国 */}
      <MapEntityBadges
        regionalBlocMembers={regionalBlocMembers}
        microstateMembers={microstateMembers}
        selectedCountryAlpha3={selectedCountryAlpha3}
        onSelectCountry={onSelectCountry}
        getCountryFill={getCountryFill}
        mode={mode}
        labelA={labelA}
        labelB={labelB}
        language={language}
      />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoverInfo(null);
        }}
        onWheel={handleWheel}
      >
        {/* 海洋の背景 */}
        <rect width={width} height={height} fill="transparent" />

        {/* グリッド/経緯度線の装飾 */}
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
        >
          {/* 国境の描画 */}
          {geographies.map((geo, idx) => {
            const path = pathGenerator(geo);
            const numericId = String(geo.id).padStart(3, '0');
            const country = COUNTRY_BY_NUMERIC[numericId];
            const alpha3 = country ? country.alpha3 : `C${numericId}`;
            const isSelected = selectedCountryAlpha3 === alpha3;
            const isHovered = hoverInfo?.country.alpha3 === alpha3;

            // 後継国家コンテキスト (SUN, DDR, CSK 等の代理ポリゴン)
            const successorContext = historicalSuccessorMap[alpha3];
            const displayEntity = successorContext ? successorContext.historicalEntity : country;

            const fill = getCountryFill(alpha3, isHovered, isSelected);

            const directData = countryDataMap[alpha3];
            const mapData = directData || successorContext?.data;
            const hasData = hasFrameworkSelected
              ? Boolean(mapData && (mapData.status || mapData.inFrameworkA || mapData.inFrameworkB || (mode === 'choropleth' && mapData.statValue !== undefined)))
              : true;

            return (
              <path
                key={geo.id || idx}
                d={path || ''}
                fill={fill}
                stroke={isSelected ? '#ea580c' : isHovered ? '#64748b' : 'var(--map-border, #94a3b8)'}
                strokeWidth={isSelected ? 2 / zoom : isHovered ? 1.5 / zoom : 0.5 / zoom}
                className={`transition-colors duration-150 ${
                  hasData ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                }`}
                onMouseEnter={(e) => {
                  if (displayEntity) {
                    setHoverInfo({
                      x: e.clientX,
                      y: e.clientY,
                      country: country || (displayEntity as Country),
                      data: mapData,
                      historicalContext: successorContext
                        ? {
                            entity: successorContext.historicalEntity,
                            isSuccessor: true,
                          }
                        : undefined,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  if (hoverInfo) {
                    setHoverInfo((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                  }
                }}
                onMouseLeave={() => setHoverInfo(null)}
                onClick={() => {
                  if (displayEntity && onSelectCountry) {
                    const targetEntity = COUNTRY_BY_ALPHA3[alpha3] || displayEntity;
                    onSelectCountry(targetEntity as Country);
                  }
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* ホバー時ツールチップ */}
      <MapTooltip
        hoverInfo={hoverInfo}
        mode={mode}
        labelA={labelA}
        labelB={labelB}
        statIndicatorName={statIndicatorName}
        language={language}
      />
    </div>
  );
};
