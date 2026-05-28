# MCP Test Project

Claude Code에서 MCP(Model Context Protocol) 서버를 연결하고 테스트하기 위한 프로젝트입니다.

## MCP 서버 구성

`.mcp.json`에 다음 3개의 MCP 서버가 등록되어 있습니다.

### 1. GitHub (`github`)
GitHub API와 연동하여 레포지토리, 이슈, PR 등을 관리합니다.
- 방식: npx 실행 (`@modelcontextprotocol/server-github`)

### 2. Web (`web`)
웹 관련 작업을 수행하는 HTTP 기반 MCP 서버입니다.

### 3. Extension (`extension`)
확장 기능을 제공하는 HTTP 기반 MCP 서버입니다.

## 파일 구조
```
mcptest/
├── .mcp.json     # MCP 서버 설정
├── CLAUDE.md     # Claude Code 작업 규칙
└── README.md     # 프로젝트 설명
```
