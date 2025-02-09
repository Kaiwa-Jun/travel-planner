Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API用のルート
  namespace :api do
    namespace :v1 do
      # ユーザー登録用エンドポイント
      post '/signup', to: 'users#create'

      # ログイン用エンドポイント
      post '/login', to: 'sessions#create'

      # 認証済みユーザーのみアクセス可能なプロフィール取得エンドポイント
      get '/profile', to: 'users#profile'
    end
  end

  # ヘルスチェック用エンドポイント
  get '/health', to: proc { [200, {}, ['ok']] }

  # ルートパスへのアクセスを/api/v1/helloにリダイレクト
  root to: redirect('/api/v1/hello')
end
