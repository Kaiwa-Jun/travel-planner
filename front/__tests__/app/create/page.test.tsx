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

    // フォームの存在確認
    expect(screen.getByPlaceholderText("スポット名")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("プランのタイトルを入力")
    ).toBeInTheDocument();
  });

  it("新しいスケジュールを追加できる", () => {
    render(<CreatePlanPage />);

    // 日付を入力
    const dateInput = screen.getByTestId("date-input");
    fireEvent.change(dateInput, { target: { value: "2024-03-21" } });

    // 時間を入力
    const timeInput = screen.getByTestId("time-input");
    fireEvent.change(timeInput, { target: { value: "10:00" } });

    // スポット名を入力
    const titleInput = screen.getByPlaceholderText("スポット名");
    fireEvent.change(titleInput, { target: { value: "東京スカイツリー" } });

    // 場所を入力
    const locationInput = screen.getByTestId("location-input");
    fireEvent.change(locationInput, {
      target: { value: "東京都墨田区押上1-1-2" },
    });

    // 追加ボタンをクリック
    const addButton = screen.getByRole("button", {
      name: /スケジュールを追加/i,
    });
    fireEvent.click(addButton);

    // 追加されたスケジュールが表示されることを確認
    expect(screen.getByText("東京スカイツリー")).toBeInTheDocument();
  });

  it("プランのタイトルを設定できる", () => {
    render(<CreatePlanPage />);

    const titleInput = screen.getByPlaceholderText("プランのタイトルを入力");
    fireEvent.change(titleInput, { target: { value: "東京観光プラン" } });

    expect(titleInput).toHaveValue("東京観光プラン");
  });
});
