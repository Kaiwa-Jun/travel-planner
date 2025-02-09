module Api
  module V1
    class SessionsController < ApplicationController
      # ログイン時とログアウト時は認証不要とする
      skip_before_action :authenticate_user!, only: [:create, :destroy]

      # POST /api/v1/login
      def create
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JWT.encode(
            { user_id: user.id, exp: 24.hours.from_now.to_i },
            Rails.application.secret_key_base,
            'HS256'
          )
          render json: { token: token, user: { id: user.id, email: user.email } }
        else
          render json: { errors: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
        end
      end

      # POST /api/v1/logout
      def destroy
        begin
          # リクエストヘッダーの確認（デバッグ用）
          Rails.logger.info "Request headers: #{request.headers.env.select { |k, _| k.start_with?('HTTP_') }}"

          # Authorizationヘッダーからトークンを取得
          auth_header = request.headers['HTTP_AUTHORIZATION'] || request.headers['Authorization']
          Rails.logger.info "Auth header: #{auth_header}"

          token = auth_header&.split(' ')&.last
          Rails.logger.info "Received token: #{token ? 'present' : 'missing'}"

          if token
            # トークンをデコードしてユーザーIDを取得
            decoded_token = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
            user_id = decoded_token[0]['user_id']

            # ログ出力（デバッグ用）
            Rails.logger.info "Logging out user #{user_id}"

            render json: { message: 'ログアウトしました' }, status: :ok
          else
            Rails.logger.warn "No token found in Authorization header"
            render json: { error: '無効なトークンです' }, status: :unauthorized
          end
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT decode error: #{e.message}"
          render json: { error: 'トークンの検証に失敗しました' }, status: :unauthorized
        rescue => e
          Rails.logger.error "Logout error: #{e.class.name} - #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'ログアウト処理に失敗しました' }, status: :internal_server_error
        end
      end
    end
  end
end