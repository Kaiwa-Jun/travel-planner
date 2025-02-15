import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { prefecturePositions } from "@/data/prefecture-positions";
import { MARKERS_UPDATE_EVENT } from "@/components/saved-plans";
import { useState, useEffect, useCallback } from "react";

type MapMarker = {
  prefectureCode: string;
  title: string;
};

type KantoMapProps = {
  markers?: MapMarker[];
  onBackToNational: () => void;
  selectedPrefecture: string;
};

export const KantoMap = ({
  markers: initialMarkers = [],
  onBackToNational,
  selectedPrefecture,
}: KantoMapProps) => {
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

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

      const viewBox = svgElement.viewBox.baseVal;
      const svgRect = svgElement.getBoundingClientRect();

      // 拡大表示のための補正
      const matrixScale = 2.5;
      const translateX = -900;
      const translateY = -450;

      // マトリックス変換を適用
      const adjustedX = x * matrixScale + translateX;
      const adjustedY = y * matrixScale + translateY;

      return {
        x: `${((adjustedX - viewBox.x) / viewBox.width) * 100}%`,
        y: `${((adjustedY - viewBox.y) / viewBox.height) * 100}%`,
      };
    },
    [svgElement]
  );

  // 都道府県ごとにマーカーをグループ化
  const groupedMarkers = new Map<
    string,
    { count: number; markers: MapMarker[] }
  >();
  markers.forEach((marker) => {
    const existing = groupedMarkers.get(marker.prefectureCode);
    if (existing) {
      existing.count += 1;
      existing.markers.push(marker);
    } else {
      groupedMarkers.set(marker.prefectureCode, {
        count: 1,
        markers: [marker],
      });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-muted rounded-lg relative overflow-hidden"
    >
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
      <div className="w-full h-full">
        <svg
          ref={svgRef}
          className="geolonia-svg-map w-full h-full"
          viewBox={
            selectedPrefecture === "8"
              ? "600 550 220 220"
              : selectedPrefecture === "9"
              ? "580 530 200 200"
              : selectedPrefecture === "10"
              ? "530 540 260 260"
              : selectedPrefecture === "11"
              ? "550 590 260 260"
              : selectedPrefecture === "12"
              ? "600 600 260 260"
              : selectedPrefecture === "13"
              ? "560 620 260 260"
              : selectedPrefecture === "14"
              ? "560 630 260 260"
              : "600 550 200 200"
          }
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>関東地方</title>
          <g
            className="prefectures"
            transform={
              selectedPrefecture === "8"
                ? "matrix(2.8, 0, 0, 2.8, -1100, -1050)"
                : selectedPrefecture === "9"
                ? "matrix(3.2, 0, 0, 3.2, -1350, -1270)"
                : selectedPrefecture === "10"
                ? "matrix(2.1, 0, 0, 2.1, -700, -700)"
                : selectedPrefecture === "11"
                ? "matrix(2.1, 0, 0, 2.1, -700, -800)"
                : selectedPrefecture === "12"
                ? "matrix(2.1, 0, 0, 2.1, -800, -800)"
                : selectedPrefecture === "13"
                ? "matrix(2.1, 0, 0, 2.1, -750, -850)"
                : selectedPrefecture === "14"
                ? "matrix(2.1, 0, 0, 2.1, -750, -850)"
                : "matrix(2.5, 0, 0, 2.5, -900, -800)"
            }
          >
            <g
              className="kanagawa kanto prefecture"
              data-code="14"
              stroke-linejoin="round"
              fill="#EEEEEE"
              fill-rule="nonzero"
              stroke="#000000"
              stroke-width="1.0"
              transform="translate(584.000000, 656.000000)"
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
            >
              <title>茨城 / Ibaraki</title>
              <polygon points="5 54 5 54 2 55 0 48 7 45 8 41 11 41 14 36 25 34 28 27 26 17 29 15 28 12 28 1 38 10 44 4 44 0 54 5 46 29 47 35 44 42 46 52 51 61 49 63 51 66 52 62 60 74 42 62 42 65 24 69 13 64" />
            </g>
          </g>
        </svg>

        {/* マップマーカー */}
        <div className="absolute inset-0 pointer-events-none">
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
        </div>
      </div>
    </motion.div>
  );
};
