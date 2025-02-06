import { render, screen, fireEvent } from "@testing-library/react";
import CreatePlanPage from "@/app/create/page";
import { format } from "date-fns";

// モックの設定
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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

    // フォームの存在確認
    expect(screen.getByPlaceholderText("タイトル")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("場所")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /スケジュールを追加/i })
    ).toBeInTheDocument();
  });

  it("新しいスケジュールを追加できる", () => {
    render(<CreatePlanPage />);

    // フォームに値を入力
    const dateInput = screen.getByDisplayValue(
      format(new Date(), "yyyy-MM-dd")
    );
    const timeInput = screen.getByPlaceholderText("時間");
    const titleInput = screen.getByPlaceholderText("タイトル");
    const locationInput = screen.getByPlaceholderText("場所");

    fireEvent.change(dateInput, { target: { value: "2024-03-21" } });
    fireEvent.change(timeInput, { target: { value: "14:00" } });
    fireEvent.change(titleInput, { target: { value: "新宿御苑" } });
    fireEvent.change(locationInput, { target: { value: "東京都新宿区" } });

    // フォームを送信
    const submitButton = screen.getByRole("button", {
      name: /スケジュールを追加/i,
    });
    fireEvent.click(submitButton);

    // 新しいスケジュールが追加されたことを確認
    expect(screen.getByText("新宿御苑")).toBeInTheDocument();
    expect(screen.getByText("東京都新宿区")).toBeInTheDocument();

    // フォームがリセットされていることを確認（日付以外）
    expect(timeInput).toHaveValue("");
    expect(titleInput).toHaveValue("");
    expect(locationInput).toHaveValue("");
  });

  it("スケジュールを編集できる", () => {
    render(<CreatePlanPage />);

    // 編集ボタンをクリック
    const editButtons = screen.getAllByRole("button", { name: /編集/i });
    fireEvent.click(editButtons[0]);

    // 編集フォームが表示されることを確認
    const titleInput = screen.getByDisplayValue("東京スカイツリー");
    const locationInput = screen.getByDisplayValue("東京都墨田区押上");

    // 値を編集
    fireEvent.change(titleInput, { target: { value: "スカイツリー" } });
    fireEvent.change(locationInput, { target: { value: "墨田区押上" } });

    // 保存ボタンをクリック
    const saveButton = screen.getByRole("button", { name: /保存/i });
    fireEvent.click(saveButton);

    // 編集した内容が反映されていることを確認
    expect(screen.getByText("スカイツリー")).toBeInTheDocument();
    expect(screen.getByText("墨田区押上")).toBeInTheDocument();
  });

  it("スケジュールを削除できる", () => {
    render(<CreatePlanPage />);

    // 削除前の要素数を確認
    expect(screen.getAllByText(/東京都/i)).toHaveLength(3);

    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByRole("button", { name: /削除/i });
    fireEvent.click(deleteButtons[1]); // 2番目のアイテムを削除

    // 要素が削除されていることを確認
    expect(screen.getAllByText(/東京都/i)).toHaveLength(2);
  });

  it("日付でグループ化されている", () => {
    render(<CreatePlanPage />);

    // 日付ごとのグループヘッダーが存在することを確認
    expect(screen.getByText(/3月20日/)).toBeInTheDocument();
    expect(screen.getByText(/3月21日/)).toBeInTheDocument();

    // 各グループに正しいアイテムが含まれていることを確認
    const march20Items = ["東京スカイツリー", "浅草寺"];
    const march21Items = ["上野動物園"];

    march20Items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    march21Items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
