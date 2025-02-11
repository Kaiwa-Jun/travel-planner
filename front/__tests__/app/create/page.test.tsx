import { render, screen, fireEvent } from "@testing-library/react";
import CreatePlanPage from "@/app/create/page";
import { format } from "date-fns";

// モックの設定
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    h2: ({ children, whileHover, ...props }: any) => (
      <h2 {...props}>{children}</h2>
    ),
    h3: ({ children, whileHover, ...props }: any) => (
      <h3 {...props}>{children}</h3>
    ),
  },
}));

jest.mock("@/components/navigation", () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

// react-dndのモック
jest.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [{}, () => {}],
  DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

// HTML5のドラッグ&ドロップAPIをモック
const mockDataTransfer = {
  setData: jest.fn(),
  getData: jest.fn(),
};

Object.defineProperty(global, "DataTransfer", {
  value: jest.fn(() => mockDataTransfer),
});

describe("CreatePlanPage", () => {
  beforeEach(() => {
    // 日付をモック
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-20"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("正しくページがレンダリングされる", () => {
    render(<CreatePlanPage />);

    // ヘッダーの確認
    expect(
      screen.getByRole("heading", { name: "プラン作成" })
    ).toBeInTheDocument();

    // 初期スケジュールの確認
    expect(screen.getByText("東京スカイツリー")).toBeInTheDocument();
    expect(screen.getByText("浅草寺")).toBeInTheDocument();
    expect(screen.getByText("上野動物園")).toBeInTheDocument();

    // 編集ボタンをクリックして編集モードに入る
    const editButtons = screen.getAllByRole("button", { name: /編集/i });
    fireEvent.click(editButtons[0]);

    // フォームの存在確認
    expect(screen.getByPlaceholderText("スポット名")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("プランのタイトルを入力")
    ).toBeInTheDocument();
  });

  it("スケジュールを削除できる", () => {
    render(<CreatePlanPage />);

    // 削除前の要素数を確認
    const initialLocations = screen.getAllByText(/東京都/i);
    expect(initialLocations).toHaveLength(3);

    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByRole("button", { name: /削除/i });
    fireEvent.click(deleteButtons[0]);

    // 削除確認ダイアログの「削除」ボタンをクリック
    const confirmDeleteButton = screen.getByRole("button", { name: /削除/i });
    fireEvent.click(confirmDeleteButton);

    // 要素が削除されていることを確認
    const remainingLocations = screen.getAllByText(/東京都/i);
    expect(remainingLocations).toHaveLength(2);
  });

  it("日付でグループ化されている", () => {
    render(<CreatePlanPage />);

    // 日付ごとのグループヘッダーが存在することを確認
    expect(screen.getByText(/1月20日\(月\).*1日目/)).toBeInTheDocument();
    expect(screen.getByText(/1月21日\(火\).*2日目/)).toBeInTheDocument();

    // 各グループ内のアイテムを確認
    const scheduleItems = [
      { title: "東京スカイツリー", location: "東京都墨田区押上" },
      { title: "浅草寺", location: "東京都台東区浅草" },
      { title: "上野動物園", location: "東京都台東区上野公園" },
    ];

    scheduleItems.forEach(({ title, location }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(location)).toBeInTheDocument();
    });
  });

  it("プランのタイトルを設定できる", () => {
    render(<CreatePlanPage />);

    const titleInput = screen.getByPlaceholderText("プランのタイトルを入力");
    fireEvent.change(titleInput, { target: { value: "東京観光プラン" } });

    expect(titleInput).toHaveValue("東京観光プラン");
  });
});
