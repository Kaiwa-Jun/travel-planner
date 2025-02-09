module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_user!, only: [:signup, :login]

      def signup
        user = User.new(user_params)
        if user.save
          token = JWT.encode(
            { user_id: user.id, exp: 24.hours.from_now.to_i },
            Rails.application.secret_key_base,
            'HS256'
          )
          render json: { token: token, user: user.as_json(only: [:id, :email, :name]) }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JWT.encode(
            { user_id: user.id, exp: 24.hours.from_now.to_i },
            Rails.application.secret_key_base,
            'HS256'
          )
          render json: { token: token, user: user.as_json(only: [:id, :email, :name]) }
        else
          render json: { errors: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
        end
      end

      def profile
        render json: { user: current_user.as_json(only: [:id, :email, :name, :image_url]) }
      end

      def logout
        # トークンを無効化する処理（例：ブラックリストに追加）
        # ここでは単純に成功レスポンスを返す
        render json: { message: 'ログアウトしました' }, status: :ok
      end

      private

      def user_params
        params.permit(:email, :password, :password_confirmation, :name)
      end
    end
  end
end