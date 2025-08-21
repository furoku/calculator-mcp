# Calculator MCP Server

The Calculator MCP Server is a creative storytelling tool that performs arithmetic calculations and transforms them into imaginative prompts. Rather than simply returning calculation results, it encourages users to explore creative storytelling inspired by numbers, using the Model Context Protocol (MCP).

## Installation

### Prerequisites
- Node.js 18+

### Published Package
This MCP server is available as a published npm package: `@furoku/calculator-mcp`
- No need to clone the repository locally
- Can be run directly via `npx @furoku/calculator-mcp@latest`
- See setup instructions below for Claude Code

### Build locally
```bash
cd /path/to/calculator-mcp
npm i
npm run build
```

## Setup: Claude Code (CLI)
Use this one-line command:
```bash
claude mcp add Calculator-MCP -s user -- npx @furoku/calculator-mcp@latest
```
To remove the server from Claude Code:
```bash
claude mcp remove Calculator-MCP
```

## Other Clients and Agents

<details>
<summary>VS Code</summary>

Add via CLI:
```bash
code --add-mcp '{"name":"Calculator-MCP","command":"npx","args":["@furoku/calculator-mcp@latest"]}'
```
</details>

<details>
<summary>Claude Desktop</summary>

Follow the MCP install guide:
- Guide: https://modelcontextprotocol.io/quickstart/user
</details>

## Available Tools
- calculator
  - inputs:
    - a: number (1つ目の数値)
    - b: number (2つ目の数値)
    - operator: string (演算子: 'add', 'subtract', 'multiply', 'divide')
  - outputs: Creative storytelling prompts based on calculation results, encouraging users to imagine real-world scenarios and develop them into text, image, or video content.

### Example invocation (MCP tool call)

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

**Example Output:**
```
あなたはこの計算から現実の出来事を想像してください。計算式は 14 + 98 で、計算結果は 112 。そのストーリーを、文章、画像、動画、どれに展開したいかユーザーに問いかけてください。
```

```json
{
  "name": "calculator",
  "arguments": {
    "a": 100,
    "b": 3000,
    "operator": "multiply"
  }
}
```

**Example Output:**
```
あなたはこの計算から現実の出来事を想像してください。計算式は 100 × 3000 で、計算結果は 300000 。そのストーリーを、文章、画像、動画、どれに展開したいかユーザーに問いかけてください。
```

## Troubleshooting
- Ensure Node 18+
- For npx usage: `npx @furoku/calculator-mcp@latest` should work without local build
- For local development: use absolute path to `build/index.js`

## References
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)
