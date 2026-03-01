# Bharat AI Operational Hub (Thenali AI)

An AI-powered developer intelligence and learning platform. This full-stack system rapidly clones repositories, securely runs Python logic in sandboxed virtual sessions, and guides developers via conversational AI, roadmap planning, and intelligent dynamic open-source contribution metrics.

## 🚀 Features

*   **Repository Intelligence (RAG)**: Clone, map, chunk, and embed entire local architectures using Python FAISS.
*   **Intelligent Chat & Knowledge Assessment**: Amazon Bedrock Nova Pro powered intelligence offering tailored contextual analysis, targeted code assessments, and roadmap curricula generations.
*   **Media Accessibility Services**: Voice operations using Amazon Transcribe and Polly handling natively synced auditory experiences.
*   **Performance Scaling**: Robust timeout middlewares handling stalled instances natively and ConnectionPool implementations smoothing LLM throttle peaks.
*   **Frontend Ecosystem**: Next.js 14 combined with Tailwind CSS presenting extremely modern, Glassmorphic UI mechanics.
*   **Open-Source Readiness Metrics**: Simulates an actual user's readiness level logging historical behavior scaling to direct external ecosystem contribution capabilities.

## 📦 Project Structure

```
ThenaliAI/
├── Backend/                 # Python 3.11, FastAPI
│   ├── api/                 # Endpoint logic (auth, dashboard, repos, learning, etc.)
│   ├── services/            # Deep architectural logic (RAG pipeline, Bedrock wrappers)
│   ├── database             # DynamoDB Client integration hooks
│   ├── main.py              # Uvicorn boot instance and Middleware chains
│   ├── requirements.txt     # Python Dependencies
│   └── start_production.sh  # Multi-worker launch script
├── FrontEnd/                # Next.js 14
│   ├── src/app/             # Active Routes (pages)
│   ├── src/components/      # Reusable styled pieces / visual layout sections
│   ├── src/context/         # Global state maps (Session, Auth, Languages)
│   ├── src/services/        # Bound REST interactions
│   └── package.json         # Javascript dependencies
├── data/                    # Storage volume mappings (e.g. .git dumps, .faiss indices)
├── design.md                # System Architecture diagrams and structures
├── requirements.md          # End-to-end product definitions and functional boundaries
└── README.md                # Documentation Root
```

## 🛠 Prerequisites

*   **Python:** 3.11+
*   **Node.js:** v18+
*   **Git:** Local installation configured via `GIT_PYTHON_GIT_EXECUTABLE`.
*   **AWS Capabilities:** Live tokens matching IAM rights to DynamoDB, S3, Transcribe, Polly, and Bedrock (Model: `apac.amazon.nova-pro-v1:0`).

## ⚙️ Quick Start Installation

### Backend Setup

1.  Navigate into the backend component directory:
    ```bash
    cd Backend
    ```
2.  Install all Python dependencies defined for data computation and API frameworks:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure your environment parameters. Duplicate `.env.example` mapping it internally to `.env`:
    ```bash
    cp .env.example .env
    ```
4.  Execute the script mapping environment constraints natively (or adjust `start_production.sh` parameters as desired):
    ```bash
    ./start.bat
    ```

### Frontend Setup

1.  Enter the UI directory space:
    ```bash
    cd FrontEnd
    ```
2.  Install core application packages resolving Tailwind UI bindings and animation dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Bind standard runtime sequences executing dynamic dev compilations:
    ```bash
    npm run dev
    ```
    This naturally deploys across `localhost:3000`.

## 🌐 Endpoints Overivew

| Method | Resource                     | Description                                            |
| :---   | :---                         | :---                                                   |
| POST   | `/api/repos/analyze`         | Dispatches RAG mappings on inbound codebases           |
| POST   | `/api/repos/chat`            | Sends queries against previously vectorized git files  |
| GET    | `/api/contribution/profile`  | Retrieves cached dynamic AI insights per-user profile. |
| POST   | `/api/contribution/analyze`  | Overrides cached contribution AI mappings cleanly      |
| POST   | `/api/assessments/evaluate`  | Evaluates student submissions natively via structured JSON |
| POST   | `/api/playground/execute`    | Passes AST trees filtering sandbox functions           |

## ✅ Security

Access mapping requires consistent JWT interactions mapped at `Bearer {token}` headers interacting directly against API route specifications.

All system architectures adhere faithfully entirely strictly defining architectural boundary principles separating data persistence safely.
