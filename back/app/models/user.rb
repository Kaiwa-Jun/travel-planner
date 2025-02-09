class User < ApplicationRecord
  # パスワードのハッシュ化のための機能
  has_secure_password

  validates :email, presence: true, uniqueness: true
end