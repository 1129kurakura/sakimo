# SAKIMO 紹介サイト（kindchord）

SAKIMO だけを紹介する1ページのサイトです。
見た目の仕組み（色・文字・余白・部品）は、u&me 公式サイトと同じ `base.css` / `pages.css` を使っています。オープニングはありません。

HTML / CSS / JavaScript だけでできています。ビルドは不要です。

## 見る

`index.html` をダブルクリックで開けます。
「デモを触る」は、同じフォルダの `../demo/index.html` を開きます。

## ファイルの場所

```
site/
  index.html              SAKIMO の紹介ページ（文章はここを直接書き換え）
  assets/
    js/site-data.js       ★ 団体名・連絡先・デモの場所・メニュー（よく直すのはここ）
    js/site.js            ヘッダー・フッター・お問い合わせの共通の動き（ふだんは触らない）
    js/boot.js            スクロールの演出を有効にするだけ
    css/base.css          u&me と同じ（色・文字・余白の決まり、共通の部品）
    css/pages.css         u&me と同じ（ページの部品）
    css/sakimo.css        SAKIMO の色と、このページだけの部品
    img/                  画面写真（WebP）
```

## よくある編集

- **お問い合わせ先を入れる**：`site-data.js` の `contact` に1つ以上入れると「準備中」が消えます
- **デモを別の場所に公開したら**：`site-data.js` の `demo` をそのURLに書き換えます（ページ内の「デモを触る」すべてに反映）
- **色を変える**：`sakimo.css` のいちばん上の `--sakimo`（淡い面）と `--sakimo-deep`（文字の濃い色）
- **文章を直す**：`index.html` の日本語をそのまま書き換えます。各章は「結論 → 理由 → 具体例 → 結論」の短い段落です

## 公開するとき

`sns見守り` フォルダごと（`site/` と `demo/` の両方）を公開すると、「デモを触る」がそのまま動きます。
GitHub Pages などで `site/` だけを公開する場合は、デモも別に公開して `site-data.js` の `demo` を書き換えてください。

## 使っているもの

フォント：Noto Sans JP、Bricolage Grotesque（Google Fonts）

© kindchord
