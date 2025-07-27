# 🌵 サボテン管理アプリ

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-green)](https://yourusername.github.io/your-repo-name/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

完全にクライアントサイドで動作するサボテン育成支援Webアプリです。あなたの大切なサボテンの健康管理をサポートします。

## 🚀 デモ

[**🌵 アプリを使ってみる**](https://yourusername.github.io/your-repo-name/)

## ✨ 機能

### 📋 サボテン管理
- **8種類のプリセット**: 人気のサボテン種類に最適化された設定
- **カスタム設定**: 独自の水やり間隔・環境設定が可能
- **水やり記録**: 最後の水やり日から次回予定日を自動計算
- **視覚的な管理**: カード形式で一覧表示

### 🌡️ 環境モニタリング
- **温度・湿度チェック**: 現在の環境と最適範囲を比較
- **リアルタイム通知**: 水やり時期や環境異常をお知らせ
- **位置情報対応**: ブラウザの位置情報を活用

### 📱 ユーザビリティ
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **オフライン対応**: ローカルストレージでデータを保存
- **直感的なUI**: シンプルで使いやすいインターフェース

## 🌵 対応サボテン種類

| 種類 | 水やり間隔 | 最適温度 | 最適湿度 |
|------|------------|----------|----------|
| ギムノカリキウム | 14日 | 15-30℃ | 30-60% |
| エキノプシス | 10日 | 10-28℃ | 30-50% |
| マミラリア | 12日 | 18-32℃ | 25-55% |
| アストロフィツム | 20日 | 15-27℃ | 30-60% |
| フェロカクタス | 14日 | 20-35℃ | 25-50% |
| オプンチア | 10日 | 18-32℃ | 30-60% |
| ハオルチア | 7日 | 15-25℃ | 40-70% |
| サンセベリア | 21日 | 15-28℃ | 30-50% |

## 🛠️ 技術仕様

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **ストレージ**: LocalStorage API
- **レスポンシブ**: CSS Grid, Flexbox
- **位置情報**: Geolocation API
- **デプロイ**: GitHub Pages

## 📂 ファイル構成

```
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── script.js           # アプリケーションロジック
└── README.md           # このファイル
```

## 🚀 セットアップ・使用方法

### GitHub Pagesでの使用（推奨）

1. [デモサイト](https://yourusername.github.io/your-repo-name/)にアクセス
2. ブラウザで直接使用開始

### ローカルでの使用

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. ブラウザで `index.html` を開く
```bash
open index.html
```

### 基本的な使い方

1. **サボテンを追加**
   - 名前を入力
   - 種類を選択（プリセットまたはカスタム）
   - 最後の水やり日を設定

2. **日常管理**
   - 通知エリアで水やり時期をチェック
   - 環境情報で温度・湿度を確認
   - 水やり完了ボタンで記録更新

3. **データ管理**
   - すべてのデータはブラウザのローカルストレージに保存
   - ブラウザデータをクリアするとリセットされます

## 🔧 カスタマイズ

### 実際の天気APIを使用する場合

`script.js` の `getCurrentWeather()` 関数を以下のように変更：

```javascript
// OpenWeatherMap API例
const API_KEY = 'your-api-key';
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
const data = await response.json();
```

**注意**: クライアントサイドでのAPI使用にはCORS制限があります。

### 新しいサボテン種類の追加

`script.js` の `speciesDefaults` オブジェクトに追加：

```javascript
"新しい種類": {
    watering_interval: 日数,
    temperature_range: [最低温度, 最高温度],
    humidity_range: [最低湿度, 最高湿度]
}
```

## 🎨 デザインのカスタマイズ

### カラーテーマの変更

`style.css` のCSS変数を編集：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

## 📱 ブラウザ対応

- ✅ Chrome (推奨)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (部分的サポート)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📋 今後の予定

- [ ] 写真アップロード機能
- [ ] データエクスポート/インポート
- [ ] 成長記録グラフ
- [ ] サボテン図鑑機能
- [ ] PWA対応
- [ ] 多言語対応

## 🐛 既知の問題

- 天気情報は現在模擬データを使用
- ブラウザのローカルストレージに依存（データバックアップ推奨）

## 📄 ライセンス

このプロジェクトは [MIT License](https://opensource.org/licenses/MIT) の下で公開されています。

## 👤 作者

**あなたの名前**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 謝辞

- サボテンの育成情報は各種園芸書籍・サイトを参考
- アイコンは絵文字を使用
- デザインはモダンなWebデザイントレンドを参考

---

⭐ このプロジェクトが役に立ったら、スターを付けていただけると嬉しいです！
