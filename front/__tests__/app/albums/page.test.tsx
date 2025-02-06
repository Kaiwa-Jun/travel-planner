import { render, screen, fireEvent } from "@testing-library/react";
import AlbumsPage from "@/app/albums/page";

// モックの設定
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock("@/components/navigation", () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

describe("AlbumsPage", () => {
  it("正しくページがレンダリングされる", () => {
    render(<AlbumsPage />);

    // ヘッダーとボタンの確認
    expect(
      screen.getByRole("heading", { name: "アルバム" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /新規アルバム/i })
    ).toBeInTheDocument();

    // タブの存在確認
    expect(screen.getByRole("tab", { name: "すべて" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "日付" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "場所" })).toBeInTheDocument();
  });

  it("アルバムカードが正しく表示される", () => {
    render(<AlbumsPage />);

    // サンプルアルバムのタイトルが表示されているか確認
    expect(screen.getByText("東京スカイツリーと浅草散策")).toBeInTheDocument();
    expect(screen.getByText("大阪城と道頓堀グルメ")).toBeInTheDocument();

    // 日付と場所の情報が表示されているか確認
    expect(screen.getByText("2024/03/15")).toBeInTheDocument();
    expect(screen.getAllByText("東京")[0]).toBeInTheDocument();
  });

  it("タブの切り替えが正しく動作する", () => {
    render(<AlbumsPage />);

    // 日付タブに切り替え
    fireEvent.click(screen.getByRole("tab", { name: "日付" }));
    expect(screen.getByText("東京スカイツリーと浅草散策")).toBeInTheDocument();

    // 場所タブに切り替え
    fireEvent.click(screen.getByRole("tab", { name: "場所" }));
    expect(screen.getAllByText("東京").length).toBeGreaterThan(0);
  });

  it("アルバムが正しくグループ化される", () => {
    render(<AlbumsPage />);

    // 日付でのグループ化を確認
    fireEvent.click(screen.getByRole("tab", { name: "日付" }));
    expect(screen.getByText("東京スカイツリーと浅草散策")).toBeInTheDocument();
    expect(screen.getByText("大阪城と道頓堀グルメ")).toBeInTheDocument();

    // 場所でのグループ化を確認
    fireEvent.click(screen.getByRole("tab", { name: "場所" }));
    const locations = ["東京", "大阪", "名古屋", "仙台"];
    locations.forEach((location) => {
      expect(screen.getAllByText(location)[0]).toBeInTheDocument();
    });
  });
});
