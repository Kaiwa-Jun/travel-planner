import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

// スポットデータのモック
jest.mock("@/data/spots", () => ({
  sampleSpots: [
    {
      id: 1,
      name: "東京スカイツリー",
      location: "東京都墨田区押上1-1-2",
      image: "https://example.com/skytree.jpg",
    },
  ],
}));

// Google Places APIのモック
const mockGooglePlaces = {
  AutocompleteService: jest.fn(() => ({
    getPlacePredictions: jest.fn((request, callback) => {
      callback(
        [
          {
            description: "東京スカイツリー",
            place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
            structured_formatting: {
              main_text: "東京スカイツリー",
              secondary_text: "東京都墨田区押上1-1-2",
            },
          },
        ],
        "OK"
      );
    }),
  })),
  PlacesService: jest.fn(() => ({
    getDetails: jest.fn((request, callback) => {
      callback(
        {
          name: "東京スカイツリー",
          formatted_address: "東京都墨田区押上1-1-2",
          geometry: {
            location: {
              lat: () => 35.7100627,
              lng: () => 139.8107004,
            },
          },
        },
        "OK"
      );
    }),
  })),
  PlacesServiceStatus: {
    OK: "OK",
    ZERO_RESULTS: "ZERO_RESULTS",
    OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
    REQUEST_DENIED: "REQUEST_DENIED",
    INVALID_REQUEST: "INVALID_REQUEST",
  },
  AutocompleteSessionToken: jest.fn(),
};

// グローバルにGoogle Places APIをモック
global.google = {
  maps: {
    places: mockGooglePlaces,
  },
} as any;

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

  it("新しいスケジュールを追加できる", async () => {
    render(<CreatePlanPage />);

    // 日付を入力
    const dateInput = screen.getByTestId("date-input");
    fireEvent.change(dateInput, { target: { value: "2024-03-21" } });

    // 時間を入力
    const timeInput = screen.getByTestId("time-input");
    fireEvent.change(timeInput, { target: { value: "10:00" } });

    // スポット名を入力して選択
    const titleInput = screen.getByPlaceholderText("スポット名");
    fireEvent.change(titleInput, { target: { value: "東京スカイツリー" } });
    fireEvent.focus(titleInput);

    // サジェストの表示を待つ
    await waitFor(() => {
      expect(screen.getByText("東京スカイツリー")).toBeInTheDocument();
    });

    // サジェストを選択
    const suggestion = screen.getByText("東京スカイツリー");
    fireEvent.click(suggestion);

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
