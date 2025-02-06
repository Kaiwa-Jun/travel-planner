import { render, screen } from "@testing-library/react";
import { PopularPlansSection } from "../popular-plans-section";

// Mock framer-motion with proper motion component handling
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => (
      <div data-motion-while-hover={whileHover ? "true" : "false"} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock FadeInSection component
jest.mock("../fade-in-section", () => ({
  FadeInSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("PopularPlansSection", () => {
  it("正しくレンダリングされること", () => {
    render(<PopularPlansSection />);

    // メインヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("人気のプラン");

    // プランカードのテスト
    const planTitles = screen.getAllByRole("heading", { level: 3 });
    expect(planTitles).toHaveLength(3); // 3つのプランカードが存在することを確認
    planTitles.forEach((title) => {
      expect(title).toHaveTextContent("東京2日間モデルコース");
    });

    // プランの説明文のテスト
    const planDescriptions = screen.getAllByText(
      "浅草寺から始まり、スカイツリー、渋谷、原宿を巡る定番コース"
    );
    expect(planDescriptions).toHaveLength(3);

    // カードのコンテナのテスト
    const cards = document.querySelectorAll(".bg-card.rounded-lg");
    expect(cards).toHaveLength(3);

    // サムネイル画像プレースホルダーのテスト
    const thumbnails = document.querySelectorAll(".aspect-video");
    expect(thumbnails).toHaveLength(3);
  });
});
