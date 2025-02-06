import { render, screen } from "@testing-library/react";
import { PopularSpots, popularSpots } from "../popular-spots";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock Swiper components
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: any) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

// Mock Swiper modules
jest.mock("swiper/modules", () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
}));

// Mock Swiper CSS imports
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));

describe("PopularSpots", () => {
  it("正しくレンダリングされること", () => {
    render(<PopularSpots />);

    // タイトルのテスト
    expect(screen.getByText("人気のスポット")).toBeInTheDocument();

    // 全てのスポットが表示されていることを確認
    popularSpots.forEach((spot) => {
      // スポット名のテスト
      expect(screen.getByText(spot.name)).toBeInTheDocument();

      // 場所のテスト
      expect(screen.getByText(spot.location)).toBeInTheDocument();

      // 評価のテスト
      const ratings = screen.getAllByText(spot.rating.toString());
      expect(ratings.length).toBeGreaterThan(0);

      // 説明のテスト
      expect(screen.getByText(spot.description)).toBeInTheDocument();
    });

    // Swiperスライドの数が正しいことを確認
    const slides = screen.getAllByTestId("swiper-slide");
    expect(slides).toHaveLength(popularSpots.length);
  });

  it("className propが正しく適用されること", () => {
    const testClass = "test-class";
    render(<PopularSpots className={testClass} />);

    const container = screen.getByText("人気のスポット").parentElement;
    expect(container).toHaveClass(testClass);
  });

  it("各スポットカードが必要な要素を含んでいること", () => {
    render(<PopularSpots />);

    // 最初のスポットの詳細をテスト
    const firstSpot = popularSpots[0];

    // 画像のスタイルをテスト
    const imageContainer = document.querySelector(
      `[style*="background-image: url(${firstSpot.image})"]`
    );
    expect(imageContainer).toBeInTheDocument();

    // アイコンの存在を確認
    const starIcon = document.querySelector(".text-yellow-500 svg");
    expect(starIcon).toBeInTheDocument();

    const locationIcon = document.querySelector(".text-muted-foreground svg");
    expect(locationIcon).toBeInTheDocument();
  });
});
