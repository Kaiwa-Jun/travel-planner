module Api
  module V1
    class SessionsController < ApplicationController
      # ログイン時は認証不要とする
      skip_before_action :authenticate_request, only: [:create]

      # POST /api/v1/login
      def create
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JWT.encode({ user_id: user.id }, Rails.application.secret_key_base, 'HS256')
          render json: { token: token, user: { id: user.id, email: user.email } }
        else
          render json: { errors: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
        end
      end
    end
  end
end