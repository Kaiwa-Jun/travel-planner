import { render, screen } from "@testing-library/react";
import { BenefitsSection } from "../benefits-section";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock FadeInSection component
jest.mock("../fade-in-section", () => ({
  FadeInSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("BenefitsSection", () => {
  it("正しくレンダリングされること", () => {
    render(<BenefitsSection />);

    // メインヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("旅行がもっと楽しくなる");

    // サブテキストのテスト
    expect(
      screen.getByText(
        "Travel Plannerを使えば、旅行の計画から思い出作りまで、すべてがスムーズに。 あなたの旅をより良いものにする機能が満載です。"
      )
    ).toBeInTheDocument();

    // 各ベネフィットのテスト
    const benefitTitles = [
      "時間を効率的に",
      "迷わない旅行計画",
      "思い出をカタチに",
      "みんなでシェア",
      "おすすめスポット",
      "カスタマイズ自由",
    ];

    const benefitDescriptions = [
      "最適なルート提案で移動時間を最小限に。より多くの観光スポットを効率よく巡ることができます。",
      "地図ベースの直感的なプランニングで、移動経路や所要時間が一目瞭然。初めての場所でも安心です。",
      "写真と位置情報を連携し、旅の記録を自動で整理。後から見返すのも簡単です。",
      "作成したプランを共有して、友達や家族と一緒に旅行を計画できます。",
      "人気スポットや穴場情報をAIが提案。新しい発見のある旅行を実現します。",
      "予算や時間に合わせて柔軟にプランを調整。あなたにぴったりの旅行プランを作成できます。",
    ];

    benefitTitles.forEach((title) => {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });

    benefitDescriptions.forEach((description) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });
});
