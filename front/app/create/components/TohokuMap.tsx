import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { prefecturePositions } from "@/data/prefecture-positions";
import { MARKERS_UPDATE_EVENT } from "@/components/saved-plans";
import { useState, useEffect, useCallback } from "react";

type MapMarker = {
  prefectureCode: string;
  title: string;
};

type TohokuMapProps = {
  markers?: MapMarker[];
  onBackToNational: () => void;
  selectedPrefecture: string;
};

export const TohokuMap = ({
  markers: initialMarkers = [],
  onBackToNational,
  selectedPrefecture,
}: TohokuMapProps) => {
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
            selectedPrefecture === "3"
              ? "580 300 260 260"
              : selectedPrefecture === "5"
              ? "550 300 260 260"
              : "600 250 200 200"
          }
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>東北地方</title>
          <g
            className="prefectures"
            transform={
              selectedPrefecture === "3"
                ? "matrix(2.1, 0, 0, 2.1, -750, -420)"
                : selectedPrefecture === "5"
                ? "matrix(2.1, 0, 0, 2.1, -700, -420)"
                : "matrix(2.5, 0, 0, 2.5, -900, -450)"
            }
          >
            <g
              className="aomori tohoku prefecture"
              data-code="2"
              stroke-linejoin="round"
              fill="#EEEEEE"
              fill-rule="nonzero"
              stroke="#000000"
              stroke-width="1.0"
              transform="translate(624.000000, 287.000000)"
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
            >
              <title>秋田 / Akita</title>
              <polygon points="54 97 47 102 43 101 39 100 37 95 23 92 19 87 9 88 11 78 16 69 17 47 11 39 3 42 0 33 6 36 12 28 15 19 15 11 10 6 14 7 17 3 29 5 32 2 39 7 42 5 45 7 55 0 55 5 60 5 59 16 55 21 57 39 52 40 55 44 52 48 54 53 50 59 47 70 55 83 52 86 55 91" />
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
