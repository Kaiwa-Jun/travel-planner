import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HelloPage from "../app/hello/page";

// 各テスト実行前にグローバルなfetchをモック化
beforeEach(() => {
  // fetchが呼ばれた場合、"Hello from API"というテキストを返すようにする
  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve("Hello from API"),
    } as Response)
  ) as jest.Mock;
});

// テスト終了後、モックをリセット
afterEach(() => {
  jest.resetAllMocks();
});

describe("HelloPageコンポーネントのテスト", () => {
  test("初期表示とfetch後のメッセージ表示が正しい", async () => {
    // コンポーネントを描画
    render(<HelloPage />);

    // 初期表示の検証（タイトルがあるかどうか）
    expect(screen.getByText("Hello Page")).toBeInTheDocument();

    // 非同期処理の結果、fetchで返したテキストが表示されるかを待つ
    await waitFor(() => {
      expect(screen.getByText("Hello from API")).toBeInTheDocument();
    });

    // fetchが1回だけ呼ばれていることも確認
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("fetchでエラーが発生した場合のエラーメッセージが表示される", async () => {
    // fetchをエラーを返すように再設定
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch error"))
    );

    render(<HelloPage />);

    // エラーメッセージの表示を待つ
    await waitFor(() => {
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
