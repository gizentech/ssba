# SSBA WordPress カスタムプラグイン

## インストール方法

各フォルダをそのまま WordPress の `/wp-content/plugins/` にアップロードし、
管理画面 → プラグイン から有効化してください。

```
ssba-course/        → コース・料金
ssba-news/          → お知らせ
ssba-column/        → コラム
ssba-coaches/       → 指導者紹介
ssba-reason/        → 選ばれる理由
ssba-availability/  → アカデミー空き状況
ssba-partners/      → 関連団体
```

## REST API エンドポイント一覧

ベースURL: `http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1`

| エンドポイント         | メソッド | 説明                     |
|----------------------|--------|--------------------------|
| `/courses`           | GET    | コース一覧（表示順）       |
| `/news`              | GET    | お知らせ一覧（新しい順）   |
| `/news/{id}`         | GET    | お知らせ詳細              |
| `/columns`           | GET    | コラム一覧（新しい順）     |
| `/columns/{id}`      | GET    | コラム詳細                |
| `/coaches`           | GET    | 指導者一覧                |
| `/coaches/{id}`      | GET    | 指導者詳細                |
| `/reason`            | GET    | 選ばれる理由ページ内容    |
| `/availability`      | GET    | アカデミー空き状況         |
| `/availability`      | PUT    | 空き状況更新（管理者のみ） |
| `/partners`          | GET    | 関連団体バナー一覧         |

## Next.js 側の変更が必要なファイル

WP REST API からデータを取得するように以下を更新してください：

- `pages/course/index.js`      → `GET /courses`
- `pages/news/index.js`        → `GET /news`
- `pages/column/index.js`      → `GET /columns`
- `pages/coaches/index.js`     → `GET /coaches`
- `pages/reason/index.js`      → `GET /reason`
- `pages/api/availability.js`  → `GET /availability`（またはNext.jsを削除してWPに直接）
- `pages/api/partners.js`      → `GET /partners`

### 環境変数

`.env.local` に追加：
```
NEXT_PUBLIC_WP_API=http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1
```

### fetch 例

```js
const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/courses`);
const courses = await res.json();
```

## 管理画面の場所

有効化後、WordPress管理画面の左メニューに以下が追加されます：

- **コース・料金** → 投稿タイプ（一覧・新規追加）
- **お知らせ** → 投稿タイプ
- **コラム** → 投稿タイプ
- **指導者紹介** → 投稿タイプ
- **選ばれる理由** → オプションページ（直接編集）
- **空き状況** → オプションページ（テーブル形式）
- **関連団体** → オプションページ（バナー管理）
