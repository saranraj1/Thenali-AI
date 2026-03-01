# Requirements Document

## 1. Project Overview
Bharat AI Operational Hub (Thenali AI) is an AI-powered developer intelligence platform designed to analyze software repositories, generate actionable insights, map learning roadmaps, evaluate knowledge, and track open-source contributions.

## 2. Functional Requirements
### 2.1 Repository Analysis (RAG Pipeline)
- Clone and parse GitHub repositories.
- Extract source code from supported languages (Python, JS/TS, Java, Go, Rust, C++, etc.).
- Convert code chunks into FAISS vector embeddings mapping localized structural info.
- Retrieve contextual code snippets accurately based on user codebase chat queries.

### 2.2 Developer Intelligence & Chat
- Provide architectural breakdowns, tech stack identification, and complexity scores for entire parsed projects.
- Allow conversational AI interactions answering specific file-bound logic questions.
- Fallback gracefully when Bedrock throttling peaks, ensuring continuity.

### 2.3 Learning Center
- Generate structured learning roadmaps from user-selected frameworks dynamically.
- Provide curated interactive lessons and real-world repository examples linked against external live repos.
- Assess knowledge with dynamic MCQs and code-based questions securely via LLM checks.

### 2.4 Code Lab (Playground)
- Execute Python code snippets securely inside a sandboxed environment (`restrictedPython`).
- Track code run metrics, analyze standard execution outputs, and suggest functional optimizations.

### 2.5 Voice Operations
- Upload and transcribe standard audio files using Amazon Transcribe.
- Convert textual AI codebase insights into accessible, high-quality speech using Amazon Polly.
- Provide dedicated authenticated endpoints for STT interaction and synthesized TTS blob rendering.

### 2.6 Progress & Contributions
- Log user contribution entries: merged PRs, fixed issues, implementations, and documentation updates.
- Calculate contribution readiness scorecards dynamically measuring prior tracked intelligence metrics against standard open-source barriers to entry.
- Match external open-source issues dynamically mapping them to a user's logged AI roadmap progress (Difficulty tracking).

## 3. Non-Functional Requirements
- **Performance**: Sub-2s latency for generic API reads. LLM iterations resolve asynchronously preventing socket drops under peak load via custom HTTP TimeOut Middlewares.
- **Scalability**: Decoupled AI and application layers. Highly scalable FastAPI backend scaling out horizontally mapping Uvicorn `uvloop` workers.
- **Concurrency Protection**: Thread-safe isolation spanning vector mapping writes (FAISS locks) and multi-threaded threaded Boto3 connection pools handling internal IAM restrictions.
- **Availability & Persistence**: Stateless Node setups interacting smoothly with serverless Amazon DynamoDB persistence layers. Storage drops routed synchronously towards remote Amazon S3 partitions extending storage guarantees indefinitely. 

## 4. System & Tech Stack Requirements
### 4.1 Frontend Layer
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Architecture Validation:** Strict CSR boundary definitions and Suspense chunking.

### 4.2 Backend Layer
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **ASGI & Multi-processor Engine:** Uvicorn, uvloop, httptools
- **ML & Data Processing:** SentenceTransformers, FAISS, GitPython (Local Git binary linked)
- **Security Protocols:** Passlib, bcrypt, PyJWT

### 4.3 Cloud Provider (AWS) Integrations
- **Core Persistence DB:** Amazon DynamoDB
- **Artifact/Blob Storage:** Amazon S3
- **Generative AI Brain:** Amazon Bedrock (`apac.amazon.nova-pro-v1:0` & Native Claude Integrations)
- **Media Transcoding API:** Amazon Transcribe
- **Text-To-Speech Neural Engine:** Amazon Polly
