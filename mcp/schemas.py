from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ScenePlan(BaseModel):
    id: str = Field(..., description="Unique scene ID (e.g. scene_1)")
    start: float = Field(..., description="Start time of the scene in seconds")
    end: float = Field(..., description="End time of the scene in seconds")
    narration: str = Field(..., description="Narration script spoken during this scene")
    visual_prompt: str = Field(..., description="Text prompt for what visuals to render")
    visualization_type: str = Field(..., description="Type of visual layout to use")
    visual_data: Dict[str, Any] = Field(default_factory=dict, description="Structured values to populate visualization")

class Storyboard(BaseModel):
    topic: str
    script: str
    style: str
    scenes: List[ScenePlan]

class GenerateStoryboardRequest(BaseModel):
    topic: str
    script: str
    style: Optional[str] = "Manim"
    duration: Optional[int] = 60

class GenerateVoiceRequest(BaseModel):
    text: str
    voice_name: Optional[str] = "Zephyr"

class RenderSceneRequest(BaseModel):
    scene: ScenePlan
    resolution: Optional[str] = "1080x1920"
    fps: Optional[int] = 60

class ComposeVideoRequest(BaseModel):
    storyboard: Storyboard
    vocal_paths: List[str]
    scene_paths: List[str]
    music_track: Optional[str] = None
    output_path: Optional[str] = "output.mp4"
