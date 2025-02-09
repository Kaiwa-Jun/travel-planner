module Api
  module V1
    class OauthController < ApplicationController
      skip_before_action :authenticate_user!, only: [:google]

      def google
        user = User.find_or_initialize_by(google_uid: params[:google_uid])

        user.assign_attributes(
          email: params[:email],
          name: params[:name],
          image_url: params[:image]
        )

        if user.save
          token = JWT.encode(
            { user_id: user.id, exp: 24.hours.from_now.to_i },
            Rails.application.secret_key_base,
            'HS256'
          )
          render json: { token: token, user: user.as_json(only: [:id, :email, :name, :image_url]) }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end