class ApplicationController < ActionController::API
  # デフォルトでは全エンドポイント認証が必要
  before_action :authenticate_request

  private

  # リクエストヘッダーから JWT を取得し、デコードして現在のユーザーを特定
  def authenticate_request
    header = request.headers['Authorization']
    if header.present?
      token = header.split.last
      begin
        decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
        @current_user = User.find(decoded[0]['user_id'])
      rescue ActiveRecord::RecordNotFound => e
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::DecodeError => e
        render json: { errors: e.message }, status: :unauthorized
      end
    else
      render json: { errors: 'Authorization ヘッダーがありません' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
