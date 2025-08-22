# Calculator MCP サーバー

> このリポジトリは **MCP サーバーのテンプレート化準備中** です。新しいサーバーを派生させる場合は以下を参照してください:
> - `README.template.md` を開き、プレースホルダを置換
> - `package.json` の `name` / `bin` / `description` を新用途向けに変更
> - 既存の `calculator` ツール実装を差し替え
> - バージョンは新リポで `0.1.0` から開始
>
> 派生後はこの案内を削除して構いません。

Calculator MCP サーバーは、四則演算を行い、その結果を創作的なストーリー展開のインスピレーションに変える創作支援ツールです。単純に計算結果を返すのではなく、数字からインスピレーションを得た創造的なストーリーテリングを促すことができ、Model Context Protocol (MCP) を使用しています。

## インストール

### 前提条件
- Node.js 18+

### パブリッシュされたパッケージ
この MCP サーバーは公開された npm パッケージ `calculator-mcp` として利用できます。
- リポジトリをローカルにクローンする必要はありません
- `npx calculator-mcp@latest` で直接実行できます
- 以下の Claude Code のセットアップ手順を参照してください

### ローカルでビルド
```bash
cd /path/to/calculator-mcp
npm i
npm run build
```

## セットアップ: Claude Code (CLI)
以下のワンラインコマンドを使用してください：
```bash
claude mcp add Calculator-MCP -s user -- npx calculator-mcp@latest
```
Claude Code からサーバーを削除する場合：
```bash
claude mcp remove Calculator-MCP
```

## その他のクライアントとエージェント

<details>
<summary>VS Code</summary>

CLI で追加：
```bash
code --add-mcp '{"name":"Calculator-MCP","command":"npx","args":["calculator-mcp@latest"]}'
```
</details>

<details>
<summary>Claude Desktop</summary>

MCP インストールガイドに従ってください：
- ガイド: https://modelcontextprotocol.io/quickstart/user
</details>

## 利用可能なツール
- calculator
  - 入力パラメータ:
    - a: number (1つ目の数値)
    - b: number (2つ目の数値)
    - operator: string (演算子: 'add', 'subtract', 'multiply', 'divide')
  - 出力: AI サンプリングが有効時は計算結果を基にした創作的なストーリー展開のプロンプト。サンプリングが無効時は計算式と結果のみ（例: "計算式: 1 + 1 = 2"）を返します。

### 使用例 (MCP ツール呼び出し)

```json
{
  "name": "calculator",
  "arguments": {
    "a": 14,
    "b": 98,
    "operator": "add"
  }
}
```

**出力例 (AI サンプリング有効時):**
```
計算式: 14 + 98 = 112

この計算結果から、とても興味深いストーリーを想像できそうですね。例えば：
- 14人のチームが98人の新メンバーと合流して、112人の大きなプロジェクトチームになる話
- 14個のアイデアと98個のひらめきが組み合わさって、112通りの創造的な解決策を生み出す物語

このストーリーを以下のどの形で展開したいですか？
1. 文章 - 詳細な物語として書き上げる
2. 画像 - ビジュアルで表現する  
3. 動画 - 動きのある映像作品として構想する
```

**出力例 (AI サンプリング無効時):**
```
計算式: 14 + 98 = 112
```

## トラブルシューティング
- Node 18+ が必要です
- npx での使用: `npx calculator-mcp@latest` がローカルビルドなしで動作するはずです
- ローカル開発の場合: `build/index.js` への絶対パスを使用してください

## 参考資料
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)

## ライセンス
MIT License (`LICENSE` を参照)。