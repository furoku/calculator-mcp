# furoku_mcp

Personal experimental MCP server with extensible tool collection.

## Features
- Minimal scaffold with a single `ping` tool for health checking
- TypeScript + MCP SDK
- Ready for npm publishing
- Designed for incremental tool addition

## Quick Start

### Install Dependencies
```bash
npm install
```

### Build
```bash
npm run build
```

### Test Locally
```bash
node build/index.js
```
(Server will start and wait for MCP client connections via stdio)

### Add to Claude Code
```bash
claude mcp add furoku_mcp -s user -- npx @furoku/furoku-mcp@latest
```

### Remove from Claude Code
```bash
claude mcp remove furoku_mcp
```

## Available Tools

### ping
Health check tool that echoes back input messages with timestamp.

**Input:**
- `message` (string, required): Any text message

**Output:**
- Echo of the input message with server timestamp

**Example:**
```json
{
  "name": "ping",
  "arguments": {
    "message": "Hello furoku_mcp!"
  }
}
```

**Response:**
```
pong: Hello furoku_mcp! (received at 2025-08-22T10:30:45.123Z)
```

## Development

### Watch Mode
```bash
npm run dev
```

### Type Checking
```bash
npm run lint
```

## Adding New Tools

1. Add tool definition to the `tools` array in `src/index.ts`
2. Add corresponding handler in the `CallTool` request handler
3. Update this README with tool documentation
4. Rebuild and test

## Roadmap

Future tool candidates:
- URL fetching and summarization
- Text diffing utilities
- Hash computation
- File system operations
- API integrations

## Publishing

```bash
# Update version in package.json
npm run build
npm publish --access public
```

## License

MIT License. See `LICENSE` file for details.

## References

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://modelcontextprotocol.io/docs/sdk)
