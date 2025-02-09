class User < ApplicationRecord
  # パスワードのハッシュ化のための機能
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :provider, presence: true, if: :provider_id?
  validates :provider_id, presence: true, if: :provider?, uniqueness: { scope: :provider }
end