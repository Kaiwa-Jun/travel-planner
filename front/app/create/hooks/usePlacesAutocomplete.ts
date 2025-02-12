"use client";

import { useState, useEffect } from "react";
import { sampleSpots, type Spot } from "@/data/spots";

// デバウンス用のカスタムフック
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const usePlacesAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<Spot[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Google Places APIのオートコンプリートをテストする関数
  const testGooglePlacesAutocomplete = async (input: string) => {
    try {
      // APIキーは環境変数から取得することを想定
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log("APIキー確認:", {
        apiKey: apiKey ? "設定されています" : "未設定です",
        apiKeyLength: apiKey?.length || 0,
      });

      console.log("Google Maps API確認:", {
        isGoogleDefined: typeof google !== "undefined",
        isMapsAvailable: typeof google?.maps !== "undefined",
        isPlacesAvailable: typeof google?.maps?.places !== "undefined",
        isAutocompleteServiceAvailable:
          typeof google?.maps?.places?.AutocompleteService !== "undefined",
      });

      // Google Places APIのJavaScript版を使用
      const service = new google.maps.places.AutocompleteService();
      console.log("AutocompleteService初期化:", {
        serviceInstance: service ? "成功" : "失敗",
      });

      const request = {
        input: input,
        types: ["geocode", "establishment"], // より広い検索範囲を設定
        language: "ja",
      };
      console.log("リクエストパラメータ:", request);

      console.log("Places API呼び出し開始");
      if (!service) {
        console.error("AutocompleteServiceが初期化されていません");
        return null;
      }

      if (!google?.maps?.places?.PlacesServiceStatus) {
        console.error("Places APIのステータス定数が見つかりません");
        return null;
      }

      const results = await new Promise((resolve, reject) => {
        try {
          console.log("getPlacePredictions呼び出し直前");
          service.getPlacePredictions(request, (predictions, status) => {
            console.log("コールバック開始 - ステータス:", status);

            if (predictions) {
              console.log("予測結果あり:", predictions.length + "件");
              resolve(predictions);
            } else {
              console.log("予測結果なし");
              resolve([]);
            }
          });
        } catch (error) {
          console.error("API呼び出しエラー:", error);
          reject(error);
        }
      });

      console.log("Places APIレスポンス:", results);
      return results;
    } catch (error) {
      console.error("Google Places API エラー詳細:", {
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack:
          error instanceof Error ? error.stack : "スタックトレースなし",
        error: error,
      });
      return null;
    }
  };

  // 入力値の変更を監視して検索処理を実行
  useEffect(() => {
    let isSubscribed = true;

    const fetchPredictions = async () => {
      console.log("デバウンス後の検索処理:", {
        入力値: debouncedSearchTerm,
        サジェスト表示: showSuggestions,
        フィルター前のスポット数: sampleSpots.length,
        フィルター後のスポット数: sampleSpots.filter((spot) =>
          spot.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ).length,
        選択中のインデックス: selectedIndex,
      });

      if (debouncedSearchTerm.length > 0) {
        try {
          if (isSubscribed) {
            const predictions = await testGooglePlacesAutocomplete(
              debouncedSearchTerm
            );

            // コンポーネントがアンマウントされていない場合のみ状態を更新
            if (isSubscribed && predictions) {
              // Google Places APIの結果を使用
              const placesResults = (
                predictions as google.maps.places.AutocompletePrediction[]
              ).map((prediction) => ({
                id: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                location: prediction.structured_formatting.secondary_text,
                image:
                  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80", // デフォルト画像
              }));

              // APIの結果とローカルのフィルタリング結果を組み合わせる
              const filtered = sampleSpots.filter((spot) =>
                spot.name
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
              );

              // 重複を避けるため、APIの結果を優先
              const combinedResults = [
                ...placesResults,
                ...filtered.filter(
                  (spot) =>
                    !placesResults.some(
                      (prediction) =>
                        prediction.name.toLowerCase() ===
                        spot.name.toLowerCase()
                    )
                ),
              ];

              setSuggestions(combinedResults);
              setShowSuggestions(combinedResults.length > 0);
              setSelectedIndex(-1);
            }
          }
        } catch (error) {
          console.error("Places API検索エラー:", error);
          // エラーが発生した場合でもローカルフィルタリングは実行
          if (isSubscribed) {
            const filtered = sampleSpots.filter((spot) =>
              spot.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedIndex(-1);
          }
        }
      } else if (isSubscribed) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    fetchPredictions();

    // クリーンアップ関数
    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearchTerm]);

  return {
    suggestions,
    showSuggestions,
    selectedIndex,
    setShowSuggestions,
    setSelectedIndex,
    setSearchTerm,
  };
};
