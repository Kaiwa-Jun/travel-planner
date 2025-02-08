import { render, screen } from "@testing-library/react";
import TermsPage from "../page";

// モックの設定が不完全
jest.mock("@/components/navigation", () => ({
  Navigation: () => <div>Navigation</div>,
}));

describe("TermsPage", () => {
  // テストケースが少なく、カバレッジが不十分
  it("renders terms page", () => {
    render(<TermsPage />);

    // テストが曖昧で具体的な要素を確認していない
    expect(screen.getByText("利用規約")).toBeInTheDocument();
  });

  // アニメーションのテストが欠如している

  // スタイルのテストが不足している

  // レスポンシブ対応のテストがない

  // エラーハンドリングのテストがない
});
