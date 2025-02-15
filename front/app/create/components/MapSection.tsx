"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { prefecturePositions } from "@/data/prefecture-positions";
import { MapPin } from "lucide-react";
import { MARKERS_UPDATE_EVENT } from "@/components/saved-plans";
import { TohokuMap } from "./TohokuMap";

type MapMarker = {
  prefectureCode: string;
  title: string;
};

type MapSectionProps = {
  markers?: MapMarker[];
};

export const MapSection = ({
  markers: initialMarkers = [],
}: MapSectionProps) => {
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(
    null
  );
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  // 都道府県クリックハンドラー
  const handlePrefectureClick = (code: string | null) => {
    setSelectedPrefecture(code);
  };

  // 全国地図に戻るハンドラー
  const handleBackToNational = () => {
    setSelectedPrefecture(null);
  };

  // マーカー更新イベントのリスナー
  useEffect(() => {
    const handleMarkersUpdate = (event: CustomEvent<MapMarker[]>) => {
      setMarkers(event.detail);
    };

    window.addEventListener(
      MARKERS_UPDATE_EVENT,
      handleMarkersUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        MARKERS_UPDATE_EVENT,
        handleMarkersUpdate as EventListener
      );
    };
  }, []);

  // SVG要素の参照を取得
  const svgRef = useCallback((node: SVGSVGElement) => {
    if (node !== null) {
      setSvgElement(node);
    }
  }, []);

  // SVG座標を相対位置に変換する関数
  const getRelativePosition = useCallback(
    (x: number, y: number) => {
      if (!svgElement) return null;

      // SVGのビューボックスを取得
      if (!svgElement || !svgElement.viewBox?.baseVal) return null;
      const viewBox = svgElement.viewBox.baseVal;

      // SVG要素の実際のサイズを取得
      const svgRect = svgElement.getBoundingClientRect();

      // スケール係数を計算
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;

      // 変換行列の情報を取得
      const transform = document
        .querySelector(".svg-map")
        ?.getAttribute("transform");

      // 回転とオフセットを適用した位置を計算
      let adjustedX = x;
      let adjustedY = y;

      // transform="matrix(1.028807, 0, 0, 1.028807, 200, -100) rotate(15, 500, 500)" の補正
      const matrixScale = 1.028807;
      const translateX = 200;
      const translateY = -100;
      const rotateAngle = 15;
      const rotateOriginX = 500;
      const rotateOriginY = 500;

      // マトリックス変換を適用
      adjustedX = adjustedX * matrixScale + translateX;
      adjustedY = adjustedY * matrixScale + translateY;

      // 回転の中心点からの相対位置を計算
      const dx = adjustedX - rotateOriginX;
      const dy = adjustedY - rotateOriginY;

      // 回転を適用
      const angle = (rotateAngle * Math.PI) / 180;
      const rotatedX =
        rotateOriginX + (dx * Math.cos(angle) - dy * Math.sin(angle));
      const rotatedY =
        rotateOriginY + (dx * Math.sin(angle) + dy * Math.cos(angle));

      return {
        x: `${(rotatedX / viewBox.width) * 100}%`,
        y: `${(rotatedY / viewBox.height) * 100}%`,
      };
    },
    [svgElement]
  );

  // 都道府県ごとにマーカーをグループ化
  const groupedMarkers = useMemo(() => {
    const groups = new Map<string, { count: number; markers: MapMarker[] }>();

    markers.forEach((marker) => {
      const existing = groups.get(marker.prefectureCode);
      if (existing) {
        existing.count += 1;
        existing.markers.push(marker);
      } else {
        groups.set(marker.prefectureCode, { count: 1, markers: [marker] });
      }
    });

    return groups;
  }, [markers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="aspect-[2/1] max-w-3xl bg-muted rounded-lg flex items-center justify-center p-4 relative"
    >
      {selectedPrefecture === "2" ||
      selectedPrefecture === "3" ||
      selectedPrefecture === "5" ? (
        <TohokuMap
          markers={markers}
          onBackToNational={handleBackToNational}
          selectedPrefecture={selectedPrefecture}
        />
      ) : (
        <>
          <style jsx>{`
            .prefecture {
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .prefecture:hover {
              fill: #d1d5db;
              stroke-width: 2;
            }
            .prefecture.active {
              fill: #9ca3af;
              stroke-width: 2;
            }
          `}</style>
          <svg
            ref={svgRef}
            className="geolonia-svg-map"
            viewBox="0 0 1400 900"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Japanese Prefectures</title>
            <desc>Created by Geolonia (https://geolonia.com/).</desc>
            <g
              className="svg-map"
              transform="matrix(1.028807, 0, 0, 1.028807, 200, -100) rotate(15, 500, 500)"
            >
              <g className="prefectures" transform="matrix(1, 0, 0, 1, 6, 18)">
                <g
                  className="hokkaido prefecture"
                  data-code="1"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(602.000000, 10.000000)"
                  onClick={() => handlePrefectureClick("1")}
                >
                  <title>北海道 / Hokkaido</title>
                  <path d="M4,240 L3,245 L0,246 L0,237 L6,235 L4,240 Z M33,261 L32,250 L28,243 L23,242 L21,237 L17,236 L15,231 L19,223 L17,212 L19,209 L28,207 L34,198 L37,202 L39,201 L43,192 L49,187 L39,173 L40,166 L47,164 L60,174 L71,171 L71,174 L78,177 L83,174 L89,165 L83,140 L86,135 L93,132 L97,126 L96,103 L100,95 L101,85 L98,67 L90,48 L93,39 L92,33 L94,36 L99,35 L105,28 L131,55 L139,68 L155,85 L184,104 L213,109 L214,113 L219,118 L238,118 L260,91 L262,96 L252,119 L252,129 L255,135 L265,138 L263,140 L264,137 L258,137 L263,149 L269,156 L273,157 L280,149 L287,148 L277,156 L275,163 L258,166 L256,172 L252,177 L247,177 L245,175 L246,173 L243,172 L240,178 L243,180 L228,181 L220,178 L205,186 L191,202 L182,216 L179,225 L180,240 L178,248 L164,237 L141,228 L113,211 L100,209 L103,206 L88,214 L72,230 L69,227 L73,227 L68,226 L66,220 L58,212 L47,213 L42,220 L39,230 L40,234 L52,242 L62,242 L71,254 L80,257 L82,260 L76,265 L72,267 L63,263 L60,265 L60,261 L57,260 L55,265 L48,269 L48,278 L40,282 L37,287 L30,284 L27,278 L28,269 L33,261 Z M71,48 L73,45 L77,47 L79,52 L75,55 L71,52 L71,48 Z M65,35 L65,33 L67,35 L66,45 L63,35 L65,35 Z M369,17 L367,13 L365,13 L363,17 L365,23 L364,26 L359,28 L357,35 L350,34 L351,41 L341,50 L341,54 L335,54 L335,56 L339,58 L339,62 L336,65 L332,64 L332,69 L329,66 L330,71 L327,78 L331,79 L336,70 L341,69 L346,59 L356,50 L358,40 L363,43 L369,41 L384,24 L397,15 L406,13 L407,10 L404,6 L407,2 L402,0 L396,2 L384,20 L373,22 L369,17 Z M290,99 L295,93 L303,91 L308,84 L311,85 L314,79 L304,82 L296,77 L293,79 L289,89 L280,104 L280,107 L266,122 L268,129 L273,128 L273,132 L274,119 L282,114 L283,109 L286,109 L287,102 L290,99 Z M322,125 L334,115 L329,113 L325,116 L326,117 L319,119 L319,123 L321,122 L322,125 Z M300,142 L304,137 L297,139 L300,142 Z M291,146 L293,143 L289,144 L291,146 Z" />
                </g>
                <g
                  className="aomori tohoku prefecture"
                  data-code="2"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(624.000000, 287.000000)"
                  onClick={() => handlePrefectureClick("2")}
                >
                  <title>青森 / Aomori</title>
                  <polygon points="3 71 3 63 0 60 6 51 12 51 18 47 21 31 17 27 20 26 21 19 27 23 31 20 35 23 37 38 40 45 46 41 45 37 47 33 58 42 61 39 65 23 61 16 55 22 41 25 47 0 64 11 73 6 71 37 73 51 77 62 81 61 86 67 80 74 75 72 71 75 69 72 56 82 52 81 53 70 48 70 48 65 38 72 35 70 32 72 25 67 22 70 10 68 7 72" />
                </g>
                <g
                  className="iwate tohoku prefecture"
                  data-code="3"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(664.000000, 354.000000)"
                  onClick={() => handlePrefectureClick("3")}
                >
                  <title>岩手 / Iwate</title>
                  <polygon points="48 92 41 91 39 105 33 102 29 107 23 103 25 99 17 100 7 95 8 89 5 84 8 81 0 68 3 57 7 51 5 46 8 42 5 38 10 37 8 19 12 14 16 15 29 5 31 8 35 5 40 7 46 0 54 11 52 16 57 19 55 23 61 28 64 43 62 53 65 49 66 54 68 55 62 60 64 62 67 59 67 63 63 63 63 68 60 69 65 68 60 71 62 73 60 75 64 74 58 81 62 83 57 83 60 86 57 86 59 88 53 89 52 86 54 91 52 91 52 94 50 90" />
                </g>
                <g
                  className="akita tohoku prefecture"
                  data-code="5"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(617.000000, 352.000000)"
                  onClick={() => handlePrefectureClick("5")}
                >
                  <title>秋田 / Akita</title>
                  <polygon points="54 97 47 102 43 101 39 100 37 95 23 92 19 87 9 88 11 78 16 69 17 47 11 39 3 42 0 33 6 36 12 28 15 19 15 11 10 6 14 7 17 3 29 5 32 2 39 7 42 5 45 7 55 0 55 5 60 5 59 16 55 21 57 39 52 40 55 44 52 48 54 53 50 59 47 70 55 83 52 86 55 91" />
                </g>
                {/* 他の都道府県のSVGパス */}
              </g>
            </g>
          </svg>

          {/* マップマーカー */}
          {Array.from(groupedMarkers.entries()).map(
            ([prefCode, { count, markers }]) => {
              const position = prefecturePositions.find(
                (p) => p.code === prefCode
              );
              if (!position) return null;

              const point = getRelativePosition(
                position.position.x,
                position.position.y
              );
              if (!point) return null;

              return (
                <motion.div
                  key={prefCode}
                  initial={{ scale: 0, y: -10 }}
                  animate={{
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    mass: 0.8,
                  }}
                  whileHover={{
                    scale: 1.2,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                  className="absolute z-10 group"
                  style={{
                    left: point.x,
                    top: point.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <MapPin className="w-5 h-5 text-primary" />
                      {count > 1 && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                          {count}
                        </div>
                      )}
                    </motion.div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-background border rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {markers.map((m) => m.title).join(", ")}
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </>
      )}
    </motion.div>
  );
};
