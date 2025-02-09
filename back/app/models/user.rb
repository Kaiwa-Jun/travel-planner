class User < ApplicationRecord
  has_secure_password validations: false

  # バリデーション
  validates :email, presence: true, uniqueness: true
  validates :google_uid, uniqueness: true, allow_nil: true

  # Google認証済みかどうかを確認するメソッド
  def google_authenticated?
    google_uid.present?
  end
end
