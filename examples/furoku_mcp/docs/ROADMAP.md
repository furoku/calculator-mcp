# Development Roadmap

## Current Status: v0.1.0
- ✅ Basic MCP server scaffold
- ✅ Single `ping` tool for health checking
- ✅ TypeScript build system
- ✅ npm package setup

## Short Term (v0.2.x)
- [ ] URL fetching tool (`url.fetch`)
  - HTTP/HTTPS support
  - Basic text extraction
  - Configurable timeout
  - Response summarization
- [ ] Text utilities (`text.*`)
  - `text.diff` - Compare two text blocks
  - `text.hash` - Generate hash for text input
  - `text.count` - Character/word/line counting

## Medium Term (v0.3.x)
- [ ] File system tools (`fs.*`)
  - `fs.read` - Read file contents with safety limits
  - `fs.list` - Directory listing with filters
  - `fs.stat` - File/directory information
- [ ] API integration helpers (`api.*`)
  - `api.request` - Generic HTTP client with auth support
  - `api.webhook` - Simple webhook server for testing

## Long Term (v0.4.x+)
- [ ] Advanced text processing
  - Markdown parsing and conversion
  - JSON/YAML manipulation
  - Template rendering
- [ ] System utilities
  - Process monitoring
  - Environment inspection
  - Log file analysis
- [ ] External service integrations
  - GitHub API helpers
  - Cloud storage operations
  - Database queries (with safety constraints)

## Tool Naming Convention
- Use category prefixes: `url.*`, `text.*`, `fs.*`, `api.*`
- Keep names concise but descriptive
- Maintain consistency across similar tools

## Error Handling Strategy
- Standardized error format: `ERROR:TYPE message`
- Timeout handling for all network operations
- Input validation with clear error messages
- Safe defaults for potentially dangerous operations

## Security Considerations
- No arbitrary code execution
- File system access limited to safe operations
- Network requests with configurable restrictions
- Input sanitization for all user-provided data

## Testing Strategy
- Manual testing with Claude Code integration
- Automated build verification
- Example usage documentation
- Performance benchmarks for heavy operations

---

This roadmap is subject to change based on usage patterns and feedback.
