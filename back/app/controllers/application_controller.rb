class ApplicationController < ActionController::API
  # デフォルトでは全エンドポイント認証が必要
  before_action :authenticate_user!

  private

  def authenticate_user!
    unless current_user
      render json: { errors: '認証が必要です' }, status: :unauthorized
    end
  end

  def current_user
    return @current_user if @current_user
    return nil unless bearer_token

    begin
      token = bearer_token.split(' ').last
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
      @current_user = User.find(decoded[0]['user_id'])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      nil
    end
  end

  def bearer_token
    request.headers['Authorization']
  end
end
