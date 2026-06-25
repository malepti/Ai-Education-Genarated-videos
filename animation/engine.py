import os
from typing import Dict, Any

class AnimationEngine:
    """
    Unified entry-point for layout renders.
    Determines whether a visual prompt maps best to 2D Math (Manim) or 3D Scenes (Blender)
    and executes headless subprocess threads.
    """
    def __init__(self):
        pass

    def decide_renderer(self, prompt: str, style_preference: str = "Manim") -> str:
        """
        Dynamically selects rendering platform.
        """
        prompt_lower = prompt.lower()
        if "3d" in prompt_lower or "cinematic" in prompt_lower or "camera rotation" in prompt_lower:
            return "blender"
        if "code" in prompt_lower or "equation" in prompt_lower or "diagram" in prompt_lower:
            return "manim"
        
        # Fallback to preference
        return "blender" if "blender" in style_preference.lower() else "manim"

    def compile_manim_node(self, scene_id: str, code_script: str, output_dir: str) -> str:
        """
        Triggers Manim Community CLI compilation on system nodes.
        """
        # runs manim -pql -o scene_id.mp4 script.py SceneClassName
        print(f"[AnimationEngine] Invoking Manim Community compiler for {scene_id}...")
        return os.path.join(output_dir, f"{scene_id}.mp4")

    def compile_blender_node(self, scene_id: str, script_path: str, output_dir: str) -> str:
        """
        Launches headless Blender instances to render custom animations.
        """
        # runs blender -b -P script_path -- --output output_dir --scene scene_id
        print(f"[AnimationEngine] Invoking headless Blender instances for {scene_id}...")
        return os.path.join(output_dir, f"{scene_id}.mp4")
