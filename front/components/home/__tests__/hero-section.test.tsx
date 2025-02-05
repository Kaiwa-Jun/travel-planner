import { render, screen } from "@testing-library/react";
import { HeroSection } from "../hero-section";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("HeroSection", () => {
  it("正しくレンダリングされること", () => {
    render(<HeroSection />);

    // ヘッドラインのテスト
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("あなたの完璧な旅を");
    expect(heading).toHaveTextContent("プランニング");

    // サブテキストのテスト
    expect(
      screen.getByText(
        "効率的な旅程作成から思い出の保存まで、旅のすべてをサポート"
      )
    ).toBeInTheDocument();

    // ボタンのテスト
    const searchButton = screen.getByRole("link", { name: "スポットを探す" });
    const loginButton = screen.getByRole("link", { name: "ログイン" });
    expect(searchButton).toHaveAttribute("href", "/search");
    expect(loginButton).toHaveAttribute("href", "/login");
  });
});
