# 認証 API 仕様書

## 概要

このドキュメントでは、Travel Planner アプリケーションの認証に関する API 仕様を説明します。

## 認証方式

- JWT（JSON Web Token）を使用
- トークンは`Authorization`ヘッダーに`Bearer <token>`の形式で付与

## API エンドポイント

### 1. ユーザー登録

新規ユーザーを作成し、認証トークンを発行します。

- **エンドポイント**: `POST /api/v1/signup`
- **認証**: 不要

#### リクエストボディ

```json
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "name": "山田太郎"
}
```

#### 成功時レスポンス

- **ステータスコード**: 201 Created

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### エラーレスポンス

- **ステータスコード**: 422 Unprocessable Entity

```json
{
  "errors": [
    "Emailはすでに存在します",
    "Passwordは6文字以上である必要があります"
  ]
}
```

### 2. ログイン

既存ユーザーの認証を行い、トークンを発行します。

- **エンドポイント**: `POST /api/v1/login`
- **認証**: 不要

#### リクエストボディ

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 成功時レスポンス

- **ステータスコード**: 200 OK

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### エラーレスポンス

- **ステータスコード**: 401 Unauthorized

```json
{
  "errors": "メールアドレスまたはパスワードが正しくありません"
}
```

### 3. プロフィール取得

現在ログインしているユーザーの情報を取得します。

- **エンドポイント**: `GET /api/v1/profile`
- **認証**: 必要

#### リクエストヘッダー

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### 成功時レスポンス

- **ステータスコード**: 200 OK

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### エラーレスポンス

- **ステータスコード**: 401 Unauthorized

```json
{
  "errors": "Authorization ヘッダーがありません"
}
```

## エラーレスポンス共通フォーマット

認証に失敗した場合、以下のような形式でエラーが返されます：

```json
{
  "errors": "エラーメッセージ"
}
```

## 注意事項

- すべての API リクエストは、ログインエンドポイントとサインアップエンドポイントを除き、有効な JWT トークンが必要です
- トークンの有効期限は設定されていません
- パスワードは安全なハッシュ化を行って保存されます
