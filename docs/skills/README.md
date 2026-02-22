# Skills

[**Agent Skills**](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) are specialized workflows including instructions, metadata, and optional resources (scripts, templates) that extend Claude's functionality.

## Installation Guide

This guide explains how to install dependencies for Claude Code skills.

### Overview

Skills are organized into groups with Python utility scripts. Each skill's scripts directory contains a `requirements.txt` file listing dependencies.

#### Best practices

1. **The 200-line rule matters** - It's not a suggestion. It's the difference between fast navigation and context sludge.

2. **Progressive disclosure isn't optional** - Every skill over 200 lines should be refactored. No exceptions. If you can't fit the core instructions in 200 lines, you're putting too much in the entry point.

3. **References are first-class citizens** - I treated `references/` as "optional extra documentation." Wrong. References are where the real work happens. SKILL.md is just the map.

4. **Test the cold start** - Clear your context, activate the skill, and measure. If it loads more than 500 lines on first activation, you're doing it wrong.

5. **Metrics don't lie** - 4.8x token efficiency isn't marginal improvement. It's the difference between "works sometimes" and "works reliably."

6. **Skills ≠ Documentation**

- Agent skills are not documentation dumps but context engineering problems. They are specific abilities and knowledge for development workflows.
- Context engineering isn't about loading more information. It's about loading the right information at the right time

Skills are capabilities that activate during specific workflow moments:

- Writing tests → activate `code-review`
- Debugging production → activate `sequential-thinking`
- Deploying infrastructure → activate `devops`
- Building UI → activate `ui-styling` + `web-frameworks`

Each skill teaches Claude _how to perform a specific development task_, not _what a tool does_.

#### Disclosure Architecture

- Skill should be organized with 3-tier loading system to avoid context overflow issue.
- Progressive disclosure works because it matches how development actually happens:

1. Scan metadata → Is this capability relevant to current task?
2. Read entry point → What workflow patterns does this enable?
3. Load specific reference → Get implementation details for current step

**Tier 1: Metadata (always loaded)**

- YAML frontmatter only
- ~100 words
- Just enough for Claude to decide if the skill is relevant

**Tier 2: `SKILL.md` entry point (loaded when skill activates)**

- ~200 lines max
- Overview, quick start, navigation map
- Points to references but doesn't include their content

**Tier 3: Reference files & scripts (loaded on-demand)**

- 200-300 lines each
- Detailed documentation Claude reads only when needed
- Modular and focused on single topics

### Skills catalog

#### 🔐 Authentication & Security

- **[better-auth](.claude/skills/better-auth)** - Comprehensive TypeScript authentication framework supporting email/password, OAuth, 2FA, passkeys, and multi-tenancy. Works with any framework (Next.js, Nuxt, SvelteKit, etc.).

#### 🤖 AI & Agent Development

- **[context-engineering](.claude/skills/context-engineering)** - Master context engineering for AI agent systems. Covers context fundamentals, degradation patterns, optimization techniques (compaction, masking, caching), compression strategies, memory architectures, multi-agent patterns, LLM-as-Judge evaluation, tool design, and project development. Use when designing agent architectures, debugging context failures, optimizing token usage, implementing memory systems, or building multi-agent coordination.
- **[google-adk-python](.claude/skills/google-adk-python)** - Google's Agent Development Kit (ADK) for building AI agents with tool integration, multi-agent orchestration, workflow patterns (sequential, parallel, loop), and deployment to Vertex AI or custom infrastructure.

#### 💻 Backend Development

- **[backend-development](.claude/skills/backend-development)** - Build robust backend systems with modern technologies (Node.js, Python, Go, Rust), frameworks (NestJS, FastAPI, Django), databases (PostgreSQL, MongoDB, Redis), APIs (REST, GraphQL, gRPC), authentication (OAuth 2.1, JWT), testing strategies, security best practices (OWASP Top 10), performance optimization, scalability patterns (microservices, caching, sharding), DevOps practices (Docker, Kubernetes, CI/CD), and monitoring. Use when designing APIs, implementing authentication, optimizing database queries, setting up CI/CD pipelines, handling security vulnerabilities, building microservices, or developing production-ready backend systems.

#### 🧠 AI & Machine Learning

- **[ai-multimodal](.claude/skills/ai-multimodal)** - Process and generate multimedia content using Google Gemini API. Capabilities include analyze audio (transcription, summarization up to 9.5 hours), understand images (captioning, object detection, OCR, visual Q&A), process videos (scene detection, Q&A, temporal analysis, YouTube URLs up to 6 hours), extract from documents (PDF tables, forms, charts, diagrams), generate images (text-to-image, editing, composition). Supports Gemini 2.5/2.0 with context windows up to 2M tokens.
- **[context-engineering](.claude/skills/context-engineering)** - Master context engineering for AI agent systems. Use when designing agent architectures, debugging context failures, optimizing token usage, implementing memory systems, building multi-agent coordination, or evaluating agent performance. Covers context fundamentals, degradation patterns, optimization techniques (compaction, masking, caching), compression strategies, and memory architectures.

#### 🎨 Design & Aesthetics

- **[aesthetic](.claude/skills/aesthetic)** - Create aesthetically beautiful interfaces following proven design principles. Use when building UI/UX, analyzing designs from inspiration sites, generating design images with ai-multimodal, implementing visual hierarchy and color theory, adding micro-interactions, or creating design documentation. Includes workflows for capturing and analyzing inspiration screenshots with chrome-devtools and ai-multimodal, iterative design image generation until aesthetic standards are met, and comprehensive design system guidance covering BEAUTIFUL (aesthetic principles), RIGHT (functionality/accessibility), SATISFYING (micro-interactions), and PEAK (storytelling) stages.

#### 🌐 Web Development

- **[web-frameworks](.claude/skills/web-frameworks)** - Build modern full-stack web applications with Next.js (App Router, Server Components, RSC, PPR, SSR, SSG, ISR), Turborepo (monorepo management, task pipelines, remote caching, parallel execution), and RemixIcon (3100+ SVG icons). Create React applications, implement server-side rendering, set up monorepos, optimize build performance, manage shared dependencies.
- **[ui-styling](.claude/skills/ui-styling)** - Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Build design systems, create responsive layouts, add accessible components, customize themes, implement dark mode, generate visual designs and posters.
- **[frontend-design](.claude/skills/frontend-design)** - Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
- **[frontend-development](.claude/skills/frontend-development)** - Frontend development guidelines for React/TypeScript applications. Modern patterns including Suspense, lazy loading, useSuspenseQuery, file organization with features directory, MUI v7 styling, TanStack Router, performance optimization, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, routing, or working with frontend code.
- **[threejs](.claude/skills/threejs)** - Build 3D web apps with Three.js (WebGL/WebGPU). Use for 3D scenes, animations, custom shaders, PBR materials, VR/XR experiences, games, data visualizations, product configurators. Includes asset loading (GLTF, FBX, OBJ), post-processing effects, physics simulations, and performance optimization.

#### 🌐 Browser Automation & Testing

- **[chrome-devtools](.claude/skills/chrome-devtools)** - Browser automation, debugging, and performance analysis using Puppeteer CLI scripts. Automate browsers, take screenshots, analyze performance, monitor network traffic, web scraping, and form automation.
- **[web-testing](.claude/skills/web-testing)** - Comprehensive web testing with Playwright, Vitest, k6. E2E/unit/integration/load/security/visual/accessibility testing. Use for test automation, flakiness mitigation, Core Web Vitals, mobile gestures, cross-browser testing.

#### ☁️ Cloud Platforms & DevOps

- **[devops](.claude/skills/devops)** - Deploy and manage cloud infrastructure on Cloudflare (Workers, R2, D1, KV, Pages, Durable Objects, Browser Rendering), Docker containers, and Google Cloud Platform (Compute Engine, GKE, Cloud Run, App Engine, Cloud Storage). Deploy serverless functions to the edge, configure edge computing solutions, manage containers, set up CI/CD pipelines, optimize cloud infrastructure costs.

#### 🗄️ Databases

- **[databases](.claude/skills/databases)** - Work with MongoDB (document database, BSON documents, aggregation pipelines, Atlas cloud) and PostgreSQL (relational database, SQL queries, psql CLI, pgAdmin). Design database schemas, write queries and aggregations, optimize indexes, perform migrations, configure replication and sharding, implement backup and restore strategies.

#### 🛠️ Development Tools

- **[claude-code](.claude/skills/claude-code)** - Complete guide to Claude Code features: slash commands, hooks, plugins, MCP servers, agent skills, IDE integration, and enterprise deployment.
- **[mcp-builder](.claude/skills/mcp-builder)** - Build high-quality MCP servers in Python (FastMCP) or TypeScript. Includes agent-centric design principles, evaluation harnesses, and best practices.
- **[mcp-management](.claude/skills/mcp-management)** - Manage Model Context Protocol (MCP) servers - discover, analyze, and execute tools/prompts/resources from configured MCP servers. Use when working with MCP integrations, need to discover available MCP capabilities, filter MCP tools for specific tasks, execute MCP tools programmatically, access MCP prompts/resources, or implement MCP client functionality. Supports intelligent tool selection, multi-server management, and context-efficient capability discovery.
- **[repomix](.claude/skills/repomix)** - Package entire repositories into single AI-friendly files (XML, Markdown, JSON). Perfect for codebase analysis, security audits, and LLM context generation.
- **[media-processing](.claude/skills/media-processing)** - Process multimedia files with FFmpeg (video/audio encoding, conversion, streaming, filtering, hardware acceleration) and ImageMagick (image manipulation, format conversion, batch processing, effects, composition). Supports 100+ formats, hardware acceleration (NVENC, QSV), and complex filtergraphs.

#### 📚 Documentation & Research

- **[seeking-docs](.claude/skills/seeking-docs)** - Intelligent documentation discovery using llms.txt standard, GitHub repository analysis via Repomix, and parallel exploration agents for comprehensive coverage.

#### 🧪 Code Quality & Review

- **[code-review](.claude/skills/code-review)** - Use when receiving code review feedback (especially if unclear or technically questionable), when completing tasks or major features requiring review before proceeding, or before making any completion/success claims. Essential for subagent-driven development, pull requests, and preventing false completion claims.

#### 🐛 Debugging & Quality

- **[debugging/defense-in-depth](.claude/skills/debugging/defense-in-depth)** - Validate at every layer data passes through. Make bugs structurally impossible with entry validation, business logic checks, environment guards, and debug logging.
- **[debugging/root-cause-tracing](.claude/skills/debugging/root-cause-tracing)** - Trace bugs backward through the call stack to find original triggers. Fix at the source, not the symptom.
- **[debugging/systematic-debugging](.claude/skills/debugging/systematic-debugging)** - Four-phase framework ensuring root cause investigation before fixes. Never jump to solutions.
- **[debugging/verification-before-completion](.claude/skills/debugging/verification-before-completion)** - Run verification commands and confirm output before claiming success. Evidence before claims, always.

#### 📄 Document Processing

- **[processing-document/docx](.claude/skills/processing-document/docx)** - Create, edit, and analyze Word documents with tracked changes, comments, formatting preservation, and redlining workflows for professional documents.
- **[processing-document/pdf](.claude/skills/processing-document/pdf)** - Extract text/tables, create PDFs, merge/split documents, fill forms. Uses pypdf and command-line tools for programmatic PDF processing.
- **[processing-document/pptx](.claude/skills/processing-document/pptx)** - Create and edit PowerPoint presentations with layouts, speaker notes, comments, animations, and design elements.
- **[processing-document/xlsx](.claude/skills/processing-document/xlsx)** - Build spreadsheets with formulas, formatting, data analysis, and visualization. Includes financial modeling standards and zero-error formula requirements.

#### 🛍️ E-commerce & Platforms

- **[shopify](.claude/skills/shopify)** - Build Shopify apps, extensions, and themes using GraphQL/REST APIs, Shopify CLI, Polaris UI. Includes checkout extensions, admin customization, Liquid templating, and Shopify Functions.

#### 💳 Payments & Billing

- **[payment-integration](.claude/skills/payment-integration)** - Comprehensive payment integration for SePay (Vietnamese VietQR/bank transfers), Polar (SaaS monetization with MoR), Stripe (global payments), Paddle (MoR subscriptions), and Creem.io (software licensing). Includes webhook verification, checkout helpers, subscription management, and usage-based billing.

#### 🧠 Problem-Solving Frameworks

- **[problem-solving/collision-zone-thinking](.claude/skills/problem-solving/collision-zone-thinking)** - Force unrelated concepts together to discover emergent properties. "What if we treated X like Y?"
- **[problem-solving/inversion-exercise](.claude/skills/problem-solving/inversion-exercise)** - Flip core assumptions to reveal hidden constraints and alternative approaches. "What if the opposite were true?"
- **[problem-solving/meta-pattern-recognition](.claude/skills/problem-solving/meta-pattern-recognition)** - Spot patterns appearing in 3+ domains to find universal principles worth extracting.
- **[problem-solving/scale-game](.claude/skills/problem-solving/scale-game)** - Test at extremes (1000x bigger/smaller, instant/year-long) to expose fundamental truths hidden at normal scales.
- **[problem-solving/simplification-cascades](.claude/skills/problem-solving/simplification-cascades)** - Find one insight that eliminates multiple components. "If this is true, we don't need X, Y, or Z."
- **[problem-solving/when-stuck](.claude/skills/problem-solving/when-stuck)** - Dispatch to the right problem-solving technique based on your specific type of stuck-ness.

#### 🧠 Advanced Reasoning

- **[sequential-thinking](.claude/skills/sequential-thinking)** - Use when complex problems require systematic step-by-step reasoning with ability to revise thoughts, branch into alternative approaches, or dynamically adjust scope. Ideal for multi-stage analysis, design planning, problem decomposition, or tasks with initially unclear scope.

#### 📊 Visualization & Diagramming

- **[mermaidjs-v11](.claude/skills/mermaidjs-v11)** - Create diagrams and visualizations using Mermaid.js v11 syntax. Generate flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, user journeys, timelines, architecture diagrams, or any of 24+ diagram types. Supports JavaScript API integration, CLI rendering to SVG/PNG/PDF, theming, configuration, and accessibility features. Essential for documentation, technical diagrams, project planning, system architecture, and visual communication.

#### 🔧 Meta Skills (from Anthropic)

- **[creating-skill](.claude/skills/creating-skill)** - Guide for creating effective skills with specialized workflows, tool integrations, domain expertise, and bundled resources.

### Quick Start

#### Option 1: Install All Dependencies (Recommended)

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install all skill dependencies
pip install -r .claude/skills/ai-multimodal/scripts/requirements.txt

# Install test dependencies for development
pip install pytest pytest-cov pytest-mock
```

#### Option 2: Install Per-Skill

Navigate to specific skill and install:

```bash
cd .claude/skills/ai-multimodal/scripts
pip install -r requirements.txt
```

## Skills Dependencies

### Python Package Dependencies

Most skills use only Python standard library. Only **ai-multimodal** requires external packages:

**ai-multimodal** (`.claude/skills/ai-multimodal/scripts/requirements.txt`):

- `google-genai>=0.1.0` - Google Gemini API
- `pypdf>=4.0.0` - PDF processing
- `python-docx>=1.0.0` - DOCX conversion
- `docx2pdf>=0.1.8` - PDF conversion (Windows only)
- `markdown>=3.5.0` - Markdown processing
- `Pillow>=10.0.0` - Image processing
- `python-dotenv>=1.0.0` - Environment variables

### System Tool Dependencies

Several skills require external CLI tools:

#### media-processing

- **FFmpeg**: Video/audio processing
  - Ubuntu/Debian: `sudo apt-get install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Windows: `choco install ffmpeg`
- **ImageMagick**: Image processing
  - Ubuntu/Debian: `sudo apt-get install imagemagick`
  - macOS: `brew install imagemagick`
  - Windows: `choco install imagemagick`

#### devops

- **Cloudflare Wrangler**: `npm install -g wrangler`
- **Docker**: <https://docs.docker.com/get-docker/>
- **Google Cloud CLI**: <https://cloud.google.com/sdk/docs/install>

#### better-auth, repomix, shopify

- **Node.js 18+**: <https://nodejs.org/>
- **Better Auth**: `npm install better-auth`
- **Repomix**: `npm install -g repomix`
- **Shopify CLI**: `npm install -g @shopify/cli @shopify/theme`

#### databases

- **PostgreSQL client**: `sudo apt-get install postgresql-client` (Linux)
- **MongoDB Shell**: <https://www.mongodb.com/try/download/shell>
- **MongoDB Tools**: <https://www.mongodb.com/try/download/database-tools>

#### web-frameworks, ui-styling

- **Node.js 18+**: <https://nodejs.org/>
- **pnpm**: `npm install -g pnpm`
- **yarn**: `npm install -g yarn`

## Installation by Platform

### Linux (Ubuntu/Debian)

```bash
# Python environment
python3 -m venv .venv
source .venv/bin/activate

# Python packages (ai-multimodal only)
cd .claude/skills/ai-multimodal/scripts
pip install -r requirements.txt

# System tools
sudo apt-get update
sudo apt-get install -y ffmpeg imagemagick postgresql-client

# Node.js and tools
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm wrangler repomix @shopify/cli
```

### macOS

```bash
# Python environment
python3 -m venv .venv
source .venv/bin/activate

# Python packages (ai-multimodal only)
cd .claude/skills/ai-multimodal/scripts
pip install -r requirements.txt

# System tools via Homebrew
brew install ffmpeg imagemagick postgresql

# Node.js and tools
brew install node
npm install -g pnpm wrangler repomix @shopify/cli
```

### Windows

```powershell
# Python environment
python -m venv .venv
.venv\Scripts\activate

# Python packages (ai-multimodal only)
cd .claude\skills\ai-multimodal\scripts
pip install -r requirements.txt

# System tools via Chocolatey
choco install ffmpeg imagemagick nodejs

# Node.js tools
npm install -g pnpm wrangler repomix @shopify/cli
```

## Testing Dependencies

All skills include test dependencies in `requirements.txt`:

```txt
pytest>=8.0.0
pytest-cov>=4.1.0
pytest-mock>=3.12.0
```

To run tests for a skill:

```bash
cd .claude/skills/{skill-name}/scripts
python -m pytest tests/ -v --cov=. --cov-report=term-missing
```

## Environment Variables

Skills respect environment variable loading priority:

1. **process.env** (highest priority - runtime environment)
2. **`.claude/skills/{skill-name}/.env`** (skill-specific config)
3. **`.claude/skills/.env`** (shared skills config)
4. **`.claude/.env`** (global Claude config)

Example `.env` files are provided where needed (e.g., `devops/.env.example`).

## Troubleshooting

### "externally-managed-environment" Error

If you see this error when installing packages:

```bash
# Use virtual environment (recommended)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Or use pipx for CLI tools
pipx install google-genai
```

### Missing System Tools

If scripts fail with "command not found":

```bash
# Check if tool is installed
which ffmpeg
which docker
which node

# Verify tool works
ffmpeg -version
docker --version
node --version
```

### Permission Errors

On Linux/macOS, you may need to make scripts executable:

```bash
chmod +x .claude/skills/*/scripts/*.py
```

## Minimal Installation

If you only want to use specific skills:

**For ai-multimodal only:**

```bash
pip install google-genai pypdf python-docx markdown Pillow python-dotenv
```

**For media-processing only:**

```bash
# macOS
brew install ffmpeg imagemagick

# Linux
sudo apt-get install ffmpeg imagemagick
```

**For other skills:**
Most other skills (better-auth, repomix, shopify, devops, web-frameworks, ui-styling, databases) use only Python stdlib and require no `pip install`.

## Development Setup

For contributors working on skills:

```bash
# Install all test dependencies
pip install pytest pytest-cov pytest-mock

# Install pre-commit hooks (if available)
pre-commit install

# Run all tests
pytest .claude/skills/*/scripts/tests/ -v

# Check coverage across all skills
pytest .claude/skills/*/scripts/tests/ --cov=.claude/skills --cov-report=html
```

## Skill-Specific Notes

### ai-multimodal

- Requires `GEMINI_API_KEY` in environment
- Get API key: <https://aistudio.google.com/app/apikey>
- Windows users: `docx2pdf` requires Microsoft Word installed

### media-processing

- FFmpeg must be in PATH
- ImageMagick must be in PATH
- Test with: `ffmpeg -version` and `convert -version`

### devops

- Cloudflare: Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- GCloud: Requires `GOOGLE_APPLICATION_CREDENTIALS` path to service account JSON
- Docker: Must have Docker daemon running

### shopify

- Requires Shopify CLI authentication: `shopify auth login`
- Partner account needed for app development

## Getting Help

If dependencies fail to install or scripts don't work:

1. Check the skill's `scripts/requirements.txt` for specific versions
2. Verify system tools are installed and in PATH
3. Check environment variables are set correctly
4. Review skill's `SKILL.md` for additional setup instructions
5. Open an issue: <https://github.com/anthropics/claude-code/issues>
