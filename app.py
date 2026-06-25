import os
import asyncio
from fastapi import FastAPI
import gradio as gr
from dotenv import load_dotenv

# Load credentials
load_dotenv()

# Initialize FastAPI App
app = FastAPI(title="AI Education Video Studio Backend", version="1.0.0")

# Setup REST Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "ok", "mcp_connection": "active"}

# Define Gradio Interface for Hugging Face Spaces
def generate_video_ui(topic, script, style, voice, music, resolution, fps):
    # Simulated pipeline run for Hugging Face ui preview
    # Coordinates MCP tools: storyboard, voice synthesis, manim render, composite.
    yield "Initializing MCP video generation agents...", None, None
    await_sec = 0.5
    
    yield "Step 1/6: Generating storyboards with Gemini...", None, None
    # Simulate step processing details
    yield "Step 2/6: Synthesizing voice and aligning timing...", None, None
    yield "Step 3/6: Rendering 2D/3D scenes and code animations...", None, None
    yield "Step 4/6: Combining video elements with transitions...", None, None
    yield "Step 5/6: Overlaying captions and subtitles...", None, None
    yield "Step 6/6: Complete! Rendering thumbnail variants...", "Success", None
    
    # We yield final outputs
    yield "Finished successfully! Video compiled.", "Variation A (Ready)", "/home/user/app/assets/sample_output.mp4"

# Gradio Page Design under 'Artistic Flair'
with gr.Blocks(theme=gr.themes.Default(primary_hue="neutral", secondary_hue="zinc")) as demo:
    gr.HTML("""
    <div style="font-family: 'Playfair Display', serif; border-bottom: 2px solid #1A1A1A; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; opacity: 0.6;">Production Suite v1.0</span>
        <h1 style="font-size: 36px; font-weight: 900; text-transform: uppercase; margin: 4px 0 0 0; tracking: -0.02em;">AI Education Studio</h1>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <p style="font-style: italic; margin: 0;">Automated visual learning generator for Shorts, Reels, and TikTok</p>
            <span style="font-family: monospace; font-size: 11px; color: #16a34a; font-weight: bold;">● MCP SERVER ACTIVE</span>
        </div>
    </div>
    """)
    
    with gr.Row():
        with gr.Column(scale=4):
            topic_input = gr.Textbox(label="Video Topic", value="Transformer Self-Attention", placeholder="Enter topic name...")
            script_input = gr.TextArea(label="Script Editor", value="In this lesson, we break down the self-attention mechanism...", rows=8)
            
            with gr.Row():
                style_sel = gr.Dropdown(["Manim (Mathematical)", "Blender (Cinematic 3D)", "Lottie (UI Motion)"], label="Animation Style", value="Manim (Mathematical)")
                voice_sel = gr.Dropdown(["Edge: Christopher (Warm)", "Piper: Arctic (Professional)", "Coqui: Standard"], label="Voice Talent", value="Edge: Christopher (Warm)")
                music_sel = gr.Dropdown(["Lo-Fi Study Beats", "Cinematic Orchestral", "Ambient Corporate", "None"], label="Background Music", value="Lo-Fi Study Beats")
                
            with gr.Row():
                res_sel = gr.Dropdown(["1080x1920 (Shorts)", "1920x1080 (Landscape)"], label="Resolution", value="1080x1920 (Shorts)")
                fps_sel = gr.Slider(minimum=24, maximum=60, value=60, step=6, label="FPS")
                
            generate_btn = gr.Button("Generate Final Export", variant="primary")
            
        with gr.Column(scale=8):
            with gr.Box() if hasattr(gr, "Box") else gr.Group():
                gr.HTML("<span style='font-size: 10px; font-weight: bold; text-transform: uppercase; tracking: 0.1em; color: #fff;'>Preview Rendering</span>")
                video_preview = gr.Video(label="Rendered Video Output", interactive=False)
                logs_out = gr.Textbox(label="Orchestration Logs", value="[SYSTEM] Initializing MCP tools...\n[VOICE] Ready.", interactive=False, max_lines=6)
                
            with gr.Row():
                with gr.Column():
                    gr.HTML("<span style='font-size: 10px; font-weight: bold; text-transform: uppercase;'>Thumbnail Generation</span>")
                    thumb_var = gr.Textbox(label="Thumbnail Variations", value="Variation A (Generated)", interactive=False)
                with gr.Column():
                    srt_dl = gr.Button("Download SRT")
                    json_dl = gr.Button("Project JSON")

    # Wire interface triggers
    generate_btn.click(
        fn=generate_video_ui,
        inputs=[topic_input, script_input, style_sel, voice_sel, music_sel, res_sel, fps_sel],
        outputs=[logs_out, thumb_var, video_preview]
    )

# Mount Gradio demo into FastAPI
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
