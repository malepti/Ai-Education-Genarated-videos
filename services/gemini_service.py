import os
import json
from typing import Dict, Any, List
from google import genai
from google.genai import types

class GeminiService:
    """
    Service wrapper for Google GenAI SDK.
    Responsible for script comprehension, scene orchestration reasoning, and voice prompts.
    """
    def __init__(self):
        # Always use process.env.GEMINI_API_KEY
        api_key = os.getenv("GEMINI_API_KEY", "MOCK_KEY")
        self.client = genai.Client(api_key=api_key)

    def analyze_script(self, topic: str, script: str, style: str = "Manim") -> List[Dict[str, Any]]:
        """
        Uses gemini-3.5-flash to break down scripts into visualizable, time-coded chunks.
        """
        prompt = f"""
        Topic: {topic}
        Script: {script}
        Style: {style}
        
        Generate a structured JSON representing storyboard scenes.
        Exclude markdown formatting from the response.
        """
        
        try:
            response = self.client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"[GeminiService] Warning: Call failed, returning fallback sequence. Error: {e}")
            return [
                {
                    "id": "scene_1",
                    "start": 0,
                    "end": 5,
                    "narration": script[:100],
                    "visualization_type": "text-animation",
                    "visual_data": {"primary": topic, "secondary": "Intro"}
                }
            ]
            
    def synthesize_speech_base64(self, text: str, voice_name: str = "Zephyr") -> str:
        """
        Synthesizes speech using the dedicated Gemini Text-to-Speech preview model.
        """
        try:
            response = self.client.models.generate_content(
                model='gemini-3.1-flash-tts-preview',
                contents=f"Say: {text}",
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name=voice_name
                            )
                        )
                    )
                )
            )
            
            # Find the base64 inline audio data
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    return part.inline_data.data
            raise ValueError("No audio part returned in response.")
        except Exception as e:
            print(f"[GeminiService] TTS failure: {e}")
            return ""
