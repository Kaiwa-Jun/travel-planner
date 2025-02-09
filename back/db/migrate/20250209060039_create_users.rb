class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :name
      t.string :password_digest
      t.string :google_uid
      t.string :image_url

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :google_uid, unique: true
  end
end
