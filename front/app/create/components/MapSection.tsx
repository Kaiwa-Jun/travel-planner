"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { prefecturePositions } from "@/data/prefecture-positions";
import { MapPin } from "lucide-react";
import { MARKERS_UPDATE_EVENT } from "@/components/saved-plans";
import { TohokuMap } from "./TohokuMap";
import { KantoMap } from "./KantoMap";

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

  // 選択された都道府県が東北地方に属しているかどうかを判定
  const isSelectedPrefectureInTohoku = selectedPrefecture
    ? ["2", "3", "4", "5", "6", "7"].includes(selectedPrefecture)
    : false;

  // 選択された都道府県が関東地方に属しているかどうかを判定
  const isSelectedPrefectureInKanto = selectedPrefecture
    ? ["8", "9", "10", "11", "12", "13", "14"].includes(selectedPrefecture)
    : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="aspect-[2/1] max-w-3xl bg-muted rounded-lg flex items-center justify-center p-4 relative"
    >
      {isSelectedPrefectureInTohoku && selectedPrefecture ? (
        <TohokuMap
          markers={markers}
          onBackToNational={handleBackToNational}
          selectedPrefecture={selectedPrefecture}
        />
      ) : isSelectedPrefectureInKanto && selectedPrefecture ? (
        <KantoMap
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
                {/* 関東地方 */}
                <g
                  className="kanagawa kanto prefecture"
                  data-code="14"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(584.000000, 656.000000)"
                  onClick={() => handlePrefectureClick("14")}
                >
                  <title>神奈川 / Kanagawa</title>
                  <polygon points="10 0 24 6 28 11 28 6 30 6 27 4 30 2 44 9 40 13 36 12 39 16 36 16 36 23 42 26 38 30 39 33 35 33 36 28 33 24 26 22 15 25 11 28 12 34 10 34 4 30 4 17 0 17 9 9" />
                </g>
                <g
                  className="tokyo kanto prefecture"
                  data-code="13"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(585.000000, 642.000000)"
                  onClick={() => handlePrefectureClick("13")}
                >
                  <title>東京 / Tokyo</title>
                  <path d="M49,173 L49,178 L44,171 L49,173 Z M34,113 L32,115 L29,114 L31,111 L34,113 Z M11,104 L13,106 L11,107 L11,104 Z M18,98 L16,96 L18,92 L18,98 Z M22,75 L22,69 L26,70 L26,76 L22,75 Z M48,7 L49,12 L47,16 L41,15 L43,19 L39,20 L43,20 L43,23 L29,16 L26,18 L29,20 L27,20 L27,25 L23,20 L9,14 L4,11 L0,3 L3,0 L18,4 L23,8 L30,5 L30,9 L36,6 L40,7 L42,5 L48,7 Z" />
                </g>
                <g
                  className="chiba kanto prefecture"
                  data-code="12"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(627.000000, 629.000000)"
                  onClick={() => handlePrefectureClick("12")}
                >
                  <title>千葉 / Chiba</title>
                  <polygon points="5 29 7 25 6 20 6 13 0 0 8 10 19 15 37 11 37 8 55 20 55 24 45 24 34 35 32 57 19 61 7 75 0 71 5 69 3 66 4 63 3 58 5 53 1 49 4 45 7 46 7 42 13 39 18 33 11 26 6 30" />
                </g>
                <g
                  className="saitama kanto prefecture"
                  data-code="11"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(573.000000, 618.000000)"
                  onClick={() => handlePrefectureClick("11")}
                >
                  <title>埼玉 / Saitama</title>
                  <polygon points="48 4 49 5 51 12 54 11 54 11 60 24 60 31 54 29 52 31 48 30 42 33 42 29 35 32 30 28 15 24 12 27 1 24 0 19 16 10 21 0 32 2 38 6" />
                </g>
                <g
                  className="gunma kanto prefecture"
                  data-code="10"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(557.000000, 570.000000)"
                  onClick={() => handlePrefectureClick("10")}
                >
                  <title>群馬 / Gunma</title>
                  <polygon points="64 52 54 54 48 50 37 48 32 58 16 67 12 65 12 59 9 56 12 55 10 49 13 47 12 41 3 41 0 36 1 29 6 25 5 23 14 20 26 14 26 11 29 10 28 5 32 4 34 0 41 7 49 9 47 12 50 14 47 17 46 26 54 29 48 42 53 49 62 48" />
                </g>
                <g
                  className="tochigi kanto prefecture"
                  data-code="9"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(603.000000, 563.000000)"
                  onClick={() => handlePrefectureClick("9")}
                >
                  <title>栃木 / Tochigi</title>
                  <polygon points="19 60 18 59 16 55 7 56 2 49 8 36 0 33 1 24 4 21 1 19 3 16 28 0 40 3 46 7 47 13 47 24 48 27 45 29 47 39 44 46 33 48 30 53 27 53 26 57" />
                </g>
                <g
                  className="ibaraki kanto prefecture"
                  data-code="8"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(622.000000, 575.000000)"
                  onClick={() => handlePrefectureClick("8")}
                >
                  <title>茨城 / Ibaraki</title>
                  <polygon points="5 54 5 54 2 55 0 48 7 45 8 41 11 41 14 36 25 34 28 27 26 17 29 15 28 12 28 1 38 10 44 4 44 0 54 5 46 29 47 35 44 42 46 52 51 61 49 63 51 66 52 62 60 74 42 62 42 65 24 69 13 64" />
                </g>

                {/* 東北地方 */}
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
                <g
                  className="yamagata tohoku prefecture"
                  data-code="6"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(612.000000, 439.000000)"
                  onClick={() => handlePrefectureClick("6")}
                >
                  <title>山形 / Yamagata</title>
                  <polygon points="14 1 24 0 28 5 42 8 44 13 48 14 53 22 51 30 48 30 52 41 45 53 46 59 43 65 36 67 37 72 36 81 38 82 35 86 29 87 26 85 22 86 20 82 14 83 7 81 4 76 7 68 7 60 15 57 17 53 8 47 8 40 0 37 13 14" />
                </g>
                <g
                  className="miyagi tohoku prefecture"
                  data-code="4"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(648.000000, 445.000000)"
                  onClick={() => handlePrefectureClick("4")}
                >
                  <title>宮城 / Miyagi</title>
                  <path d="M33,70 L29,70 L29,76 L25,76 L26,78 L21,76 L20,70 L11,70 L7,66 L1,66 L0,61 L7,59 L10,53 L9,47 L16,35 L12,24 L15,24 L17,16 L12,8 L16,9 L23,4 L33,9 L41,8 L39,12 L45,16 L49,11 L55,14 L57,0 L64,1 L67,8 L62,5 L63,10 L59,14 L62,19 L60,17 L56,20 L60,22 L57,28 L61,28 L61,32 L58,30 L60,34 L57,35 L58,38 L61,37 L59,39 L61,41 L61,45 L57,43 L58,40 L55,41 L57,39 L56,37 L39,40 L36,43 L40,45 L35,46 L38,47 L32,57 L33,70 Z M43,41 L44,43 L42,43 L43,41 Z" />
                </g>
                <g
                  className="fukushima tohoku prefecture"
                  data-code="7"
                  stroke-linejoin="round"
                  fill="#EEEEEE"
                  fill-rule="nonzero"
                  stroke="#000000"
                  stroke-width="1.0"
                  transform="translate(594.000000, 511.000000)"
                  onClick={() => handlePrefectureClick("7")}
                >
                  <title>福島 / Fukushima</title>
                  <polygon points="82 69 72 64 72 68 66 74 56 65 55 59 49 55 37 52 12 68 4 66 5 52 0 47 4 41 2 37 3 34 12 33 13 30 21 30 19 21 28 11 25 9 32 11 38 10 40 14 44 13 47 15 53 14 56 10 54 9 55 0 61 0 65 4 74 4 75 10 80 12 79 10 83 10 83 4 87 4 93 18 93 45 91 61" />
                </g>
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
