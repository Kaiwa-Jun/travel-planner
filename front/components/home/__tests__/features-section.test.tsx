import { render, screen } from "@testing-library/react";
import { FeaturesSection } from "../features-section";

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

describe("FeaturesSection", () => {
  it("正しくレンダリングされること", () => {
    render(<FeaturesSection />);

    // メインヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("簡単3ステップで旅行計画");

    // 説明文のテスト
    expect(
      screen.getByText(
        "Travel Plannerなら、旅行の計画から思い出作りまでをシンプルな3ステップで実現できます"
      )
    ).toBeInTheDocument();

    // 各フィーチャーのテスト
    const features = [
      {
        title: "スポット検索",
        description: "日本全国の観光スポットを簡単に検索",
      },
      {
        title: "プラン作成",
        description: "効率的な旅行プランを作成",
      },
      {
        title: "思い出を保存",
        description: "旅の思い出をアルバムで管理",
      },
    ];

    features.forEach((feature) => {
      // タイトルのテスト
      expect(
        screen.getByRole("heading", { name: feature.title })
      ).toBeInTheDocument();
      // 説明文のテスト
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });

    // 矢印アイコンのテスト（最後のフィーチャーを除く各フィーチャーの後に表示）
    const arrows = document.querySelectorAll(".hidden.md\\:block");
    expect(arrows).toHaveLength(features.length - 1); // 最後のフィーチャーの後には矢印なし
  });
});
