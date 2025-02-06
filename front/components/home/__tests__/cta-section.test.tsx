import { render, screen } from "@testing-library/react";
import { CTASection } from "../cta-section";

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

describe("CTASection", () => {
  it("正しくレンダリングされること", () => {
    render(<CTASection />);

    // ヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("あなたの旅を、もっと素敵に");

    // 説明文のテスト
    expect(
      screen.getByText((content) =>
        content.includes("Travel Plannerで旅行計画を始めましょう。")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(
          "無料で簡単に、あなただけの思い出に残る旅行プランを作成できます。"
        )
      )
    ).toBeInTheDocument();

    // CTAボタンのテスト
    const createButton = screen.getByRole("link", { name: /プランを作成する/ });
    const searchButton = screen.getByRole("link", { name: "スポットを探す" });
    expect(createButton).toHaveAttribute("href", "/create");
    expect(searchButton).toHaveAttribute("href", "/search");

    // デバイスフレームのテスト
    // デスクトップフレーム
    const desktopFrame = document.querySelector(".hidden.md\\:block");
    expect(desktopFrame).toBeInTheDocument();
    expect(desktopFrame).toHaveClass(
      "bg-background",
      "rounded-lg",
      "shadow-xl"
    );

    // モバイルフレーム
    const mobileFrame = document.querySelector(".md\\:absolute");
    expect(mobileFrame).toBeInTheDocument();
    expect(mobileFrame).toHaveClass(
      "bg-background",
      "rounded-[2rem]",
      "shadow-xl"
    );
  });
});
