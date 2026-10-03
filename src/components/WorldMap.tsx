import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { COUNTRY_BY_NUMERIC } from '../data/countries';
import type { Country, MembershipStatus } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface CountryMapData {
  status?: MembershipStatus;
  notes?: string;
  year?: number;
  // 比較モード用フラグ
  inFrameworkA?: boolean;
  inFrameworkB?: boolean;
}

interface WorldMapProps {
  countryDataMap: Record<string, CountryMapData>; // キーは alpha3
  mode?: 'single' | 'compare';
  colorA?: string;
  colorB?: string;
  colorBoth?: string;
  labelA?: string;
  labelB?: string;
  onSelectCountry?: (country: Country) => void;
  selectedCountryAlpha3?: string | null;
}

interface HoverInfo {
  x: number;
  y: number;
  country: Country;
  data?: CountryMapData;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countryDataMap,
  mode = 'single',
  colorA = '#3b82f6', // 青
  colorB = '#ef4444', // 赤
  colorBoth = '#8b5cf6', // 紫
  labelA = '枠組みA',
  labelB = '枠組みB',
  onSelectCountry,
  selectedCountryAlpha3,
}) => {
  const [geographies, setGeographies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  // ズーム & パン状態
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 960;
  const height = 500;

  // TopoJSONデータ読み込み
  useEffect(() => {
    fetch('./data/countries-110m.json')
      .then(res => res.json())
      .then(topology => {
        const geojson: any = topojson.feature(topology, topology.objects.countries);
        setGeographies(geojson.features);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setLoading(false);
      });
  }, []);

  // D3 投影法の計算
  const projection = useMemo(() => {
    return d3Geo
      .geoNaturalEarth1()
      .scale(160)
      .translate([width / 2, height / 2 + 20]);
  }, [width, height]);

  const pathGenerator = useMemo(() => {
    return d3Geo.geoPath().projection(projection);
  }, [projection]);

  // 色判定関数
  const getCountryFill = useCallback(
    (alpha3: string, isHovered: boolean, isSelected: boolean) => {
      const data = countryDataMap[alpha3];

      if (isSelected) {
        return '#f97316'; // 選択中は鮮やかなオレンジ
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
      if (!data || !data.status) {
        return isHovered ? '#cbd5e1' : 'var(--map-neutral, #e2e8f0)';
      }

      switch (data.status) {
        case 'ratified':
          return isHovered ? '#1d4ed8' : '#2563eb'; // 濃い青
        case 'signed':
          return isHovered ? '#0284c7' : '#38bdf8'; // 水色
        case 'observer':
          return isHovered ? '#d97706' : '#f59e0b'; // 黄色・アンバー
        case 'dialogue':
          return isHovered ? '#7c3aed' : '#a78bfa'; // 薄紫
        case 'candidate':
          return isHovered ? '#059669' : '#10b981'; // エメラルドグリーン
        case 'withdrawn':
          return isHovered ? '#64748b' : '#94a3b8'; // スレートグレー
        default:
          return 'var(--map-neutral, #e2e8f0)';
      }
    },
    [countryDataMap, mode, colorA, colorB, colorBoth]
  );

  // マウスドラッグハンドラ
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 左クリックのみ
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ホイールズーム
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.83;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.8), 8));
  };

  // ズームコントロールボタン
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.3, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.3, 0.8));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[560px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner select-none">
      {/* ズーム操作コントロール */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
        <button
          onClick={handleZoomIn}
          title="拡大"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="縮小"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          title="位置と倍率をリセット"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full h-full text-slate-500 font-medium">
          世界地図データを読み込み中...
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
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
              const numericId = String(geo.id).padStart(3, '0');
              const country = COUNTRY_BY_NUMERIC[numericId];
              const alpha3 = country ? country.alpha3 : `C${numericId}`;
              const isSelected = selectedCountryAlpha3 === alpha3;
              const isHovered = hoverInfo?.country.alpha3 === alpha3;
              const path = pathGenerator(geo);
              if (!path) return null;

              return (
                <path
                  key={geo.id || idx}
                  d={path}
                  fill={getCountryFill(alpha3, isHovered, isSelected)}
                  stroke={isSelected ? '#c2410c' : '#ffffff'}
                  strokeWidth={isSelected ? 1.5 / zoom : 0.4 / zoom}
                  className="transition-colors duration-150 outline-none"
                  onMouseEnter={(e) => {
                    if (country) {
                      setHoverInfo({
                        x: e.clientX,
                        y: e.clientY,
                        country,
                        data: countryDataMap[alpha3],
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (hoverInfo && country) {
                      setHoverInfo({
                        x: e.clientX,
                        y: e.clientY,
                        country,
                        data: countryDataMap[alpha3],
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoverInfo(null);
                  }}
                  onClick={() => {
                    if (country && onSelectCountry) {
                      onSelectCountry(country);
                    }
                  }}
                />
              );
            })}
          </g>
        </svg>
      )}

      {/* ホバー時ツールチップ */}
      {hoverInfo && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-md transition-all duration-75 max-w-xs"
          style={{
            left: `${hoverInfo.x}px`,
            top: `${hoverInfo.y - 10}px`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{hoverInfo.country.flagEmoji || '🌐'}</span>
            <span className="font-bold text-sm">{hoverInfo.country.nameJa}</span>
            <span className="text-slate-400 text-[11px] font-mono">({hoverInfo.country.alpha3})</span>
          </div>

          {mode === 'compare' ? (
            <div className="space-y-1 pt-1 border-t border-slate-700/60">
              {hoverInfo.data?.inFrameworkA && hoverInfo.data?.inFrameworkB ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-purple-200 bg-purple-900/60">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  両方の枠組みに参加
                </div>
              ) : hoverInfo.data?.inFrameworkA ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-blue-200 bg-blue-900/60">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  {labelA || '枠組みA'} のみ参加
                </div>
              ) : hoverInfo.data?.inFrameworkB ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-red-200 bg-red-900/60">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {labelB || '枠組みB'} のみ参加
                </div>
              ) : (
                <div className="text-slate-400">いずれも非参加</div>
              )}
            </div>
          ) : (
            <div className="space-y-1 pt-1 border-t border-slate-700/60">
              {hoverInfo.data?.status ? (
                <>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-300">ステータス:</span>
                    <span className="font-semibold text-sky-300">
                      {hoverInfo.data.status === 'ratified' && '批准・加盟'}
                      {hoverInfo.data.status === 'signed' && '署名済（未批准）'}
                      {hoverInfo.data.status === 'observer' && 'オブザーバー'}
                      {hoverInfo.data.status === 'dialogue' && '対話パートナー'}
                      {hoverInfo.data.status === 'candidate' && '加盟申請・候補国'}
                      {hoverInfo.data.status === 'withdrawn' && '脱退・資格停止'}
                    </span>
                  </div>
                  {hoverInfo.data.year && (
                    <div className="text-slate-300">
                      加盟/批准年: <span className="font-semibold text-white">{hoverInfo.data.year}年</span>
                    </div>
                  )}
                  {hoverInfo.data.notes && (
                    <div className="text-slate-400 text-[11px] italic mt-0.5">
                      {hoverInfo.data.notes}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-slate-400">非加盟・非参加</div>
              )}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-1.5 border-t border-slate-800 pt-1">
            クリックで詳細を表示
          </div>
        </div>
      )}
    </div>
  );
};
