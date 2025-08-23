# 開発時の流れ

## ■ 新規開発時
#### 要件定義
1. docs/note/配下にメモ（殴り書き）を配置
2. CREATE-doc-req
    - 要件定義書を作成
    - docs/reqs/requirement.md（要件定義書）が作成される
3. CREATE-infra-req（任意）
    - インフラ要件定義書（メモレベル）を作成
    - docs/reqs/infra.md　が生成される
4. CREATE-app-req
    - アプリケーション要件定義書（メモレベル）を作成
    - docs/reqs/app.md が生成される

#### 基本設計
5. CREATE-app-funclist
    - 機能一覧を作成
    - docs/base/func-list.mdが生成される
→　CREATE-app-apiif
6. CREATE-doc-base
    - 基本設計書を作成
    - docs/base/base-doc.mdが生成される

#### 詳細設計
★以降、機能単位で生成するものがあります。
機能名/機能IDは`5. CREATE-app-funclist`で作成される docs/base/func-list.md　を参照してください。

9. CREATE-db-detail
    - DB詳細設計書を作成
    - docs/detail/db.mdが生成される
8. CREATE-external-detail（任意）
    - 外部連携の詳細設計書を作成
    - docs/detail/external.mdが生成される
10. CREATE-infra-detail（任意）
    - インフラ詳細設計書を作成
    - docs/detail/infra.mdが生成される
10. CREATE-log-detail
11. CREATE-network-detail（任意）
    - ネットワーク詳細設計書を作成
    - docs/detail/network.mdが生成される
12. CREATE-app-detail 機能名
    - 各機能個別の詳細設計書を作成する
    - docs/detail/func/機能名.機能ID.md　及び　docs/detail/message.mdが生成される

#### 実装
13. IMPL-local-devenv（任意）
    - ローカル開発環境を作成
14. INPL-infra-code（任意）
    - IaCコードを作成
15. IMPL-tdd-red 機能名/機能ID
16. IMPL-tdd-green 機能名/機能ID
17. IMPL-tdd-refactor 機能名/機能ID
18. REVFIX-app-unittest-list 機能名/機能ID

**手順．15～18を繰り返す**

## ■ ドキュメントが無い場合の開発手順
★ 前提：
- docs/note 配下に補足資料を追加
    - 無くても問題はないが、あったほうが良い
1. REV-dir-base
2. REV-app-req
3. REV-db-detail
4. REV-external-detail
5. REV-app-funclist
6. REV-app-detail 機能名

## ■ 改修時の開発手順
★ 前提：
- 現行の仕様のドキュメントがあること
    - 無い場合はCREATE/REVコマンドを使用して作成すること

★ 方針
1. 現行の仕様にのっとったドキュメント作成
2. FIX系のコマンドを実行し、改修箇所をドキュメントに反映
3. IMPL系でコード改修

★ 手順
1. 改修仕様書を docs/fix-spec/ に配置
2. FIX-db-detail
    - DB仕様を改修
3. FIX-external-detail
    - 外部接続仕様を改修
4. FIX-app-detail 機能名
    - 詳細設計書を修正


config -> db
