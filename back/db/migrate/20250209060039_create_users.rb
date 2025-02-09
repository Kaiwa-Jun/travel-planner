class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :provider          # 認証プロバイダ（'google'など）
      t.string :provider_id       # プロバイダ側のユーザーID
      t.string :image_url         # プロフィール画像URL

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, [:provider, :provider_id], unique: true
  end
end
