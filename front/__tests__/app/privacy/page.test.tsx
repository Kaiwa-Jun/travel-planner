import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";

// モックの設定
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock("@/components/navigation", () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

describe("PrivacyPage", () => {
  beforeEach(() => {
    render(<PrivacyPage />);
  });

  it("正しくページがレンダリングされる", () => {
    // ナビゲーションの存在確認
    expect(screen.getByTestId("navigation")).toBeInTheDocument();

    // メインヘッダーの確認
    expect(
      screen.getByRole("heading", { name: "プライバシーポリシー", level: 1 })
    ).toBeInTheDocument();
  });

  it("すべてのセクションヘッダーが表示される", () => {
    const sections = [
      "第1条（個人情報）",
      "第2条（個人情報の収集方法）",
      "第3条（個人情報を収集・利用する目的）",
      "第4条（利用目的の変更）",
      "第5条（個人情報の第三者提供）",
      "第6条（個人情報の開示）",
      "第7条（プライバシーポリシーの変更）",
    ];

    sections.forEach((section) => {
      expect(
        screen.getByRole("heading", { name: section, level: 2 })
      ).toBeInTheDocument();
    });
  });

  it("個人情報の利用目的が正しく表示される", () => {
    const purposes = [
      "本サービスの提供・運営のため",
      "ユーザーからのお問い合わせに回答するため",
      "ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため",
      "メンテナンス、重要なお知らせなど必要に応じたご連絡のため",
      "利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため",
      "ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため",
      "有料サービスにおいて、ユーザーに利用料金を請求するため",
      "上記の利用目的に付随する目的",
    ];

    purposes.forEach((purpose) => {
      expect(screen.getByText(purpose)).toBeInTheDocument();
    });
  });

  it("重要な説明文が表示される", () => {
    const importantTexts = [
      "Travel Planner（以下、「当社」といいます。）は、本ウェブサイトで提供するサービス",
      "「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし",
      "当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス",
      "当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り",
      "当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく",
      "当社は、本人から個人情報の開示を求められたときは、本人に対し",
      "本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて",
    ];

    importantTexts.forEach((text) => {
      const element = screen.getByText((content) => content.includes(text));
      expect(element).toBeInTheDocument();
    });
  });
});
