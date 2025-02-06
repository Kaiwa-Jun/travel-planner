import { render, screen } from "@testing-library/react";
import { UseCasesSection } from "../use-cases-section";

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

describe("UseCasesSection", () => {
  it("正しくレンダリングされること", () => {
    render(<UseCasesSection />);

    // メインヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("こんな時に便利です");

    // 説明文のテスト
    expect(
      screen.getByText(
        "あなたの旅のスタイルに合わせて、最適なサポートを提供します"
      )
    ).toBeInTheDocument();

    // 各ユースケースのテスト
    const useCases = [
      {
        title: "週末の日帰り旅行",
        features: [
          "近場のスポットを効率的に周遊",
          "時間を最大限活用できるルート設計",
          "グルメスポットも含めた最適プラン",
        ],
        image:
          "https://images.unsplash.com/photo-1533923156502-be31530547c4?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "長期休暇の旅行",
        features: [
          "複数日程の効率的な周遊プラン",
          "宿泊地を考慮したルート設計",
          "柔軟な予定変更にも対応",
        ],
        image:
          "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "思い出作り",
        features: [
          "写真を自動で整理",
          "位置情報と連携した記録",
          "SNSシェア用アルバム作成",
        ],
        image:
          "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=80",
      },
    ];

    // タイトルのテスト
    useCases.forEach((useCase) => {
      expect(
        screen.getByRole("heading", { name: useCase.title })
      ).toBeInTheDocument();
    });

    // 機能リストのテスト
    useCases.forEach((useCase) => {
      useCase.features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    // 画像の背景スタイルのテスト
    useCases.forEach((useCase) => {
      const imageContainer = document.querySelector(
        `[style*="background-image: url(${useCase.image})"]`
      );
      expect(imageContainer).toBeInTheDocument();
      expect(imageContainer).toHaveClass(
        "aspect-[16/9]",
        "bg-cover",
        "bg-center"
      );
    });

    // カードのコンテナのテスト
    const cards = document.querySelectorAll(".bg-card.rounded-lg");
    expect(cards).toHaveLength(3);
  });
});
