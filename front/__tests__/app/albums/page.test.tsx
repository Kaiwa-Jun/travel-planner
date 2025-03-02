import { render, screen, fireEvent } from "@testing-library/react";
import AlbumsPage from "@/app/albums/page";

// framer-motionをモック
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => <div {...props}>{children}</div>,
  },
}));

jest.mock("@/components/navigation", () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

// Next.jsのuseRouterをモック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

// テストデータ
const mockPlans = [
  {
    id: "1",
    title: "東京観光プラン",
    startDate: "2024-03-20",
    endDate: "2024-03-21",
    location: "東京",
    image: "test-image.jpg",
  },
  {
    id: "2",
    title: "京都旅行",
    startDate: "2024-03-25",
    endDate: "2024-03-26",
    location: "京都",
    image: "test-image.jpg",
  },
];

const mockPhotos = {
  "1": [{ url: "test-photo-1.jpg" }],
  "2": [{ url: "test-photo-2.jpg" }],
};

describe("AlbumsPage", () => {
  beforeEach(() => {
    // localStorageのモック
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    // テストデータをセット
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "savedPlans") {
        return JSON.stringify(mockPlans);
      }
      if (key === "planPhotos") {
        return JSON.stringify(mockPhotos);
      }
      return null;
    });
  });

  it("正しくページがレンダリングされる", () => {
    render(<AlbumsPage />);

    // ヘッダーの確認
    expect(
      screen.getByRole("heading", { name: "アルバム" })
    ).toBeInTheDocument();

    // タブの存在確認
    expect(screen.getByRole("button", { name: "全て" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "日付" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "場所" })).toBeInTheDocument();
  });

  it("アルバムカードが正しく表示される", () => {
    render(<AlbumsPage />);

    // サンプルアルバムのタイトルが表示されているか確認
    expect(screen.getByText("東京観光プラン")).toBeInTheDocument();
    expect(screen.getByText("京都旅行")).toBeInTheDocument();

    // 日付と場所の情報が表示されているか確認
    expect(screen.getByText(/3\/20\(水\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/東京/)[0]).toBeInTheDocument();
  });

  it("タブの切り替えが正しく動作する", () => {
    render(<AlbumsPage />);

    // 日付タブに切り替え
    fireEvent.click(screen.getByRole("button", { name: "日付" }));
    expect(screen.getByText("東京観光プラン")).toBeInTheDocument();

    // 場所タブに切り替え
    fireEvent.click(screen.getByRole("button", { name: "場所" }));
    expect(screen.getAllByText(/東京/)[0]).toBeInTheDocument();
  });

  it("アルバムが正しくグループ化される", () => {
    render(<AlbumsPage />);

    // 日付でのグループ化を確認
    fireEvent.click(screen.getByRole("button", { name: "日付" }));
    expect(screen.getByText("東京観光プラン")).toBeInTheDocument();
    expect(screen.getByText("京都旅行")).toBeInTheDocument();

    // 場所でのグループ化を確認
    fireEvent.click(screen.getByRole("button", { name: "場所" }));
    expect(screen.getAllByText(/東京/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/京都/)[0]).toBeInTheDocument();
  });
});
