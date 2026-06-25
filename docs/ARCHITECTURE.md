# AI Education Video Studio - System Architecture

This document describes the production-ready architecture for the **AI Education Video Studio** application, deployable as a Hugging Face Space (Docker).

---

## 1. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GRADIO FRONTEND (app.py)                        │
│   - Topic & Script Inputs      - Voice/Style/Duration Selectors       │
│   - Real-time Progress Tracking - Video/Thumbnail Preview & Download   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / Server-Sent Events (SSE)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FASTAPI BACKEND (backend/main.py)                  │
│   - Orchestrator Controller    - Job State & Queue Management          │
│   - SSE Progress Streaming      - Static File Serving (Rendered MP4s)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON-RPC (MCP Protocol)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MCP SERVER (mcp/server.py)                           │
│   - Tool Exposer & Broker      - Orchestration Layer                   │
│   - Standard MCP Protocol Client/Server Interfaces                     │
└─────┬──────────────────┬─────────────────┬─────────────────┬───────────┘
      │                  │                 │                 │
      ▼                  ▼                 ▼                 ▼
┌───────────┐      ┌───────────┐     ┌───────────┐     ┌───────────┐
│  AGENTS   │      │ SERVICES  │     │ ANIMATION │     │   VOICE   │
│ (agents/) │      │(services/)│     │(animation/│     │  (voice/) │
│ - Script  │      │ - Gemini  │     │  render/) │     │ - EdgeTTS │
│ - Story-  │      │   Client  │     │ - Manim   │     │ - Piper   │
│   board   │      │ - FFmpeg/ │     │ - Blender │     │ - Coqui   │
│ - Scenes  │      │   MoviePy │     │ - Lottie  │     │ - Sync    │
└───────────┘      └───────────┘     └───────────┘     └───────────┘
```

---

## 2. Component Design

### 2.1 Gradio Frontend (`app.py` / `frontend/`)
The Gradio frontend provides a responsive, web-based UI optimized for both desktop and mobile. It features:
*   **Settings Panel**: Video specifications (aspect ratio, resolution, FPS, duration), style selection, voice settings, and background music.
*   **Generation Panel**: Topic and script editor textboxes, with a trigger button for launching video generation.
*   **Preview & History**: Display of the generated thumbnail, final MP4 video, subtitles (SRT), and a history log of previously exported projects.
*   **Progress Indicators**: Granular feedback from the orchestrator via SSE, showing which stage (e.g., scene rendering, voice sync) is active.

### 2.2 FastAPI Backend (`backend/`)
The FastAPI application acts as the web gateway, handling routing, static media delivery, and state orchestration:
*   **Execution Engine**: Translates Gradio UI actions into asynchronous generation jobs.
*   **Job Queue**: Coordinates stateful generation jobs without blocking the main event loop.
*   **Progress SSE Server**: Broadcasts compilation and rendering statuses back to the frontend.

### 2.3 Model Context Protocol (MCP) Server (`mcp/`)
The **MCP Server** serves as the central orchestration layer. Instead of loose helper files, every discrete operation (storyboard generation, scene rendering, subtitle compilation, video compositing) is registered as an **MCP Tool**.
*   **Tool broker**: Exposes modular endpoints complying with the Model Context Protocol.
*   **Loose-coupling**: Allows external agents (or the FastAPI service itself) to invoke video studio capabilities dynamically.

### 2.4 Autonomous Agents (`agents/`)
Utilizes the Gemini API (using the `@google/genai` Python library) to act as expert creative directors:
*   **Creative Agent**: Evaluates the topic/script to plan scenes and select the appropriate visual style.
*   **Storyboard Agent**: Breaks down the script into time-coded scenes, complete with layout planning, key visual references (neural networks, databases, API flows), and voiceover prompts.

### 2.5 Multi-Renderer Animation Engine (`animation/` & `render/`)
The animation sub-system decides on the rendering technology depending on the scene specification:
*   **Manim Renderer**: Generates math, algorithms, code sequences, and structural diagrams (e.g., neural networks, database schemas, flowcharts).
*   **Blender Automation**: Executes headless script rendering for high-fidelity 3D motion graphics, camera pans, zooms, and spatial concepts.
*   **Lottie/Canvas (SVG)**: Compiles lightweight 2D illustrations and iconography.

### 2.6 Voice & Subtitle Sync Engine (`voice/`)
Synchronizes natural speech synthesis with visual events:
*   **TTS Pipeline**: Generates audio segments via Microsoft Edge TTS, Piper, or Coqui TTS.
*   **Phoneme & Timing Aligner**: Uses audio waveforms or subtitle lengths to stretch/shrink scene visual durations, guaranteeing a perfect synchronization between what is spoken and what is shown.
*   **Subtitles Builder**: Generates precise SRT timing files and merges them as styled open captions on top of the visual scenes.

### 2.7 Video Composer (`services/video_composer.py`)
Compiles final production files by executing automated FFmpeg commands or MoviePy pipelines:
*   Stitches scene renders sequentially using standard transition animations.
*   Mixes background music with the narrated vocal track, implementing ducking (lowering music volume when speaking).
*   Overlays dynamic open-caption subtitles.
*   Exports final MP4, project JSON packages, and custom thumbnails.

---

## 3. Operational Environment (Hugging Face Spaces)

*   **Dockerfile Architecture**: Uses a multi-stage Ubuntu/Debian base containing Python, FFmpeg, Manim system dependencies (`pango`, `cairo`, `texlive`), and headless Blender binaries.
*   **CPU/GPU Autosensing**: Dynamically falls back to standard multiprocessing rendering when CUDA is unavailable, optimization is done via optimized NumPy arrays and chunked FFmpeg sub-processes.
*   **Local Caching**: Stores intermediate scene assets, synthesized vocals, and models (like TTS engines) in a local cache directory to speed up iterative renders.
