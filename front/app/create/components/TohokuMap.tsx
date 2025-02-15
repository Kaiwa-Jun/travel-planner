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
              : selectedPrefecture === "4"
              ? "580 420 220 220"
              : selectedPrefecture === "6"
              ? "550 450 260 260"
              : selectedPrefecture === "7"
              ? "530 450 220 220"
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
                : selectedPrefecture === "4"
                ? "matrix(2.5, 0, 0, 2.5, -1000, -700)"
                : selectedPrefecture === "6"
                ? "matrix(2.1, 0, 0, 2.1, -700, -450)"
                : selectedPrefecture === "7"
                ? "matrix(2.5, 0, 0, 2.5, -950, -800)"
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
            <g
              className="yamagata tohoku prefecture"
              data-code="6"
              stroke-linejoin="round"
              fill="#EEEEEE"
              fill-rule="nonzero"
              stroke="#000000"
              stroke-width="1.0"
              transform="translate(612.000000, 439.000000)"
              onClick={onBackToNational}
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
              onClick={onBackToNational}
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
              onClick={onBackToNational}
            >
              <title>福島 / Fukushima</title>
              <polygon points="82 69 72 64 72 68 66 74 56 65 55 59 49 55 37 52 12 68 4 66 5 52 0 47 4 41 2 37 3 34 12 33 13 30 21 30 19 21 28 11 25 9 32 11 38 10 40 14 44 13 47 15 53 14 56 10 54 9 55 0 61 0 65 4 74 4 75 10 80 12 79 10 83 10 83 4 87 4 93 18 93 45 91 61" />
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
