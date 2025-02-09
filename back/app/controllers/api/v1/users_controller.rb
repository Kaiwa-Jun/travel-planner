module Api
  module V1
    class UsersController < ApplicationController
      # ユーザー登録時は認証不要とする
      skip_before_action :authenticate_request, only: [:create]

      # POST /api/v1/signup
      def create
        user = User.new(user_params)
        if user.save
          token = JWT.encode({ user_id: user.id }, Rails.application.secret_key_base, 'HS256')
          render json: { token: token, user: { id: user.id, email: user.email } }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/profile
      def profile
        render json: { user: { id: current_user.id, email: current_user.email } }
      end

      private

      def user_params
        params.permit(:email, :password, :password_confirmation, :name)
      end
    end
  end
end