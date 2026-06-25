from typing import List, Dict, Any

class VoiceSynchronizer:
    """
    Manages scene timeline planning. 
    Analyses audio track durations and shifts animation speed or pacing to match speech perfectly.
    """
    def __init__(self):
        pass

    def align_durations(self, scenes: List[Dict[str, Any]], audio_durations: List[float]) -> List[Dict[str, Any]]:
        """
        Takes storyboard scenes and scales start/end boundaries based on actual synthesized vocal lengths.
        """
        updated_scenes = []
        current_time = 0.0
        
        for idx, scene in enumerate(scenes):
            duration = audio_durations[idx] if idx < len(audio_durations) else 8.0
            
            # Align boundaries
            aligned_scene = scene.copy()
            aligned_scene["start"] = current_time
            aligned_scene["end"] = current_time + duration
            
            current_time += duration
            updated_scenes.append(aligned_scene)
            
        print(f"[VoiceSynchronizer] Re-aligned {len(scenes)} scenes. Total video duration: {current_time:.2s}s")
        return updated_scenes

    def generate_srt_subtitles(self, aligned_scenes: List[Dict[str, Any]]) -> str:
        """
        Creates an SRT compliant subtitle stream mapping to aligned scene durations.
        """
        srt_content = ""
        for idx, scene in enumerate(aligned_scenes):
            start_hours = int(scene["start"] // 3600)
            start_mins = int((scene["start"] % 3600) // 60)
            start_secs = int(scene["start"] % 60)
            start_ms = int((scene["start"] % 1) * 1000)
            
            end_hours = int(scene["end"] // 3600)
            end_mins = int((scene["end"] % 3600) // 60)
            end_secs = int(scene["end"] % 60)
            end_ms = int((scene["end"] % 1) * 1000)
            
            time_str = f"{start_hours:02d}:{start_mins:02d}:{start_secs:02d},{start_ms:03d} --> {end_hours:02d}:{end_mins:02d}:{end_secs:02d},{end_ms:03d}"
            
            srt_content += f"{idx + 1}\n{time_str}\n{scene['narration']}\n\n"
            
        return srt_content
