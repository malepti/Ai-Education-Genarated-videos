# AI Education Video Studio - Project Directory Structure

Below is the complete, modular directory structure of the project. This structure satisfies Hugging Face Space Docker requirements and organizes our backend, frontend, MCP servers, and specialized animation/voice assets.

```
/
├── app.py                      # Main Hugging Face entry point (Gradio UI + FastAPI mount)
├── Dockerfile                  # Production multi-stage Docker build config
├── requirements.txt            # Python dependencies (Manim, FastAPI, Gradio, MoviePy, etc.)
├── packages.txt                # System level APT packages (FFmpeg, Cairo, Pango, Blender)
├── README.md                   # Hugging Face Spaces app card metadata & overview
├── .env.example                # Template for Gemini API key, path config, etc.
│
├── backend/                    # FastAPI Web Server
│   ├── __init__.py
│   ├── main.py                 # FastAPI application, middleware, and router setup
│   ├── config.py               # Settings, env vars, and resource limit parameters
│   └── routes/                 # FastAPI routes (Jobs, SSE progress, Assets)
│       ├── __init__.py
│       ├── jobs.py             # Video generation job controllers
│       └── assets.py           # Static media and export download endpoints
│
├── mcp/                        # Model Context Protocol (MCP) Server
│   ├── __init__.py
│   ├── server.py               # MCP Server definition and registration of tools
│   ├── schemas.py              # Pydantic models for protocol schemas
│   └── tools/                  # Concrete implementation of each MCP tool
│       ├── __init__.py
│       ├── storyboard.py       # Tool: generate_storyboard
│       ├── scene.py            # Tool: generate_scene, render_scene
│       ├── voice.py            # Tool: generate_voice
│       ├── video.py            # Tool: compose_video, export_video
│       └── thumbnail.py        # Tool: generate_thumbnail
│
├── agents/                     # LLM/GenAI Reasoners and Planners
│   ├── __init__.py
│   ├── creative_agent.py       # Determines script concept and visual style
│   ├── storyboard_agent.py     # Converts script to time-coded storyboard layouts
│   └── asset_agent.py          # Plans diagrams, code visualizations, and icons
│
├── services/                   # Business Logic & Third-Party Wrappers
│   ├── __init__.py
│   ├── gemini_service.py       # Client wrapper for Google GenAI SDK
│   └── video_composer.py       # MoviePy/FFmpeg pipeline for compiling video layers
│
├── animation/                  # Multi-Renderer Animation Layer
│   ├── __init__.py
│   ├── engine.py               # Director that chooses between Manim and Blender
│   └── renderers/              # Specific rendering logic wrappers
│       ├── __init__.py
│       ├── manim_renderer.py   # Specialized code, math, and diagram builder
│       └── blender_renderer.py # Headless 3D animations and camera motions
│
├── voice/                      # Audio Generation and Waveform Synchronization
│   ├── __init__.py
│   ├── generator.py            # TTS driver (EdgeTTS, Piper, Coqui)
│   └── synchronizer.py         # Subtitle aligner and scene duration adjusters
│
├── assets/                     # Media Files and Fonts
│   ├── music/                  # Free & background loop soundtracks
│   ├── fonts/                  # JetBrains Mono, Inter, and display font files
│   └── icons/                  # SVG standard base templates
│
├── templates/                  # Automated Code Templates for Rendering
│   ├── manim_templates.py      # Standard boilerplate codes for flowcharts, code views, etc.
│   └── blender_scripts/        # Python automation scripts for Blender API
│
├── docs/                       # Architectural and Technical Guides
│   ├── ARCHITECTURE.md
│   └── FOLDER_STRUCTURE.md
│
├── scripts/                    # Automation and Setup scripts
│   ├── download_models.py      # Script to warm-up and cache TTS or font models
│   └── run_local.sh            # Simple script to trigger the environment locally
│
└── tests/                      # Automated Test Suite
    ├── __init__.py
    ├── test_mcp.py
    ├── test_voice.py
    └── test_animation.py
```
