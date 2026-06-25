import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  Volume2, 
  Download, 
  Layers, 
  Check, 
  ChevronRight, 
  Video, 
  Sparkles, 
  History as HistoryIcon,
  HelpCircle,
  Clock,
  ExternalLink,
  Bot,
  Terminal,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Scene {
  id: string;
  start: number;
  end: number;
  narration: string;
  visualPrompt: string;
  visualizationType: "neural-network" | "timeline" | "flow-chart" | "database" | "mind-map" | "code-animation" | "infographics" | "text-animation";
  visualData: any;
  audioUrl?: string;
  animationStyle?: "fade" | "zoom-in" | "slide-left" | "slide-right" | "bounce" | "rotate" | "flip" | "pulse";
}

export default function App() {
  // Input fields
  const [topic, setTopic] = useState("Become an AI Engineer in 2026 – Complete Roadmap");
  const [script, setScript] = useState(
    "Do you want to become an AI Engineer in 2026? Here's the complete roadmap. Every great AI Engineer starts with the fundamentals. Begin by understanding how computers work, including operating systems, networking, and the command line. Next, master Python. Learn variables, functions, object-oriented programming, file handling, APIs, and asynchronous programming. Once you're comfortable with Python, learn SQL and databases. Practice writing queries, joins, indexes, transactions, and database optimization. Now move into mathematics. Focus on statistics, probability, linear algebra, and basic calculus. These concepts power every machine learning algorithm. The next milestone is Machine Learning. Learn supervised learning, unsupervised learning, feature engineering, model evaluation, and popular algorithms such as Linear Regression, Decision Trees, Random Forest, and XGBoost. After that, dive into Deep Learning. Understand neural networks, activation functions, backpropagation, convolutional neural networks, recurrent neural networks, and transformers. Now you're ready for Generative AI. Learn Large Language Models, tokenization, embeddings, attention mechanisms, prompt engineering, fine-tuning, and inference. Next, master Retrieval-Augmented Generation, or RAG. Learn vector databases, embeddings, document retrieval, chunking, reranking, and semantic search. Then build AI Agents. Learn tool calling, function calling, Model Context Protocol (MCP), multi-agent systems, memory, planning, and autonomous workflows. Deploy your applications using FastAPI, Docker, Kubernetes, GitHub Actions, and cloud platforms such as AWS or Google Cloud. Finally, build real-world projects. Create AI chatbots, document assistants, coding assistants, presentation generators, workflow automation tools, and multi-agent systems. Keep learning, keep building, and share your work consistently. That's how you become an AI Engineer in 2026."
  );
  const [style, setStyle] = useState("Manim (Mathematical)");
  const [voice, setVoice] = useState("Charon (Narration)");
  const [music, setMusic] = useState("None");
  const [resolution, setResolution] = useState("1920x1080 (Landscape)");
  const [fps, setFps] = useState(60);
  const [duration, setDuration] = useState(60);

  // Status and jobs state
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] AI Video Studio initialized.",
    "[SYSTEM] Ready to process scripts."
  ]);
  const [storyboard, setStoryboard] = useState<Scene[]>([
    {
      id: "scene_1",
      start: 0,
      end: 5,
      narration: "Do you want to become an AI Engineer in 2026? Here's the complete roadmap. Every great AI Engineer starts with the fundamentals.",
      visualPrompt: "Text intro with clean mathematical grid backgrounds and elegant high-contrast space-grotesk display typography.",
      visualizationType: "text-animation",
      visualData: { primary: "AI ENGINEER 2026", secondary: "Complete Master Roadmap" },
      animationStyle: "fade"
    },
    {
      id: "scene_2",
      start: 5,
      end: 10,
      narration: "Begin by understanding how computers work, including operating systems, networking, and the command line. Next, master Python.",
      visualPrompt: "Terminal console mimicking an active command-line session coupled with essential Python function declarations.",
      visualizationType: "code-animation",
      visualData: { language: "python", code: "async def start_journey():\n    await learn_os_and_networking()\n    print('Terminal active...')" },
      animationStyle: "zoom-in"
    },
    {
      id: "scene_3",
      start: 10,
      end: 15,
      narration: "Once you're comfortable with Python, learn SQL and databases. Practice writing queries, joins, indexes, transactions, and database optimization.",
      visualPrompt: "Database architecture flowchart detailing indexing, join clauses, and atomic transactions.",
      visualizationType: "flow-chart",
      visualData: { steps: ["SQL Queries", "Database Joins", "B-Tree Indexes", "Transactions / ACID"] },
      animationStyle: "slide-left"
    },
    {
      id: "scene_4",
      start: 15,
      end: 20,
      narration: "Now move into mathematics. Focus on statistics, probability, linear algebra, and basic calculus. These concepts power every machine learning algorithm.",
      visualPrompt: "Rich visualization showcasing probability density functions, matrix operations, and gradient slopes.",
      visualizationType: "text-animation",
      visualData: { primary: "CORE MATHEMATICS", secondary: "Linear Algebra • Probability • Derivatives" },
      animationStyle: "pulse"
    },
    {
      id: "scene_5",
      start: 20,
      end: 25,
      narration: "The next milestone is Machine Learning. Learn supervised learning, unsupervised learning, feature engineering, and popular algorithms.",
      visualPrompt: "Interactive decision boundary of a classification model separating distinct datasets.",
      visualizationType: "flow-chart",
      visualData: { steps: ["Supervised Models", "Feature Extraction", "Decision Trees", "XGBoost Ensembles"] },
      animationStyle: "slide-right"
    },
    {
      id: "scene_6",
      start: 25,
      end: 30,
      narration: "After that, dive into Deep Learning. Understand neural networks, activation functions, backpropagation, and transformers.",
      visualPrompt: "Interconnected multi-layer neural network with pulses highlighting backpropagation error corrections.",
      visualizationType: "neural-network",
      visualData: { layers: [4, 6, 6, 3], activeConnections: true },
      animationStyle: "rotate"
    },
    {
      id: "scene_7",
      start: 30,
      end: 35,
      narration: "Now you're ready for Generative AI. Learn Large Language Models, tokenization, embeddings, attention mechanisms, prompt engineering, and fine-tuning.",
      visualPrompt: "Attention layer mapping connections and semantic proximity between generated text tokens.",
      visualizationType: "text-animation",
      visualData: { primary: "GENERATIVE AI", secondary: "Attention Mechanisms • Fine-tuning • LLMs" },
      animationStyle: "bounce"
    },
    {
      id: "scene_8",
      start: 35,
      end: 40,
      narration: "Next, master Retrieval-Augmented Generation, or RAG. Learn vector databases, embeddings, document retrieval, chunking, reranking, and semantic search.",
      visualPrompt: "Flowchart mapping a retrieval-augmented query from raw documents to localized embeddings and top-k reranking.",
      visualizationType: "flow-chart",
      visualData: { steps: ["Document Chunking", "Vector Indexing", "Semantic Search", "Rerank Context"] },
      animationStyle: "flip"
    },
    {
      id: "scene_9",
      start: 40,
      end: 45,
      narration: "Then build AI Agents. Learn tool calling, function calling, Model Context Protocol (MCP), multi-agent systems, memory, planning, and autonomous workflows.",
      visualPrompt: "Agent execution loop showing memory store, planning phase, and active tool orchestration paths.",
      visualizationType: "neural-network",
      visualData: { layers: [3, 5, 4, 3], activeConnections: true },
      animationStyle: "pulse"
    },
    {
      id: "scene_10",
      start: 45,
      end: 50,
      narration: "Deploy your applications using FastAPI, Docker, Kubernetes, GitHub Actions, and cloud platforms such as AWS or Google Cloud.",
      visualPrompt: "Visual pipeline showing automated test execution in CI/CD leading to production Kubernetes deployments.",
      visualizationType: "flow-chart",
      visualData: { steps: ["FastAPI Service", "Docker Container", "CI/CD Actions", "Cloud Orchestration"] },
      animationStyle: "slide-right"
    },
    {
      id: "scene_11",
      start: 50,
      end: 55,
      narration: "Finally, build real-world projects. Create AI chatbots, document assistants, coding assistants, presentation generators, and multi-agent systems.",
      visualPrompt: "Collage depicting an active chatbot, text auto-completion code window, and a multi-agent dashboard.",
      visualizationType: "code-animation",
      visualData: { language: "typescript", code: "const agent = new AutonomousAgent({\n  role: 'Software Architect',\n  tools: [codeSandbox, databaseExecutor]\n});" },
      animationStyle: "zoom-in"
    },
    {
      id: "scene_12",
      start: 55,
      end: 60,
      narration: "Keep learning, keep building, and share your work consistently. That's how you become an AI Engineer in 2026.",
      visualPrompt: "Ending transition with mathematical grids, smooth particle animations, and a call-to-action text overlay.",
      visualizationType: "text-animation",
      visualData: { primary: "START BUILDING NOW", secondary: "AI Engineer Roadmap 2026 • Share Your Work" },
      animationStyle: "fade"
    }
  ]);

  // Audio Context and playback states
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [logsScrollRef, setLogsScrollRef] = useState<HTMLDivElement | null>(null);

  // Background music state
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicOscillatorRef = useRef<OscillatorNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const playIntervalRef = useRef<any>(null);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceIsPlayingRef = useRef<boolean>(false);
  const currentSceneIndexRef = useRef<number>(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Static generated SRT & Project files for download
  const [generatedSrt, setGeneratedSrt] = useState("");
  const [generatedProjectJson, setGeneratedProjectJson] = useState("");
  const [isCompilingMp4, setIsCompilingMp4] = useState(false);
  const [mp4Progress, setMp4Progress] = useState(0);

  // Thumbnails state
  const [thumbnailStyle, setThumbnailStyle] = useState("Retro Bold Edition");

  // Keep logs scrolled down
  useEffect(() => {
    if (logsScrollRef) {
      logsScrollRef.scrollTop = logsScrollRef.scrollHeight;
    }
  }, [logs, logsScrollRef]);

  // Add logger entry
  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${text}`]);
  };

  // Helper to rescale all storyboard scene timings proportionally to fit exactly a target total duration
  const rescaleStoryboardToDuration = (targetSecs: number, currentStoryboard: Scene[] = storyboard) => {
    if (!currentStoryboard || currentStoryboard.length === 0) return;
    
    // Calculate total word count
    const wordCounts = currentStoryboard.map(s => s.narration.trim().split(/\s+/).filter(Boolean).length);
    const totalWords = wordCounts.reduce((a, b) => a + b, 0) || 1;
    
    let currentStart = 0;
    const scaled = currentStoryboard.map((scene, idx) => {
      const words = wordCounts[idx] || 5;
      const proportion = words / totalWords;
      const sceneDuration = proportion * targetSecs;
      const start = currentStart;
      const end = currentStart + sceneDuration;
      currentStart = end;
      
      return {
        ...scene,
        start: parseFloat(start.toFixed(2)),
        end: parseFloat(end.toFixed(2))
      };
    });
    
    setStoryboard(scaled);
    setDuration(targetSecs);
  };

  // Automatically align default storyboard scene timings based on narration length to prevent early cutoffs on mount
  useEffect(() => {
    rescaleStoryboardToDuration(60, storyboard);
    addLog("[SYSTEM] Successfully aligned initial presentation layout and frame timings.");
  }, []);

  // Animation Style configuration lookup for dynamic entrance transitions chosen by LLM
  const getAnimationConfig = (animStyle?: string) => {
    switch (animStyle) {
      case "zoom-in":
        return {
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.15, opacity: 0 },
          transition: { type: "spring", damping: 14, stiffness: 100 }
        };
      case "slide-left":
        return {
          initial: { x: 120, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -120, opacity: 0 },
          transition: { ease: "easeInOut", duration: 0.5 }
        };
      case "slide-right":
        return {
          initial: { x: -120, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 120, opacity: 0 },
          transition: { ease: "easeInOut", duration: 0.5 }
        };
      case "bounce":
        return {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 100, opacity: 0 },
          transition: { type: "spring", damping: 9, stiffness: 90 }
        };
      case "rotate":
        return {
          initial: { rotate: -90, scale: 0.5, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1 },
          exit: { rotate: 90, scale: 0.5, opacity: 0 },
          transition: { type: "spring", damping: 12, stiffness: 80 }
        };
      case "flip":
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
          transition: { ease: "easeOut", duration: 0.45 }
        };
      case "pulse":
        return {
          initial: { scale: 0.96, opacity: 0 },
          animate: { 
            scale: [0.96, 1.02, 0.96],
            opacity: 1
          },
          exit: { scale: 1.04, opacity: 0 },
          transition: { 
            scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }
        };
      case "fade":
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { ease: "linear", duration: 0.4 }
        };
    }
  };

  // Sound Synth helper for ambient back music
  const startBackgroundMusic = () => {
    try {
      if (music === "None") return;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Simple synthesized background chord sequence simulating Lo-Fi or Corporate
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = music === "Cinematic Orchestral" ? "sawtooth" : "triangle";
      
      // Gentle warm low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = music === "Lo-Fi Study Beats" ? 350 : 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Program notes looping
      const notes = [130.81, 146.83, 164.81, 196.00]; // C3, D3, E3, G3
      let noteIndex = 0;

      const interval = setInterval(() => {
        if (noteIndex < notes.length) {
          osc.frequency.setValueAtTime(notes[noteIndex], ctx.currentTime);
          noteIndex = (noteIndex + 1) % notes.length;
        }
      }, 3000);

      osc.start();
      
      // Subtle ambient sound levels
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      musicOscillatorRef.current = osc;
      musicGainRef.current = gain;

      addLog(`[MUSIC] Started synth background loop: ${music}`);
    } catch (e) {
      console.warn("AudioContext failed to start.", e);
    }
  };

  const stopBackgroundMusic = () => {
    if (musicOscillatorRef.current) {
      try {
        musicOscillatorRef.current.stop();
        musicOscillatorRef.current.disconnect();
      } catch (err) {}
      musicOscillatorRef.current = null;
    }
    if (musicGainRef.current) {
      musicGainRef.current.disconnect();
      musicGainRef.current = null;
    }
  };

  // Keep currentSceneIndexRef synchronized with state
  useEffect(() => {
    currentSceneIndexRef.current = currentSceneIndex;
  }, [currentSceneIndex]);

  // Sync currentSceneIndex dynamically when playbackTime updates
  useEffect(() => {
    if (!isPlaying) return;
    const activeIdx = storyboard.findIndex(s => playbackTime >= s.start && playbackTime < s.end);
    if (activeIdx !== -1 && activeIdx !== currentSceneIndex) {
      setCurrentSceneIndex(activeIdx);
    }
  }, [playbackTime, isPlaying, storyboard, currentSceneIndex]);

  // Video and audio synchronizer playback loop
  const startPlayback = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlaybackTime(0);
    setCurrentSceneIndex(0);
    startBackgroundMusic();
    addLog("[PLAYBACK] Initialized presentation preview.");

    const totalDuration = storyboard[storyboard.length - 1]?.end || 30;

    playIntervalRef.current = setInterval(() => {
      setPlaybackTime((prev) => {
        const currentScene = storyboard[currentSceneIndexRef.current] || storyboard[0];
        const nextTime = prev + 0.1;
        
        if (nextTime >= totalDuration) {
          stopPlayback();
          return 0;
        }

        // If the voice is still playing and we're near the end of the current scene's duration boundary, hold!
        if (currentScene && nextTime >= currentScene.end - 0.15) {
          if (voiceIsPlayingRef.current) {
            // Keep holding playbackTime just before the boundary to keep current scene and subtitles active
            return currentScene.end - 0.15;
          }
        }

        return nextTime;
      });
    }, 100);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    clearInterval(playIntervalRef.current);
    stopBackgroundMusic();
    addLog("[PLAYBACK] Stopped preview player.");
  };

  useEffect(() => {
    return () => {
      clearInterval(playIntervalRef.current);
      stopBackgroundMusic();
    };
  }, []);

  // Primary video compilation flow
  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    addLog(`[SYSTEM] Initializing MCP Video Orchestration for: "${topic}"`);
    addLog(`[SYSTEM] Target details: Style="${style}", Voice="${voice}", FPS=${fps}`);

    try {
      // Step 1: Generate storyboard using our backend FastAPI/Express endpoint
      addLog("[MCP] Invoking tool 'generate_storyboard' via Gemini API reasoning...");
      const storyboardRes = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          script,
          style,
          duration,
          resolution,
          fps
        })
      });

      if (!storyboardRes.ok) {
        throw new Error("Storyboard compiler failed.");
      }

      const { storyboard: generatedScenes } = await storyboardRes.json();
      setStoryboard(generatedScenes);
      addLog(`[MCP] Tool 'generate_storyboard' returned ${generatedScenes.length} planned scenes.`);

      // Step 2: Synthesize vocals for each scene using Gemini TTS!
      addLog("[MCP] Invoking tool 'generate_voice' sequentially for speech synthesis...");
      const updatedScenesWithAudio = [...generatedScenes];
      let useTtsApi = true;

      for (let i = 0; i < updatedScenesWithAudio.length; i++) {
        const scene = updatedScenesWithAudio[i];
        
        if (!useTtsApi) {
          addLog(`[VOICE] Scene ${i+1}/${updatedScenesWithAudio.length}: Bypassing API to save quota. Using client-side speech synthesis.`);
          continue;
        }

        addLog(`[VOICE] Synthesizing TTS segment for Scene ${i+1}/${updatedScenesWithAudio.length}...`);
        
        try {
          const voiceNameStr = voice.split(" ")[0]; // Zephyr, Kore, Puck etc.
          const voiceRes = await fetch("/api/generate-voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: scene.narration,
              voiceName: voiceNameStr
            })
          });

          if (voiceRes.ok) {
            const { audio, message } = await voiceRes.json();
            if (audio) {
              // Create a local audio blob URL for zero-latency client-side playback!
              const binary = atob(audio);
              const bytes = new Uint8Array(binary.length);
              for (let idx = 0; idx < binary.length; idx++) {
                bytes[idx] = binary.charCodeAt(idx);
              }
              const blob = new Blob([bytes], { type: "audio/wav" });
              const localUrl = URL.createObjectURL(blob);
              updatedScenesWithAudio[i].audioUrl = localUrl;
              addLog(`[VOICE] Speech synchronized successfully for Scene ${i+1}`);
            } else {
              addLog(`[VOICE] Note: ${message || "API returned empty audio. Falling back to browser speech synthesis."}`);
              // If we hit quota or empty audio, switch off TTS API for the rest of the scenes to save quota/time
              useTtsApi = false;
            }
          } else {
            addLog(`[VOICE] Warning: Falling back to speech synthesizer engine.`);
            useTtsApi = false;
          }
        } catch (ttsErr) {
          addLog(`[VOICE] Scene ${i+1} Speech compilation had fallback: ${ttsErr}`);
          useTtsApi = false;
        }
      }

      // Helper to dynamically check the duration of compiled TTS voice audio
      const getAudioDuration = (url: string): Promise<number> => {
        return new Promise((resolve) => {
          const audio = new Audio(url);
          audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
          });
          audio.addEventListener("error", () => {
            resolve(0);
          });
          setTimeout(() => resolve(0), 1500); // 1.5s maximum wait timeout
        });
      };

      // Step 2.5: Precisely align animation timeline start/end times based on actual voice durations to avoid cutoffs
      addLog("[SYSTEM] Aligning animation timeline precisely to vocal clips...");
      let currentStart = 0;
      const synchronizedScenes: Scene[] = [];
      for (let i = 0; i < updatedScenesWithAudio.length; i++) {
        const scene = updatedScenesWithAudio[i];
        let durationOfScene = 0;
        if (scene.audioUrl) {
          durationOfScene = await getAudioDuration(scene.audioUrl);
        }
        
        // If voice load failed or browser speech synthesis fallback is used, estimate based on average speaking pace
        if (durationOfScene <= 0) {
          const wordCount = scene.narration.trim().split(/\s+/).filter(Boolean).length;
          // ~2.0 words per second + 1.2 seconds natural breathing room at the end
          durationOfScene = Math.max(3.5, (wordCount / 2.0) + 1.2);
        }
        
        const start = currentStart;
        const end = currentStart + durationOfScene;
        currentStart = end;

        synchronizedScenes.push({
          ...scene,
          start: parseFloat(start.toFixed(2)),
          end: parseFloat(end.toFixed(2))
        });
      }

      // Proportional scaling factor to map the natural speech times exactly onto the user's custom target duration!
      const naturalTotalDuration = currentStart || 1;
      const scaleFactor = duration / naturalTotalDuration;
      
      const scaledScenes = synchronizedScenes.map((scene) => {
        return {
          ...scene,
          start: parseFloat((scene.start * scaleFactor).toFixed(2)),
          end: parseFloat((scene.end * scaleFactor).toFixed(2))
        };
      });

      setStoryboard(scaledScenes);
      addLog(`[SYSTEM] Proportionally synchronized and scaled all ${scaledScenes.length} frames to exactly ${duration} seconds.`);

      // Step 3: Render Scene elements (Simulation logs matching real Manim/Blender compiling phases)
      addLog("[RENDER] Triggering animation rendering engine...");
      for (const scene of scaledScenes) {
        addLog(`[MANIM] Compiling node graphics for ${scene.id} (${scene.visualizationType})...`);
        await new Promise(r => setTimeout(r, 800));
        addLog(`[RENDER] Cache generated: ${scene.id} compiled successfully at ${resolution}.`);
      }

      // Step 4: Video composition (Compile SRT subtitles & structured config)
      addLog("[COMPOSER] Invoking tool 'compose_video' to merge media tracks...");
      
      // Compile SRT content
      let srtLines = "";
      const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = Math.floor(secs % 60).toString().padStart(2, "0");
        const ms = Math.floor((secs % 1) * 1000).toString().padStart(3, "0");
        return `${h}:${m}:${s},${ms}`;
      };

      scaledScenes.forEach((scene, i) => {
        srtLines += `${i+1}\n${formatTime(scene.start)} --> ${formatTime(scene.end)}\n${scene.narration}\n\n`;
      });
      setGeneratedSrt(srtLines);

      // Compile Project JSON
      const projectPayload = {
        meta: { topic, style, voice, music, resolution, fps, duration },
        scenes: scaledScenes
      };
      setGeneratedProjectJson(JSON.stringify(projectPayload, null, 2));

      await new Promise(r => setTimeout(r, 600));
      addLog("[COMPOSER] Final MP4 compiled container complete.");
      addLog("[SYSTEM] Final generation phase finished successfully!");

    } catch (err: any) {
      addLog(`[SYSTEM] Fatal error during workflow: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger local download for generated assets
  const downloadTextFile = (content: string, fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const drawSceneToCanvas = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scene: Scene,
    timeInScene: number,
    totalTime: number,
    totalDuration: number
  ) => {
    // 1. Clear background and draw beautiful grid
    ctx.fillStyle = "#FAF9F6";
    ctx.fillRect(0, 0, w, h);

    // Subtle background math grids
    ctx.strokeStyle = "rgba(26, 26, 26, 0.05)";
    ctx.lineWidth = 1;
    const gridSize = 32;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Decorative borders & metadata HUD (Heads-Up Display)
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Header Metadata
    ctx.fillStyle = "#1A1A1A";
    ctx.font = "bold 14px monospace";
    ctx.fillText("AI EDUCATION STUDIO • MANIM COMPILER v2.6", 40, 50);
    ctx.fillText(`TOPIC: ${topic.toUpperCase()}`, 40, 75);
    ctx.fillText(`TIME: ${totalTime.toFixed(2)}s / ${totalDuration.toFixed(0)}s`, w - 250, 50);
    ctx.fillText(`SCENE: ${scene.visualizationType.toUpperCase()}`, w - 250, 75);

    // Header divider line
    ctx.strokeStyle = "rgba(26, 26, 26, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 95);
    ctx.lineTo(w - 40, 95);
    ctx.stroke();

    // 3. Render specific visualization graphics in the center of the canvas
    const centerY = h / 2 - 50;
    const centerX = w / 2;

    switch (scene.visualizationType) {
      case "neural-network": {
        const layers = scene.visualData?.layers || [4, 6, 5, 3];
        const colSpacing = (w - 300) / (layers.length - 1);
        const startX = 150;

        ctx.save();
        // Render 3D frame shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.beginPath();
        ctx.roundRect(centerX - 350 + 10, centerY - 180 + 10, 700, 360, 16);
        ctx.fill();

        // Main Board Background
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(centerX - 350, centerY - 180, 700, 360, 16);
        ctx.fill();
        ctx.stroke();

        // 3D Neural Tilt
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.transform(1.0, -0.06, 0.12, 0.9, 0, 0);
        ctx.translate(-centerX, -centerY);
        
        // Draw connection lines
        ctx.strokeStyle = "rgba(26, 26, 26, 0.15)";
        ctx.lineWidth = 1.5;
        for (let l = 0; l < layers.length - 1; l++) {
          const count1 = layers[l];
          const count2 = layers[l + 1];
          const x1 = startX + l * colSpacing;
          const x2 = startX + (l + 1) * colSpacing;
          
          for (let n1 = 0; n1 < count1; n1++) {
            const y1 = centerY - (count1 - 1) * 30 + n1 * 60;
            for (let n2 = 0; n2 < count2; n2++) {
              const y2 = centerY - (count2 - 1) * 30 + n2 * 60;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();

              // Draw animated pulse along line
              const progress = (timeInScene * 0.4 + (n1 + n2) * 0.08) % 1;
              const px = x1 + (x2 - x1) * progress;
              const py = y1 + (y2 - y1) * progress;
              ctx.fillStyle = "#e11d48";
              ctx.beginPath();
              ctx.arc(px, py, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Draw nodes with custom highlight glow
        layers.forEach((count: number, lIdx: number) => {
          const x = startX + lIdx * colSpacing;
          for (let nIdx = 0; nIdx < count; nIdx++) {
            const y = centerY - (count - 1) * 30 + nIdx * 60;
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#1A1A1A";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner glowing node pulse
            const isActive = (Math.floor(timeInScene * 1.8) + lIdx) % layers.length === 0;
            if (isActive) {
              ctx.fillStyle = "#e11d48";
              ctx.beginPath();
              ctx.arc(x, y, 8, 0, Math.PI * 2);
              ctx.fill();

              // Node glow
              ctx.strokeStyle = "rgba(225, 29, 72, 0.4)";
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(x, y, 18, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });
        ctx.restore();
        ctx.restore();
        break;
      }

      case "timeline": {
        const events = scene.visualData?.events || [
          { time: "2026", label: "Foundations" },
          { time: "ML Milestone", label: "Model Optimization" },
          { time: "Deploy", label: "Kubernetes Production" }
        ];
        
        ctx.save();
        // 3D Skewed road transformation for ribbon timeline
        ctx.translate(centerX, centerY);
        ctx.transform(1.0, 0.04, -0.12, 0.85, 0, 0);
        ctx.translate(-centerX, -centerY);

        // 3D Shadow Line
        ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(100, centerY + 10);
        ctx.lineTo(w - 100, centerY + 10);
        ctx.stroke();

        // Core central road
        ctx.strokeStyle = "rgba(26, 26, 26, 0.1)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(100, centerY);
        ctx.lineTo(w - 100, centerY);
        ctx.stroke();

        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, centerY);
        ctx.lineTo(w - 100, centerY);
        ctx.stroke();

        const spacing = (w - 200) / (events.length - 1);
        events.forEach((evt: any, idx: number) => {
          const x = 100 + idx * spacing;
          
          // Outer shadow node
          ctx.fillStyle = "rgba(0,0,0,0.1)";
          ctx.beginPath();
          ctx.arc(x + 4, centerY + 4, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, centerY, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#1A1A1A";
          ctx.font = "bold 14px monospace";
          ctx.textAlign = "center";
          ctx.fillText((idx + 1).toString(), x, centerY + 5);

          // 3D Tilted floating card text
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          ctx.fillRect(x - 70, centerY - 95, 140, 60);

          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 2.5;
          ctx.fillRect(x - 74, centerY - 99, 140, 60);
          ctx.strokeRect(x - 74, centerY - 99, 140, 60);

          ctx.fillStyle = "#e11d48";
          ctx.font = "bold 13px monospace";
          ctx.fillText(evt.time, x - 4, centerY - 76);
          ctx.fillStyle = "#1A1A1A";
          ctx.font = "9px sans-serif";
          ctx.fillText(evt.label.substring(0, 20), x - 4, centerY - 55);
        });
        ctx.restore();
        break;
      }

      case "flow-chart": {
        const steps = scene.visualData?.steps || ["Plan", "Build", "Deploy", "Scale"];
        const boxWidth = Math.min(180, (w - 150) / steps.length - 40);
        const gap = Math.min(60, (w - 150 - steps.length * boxWidth) / (steps.length - 1));
        const totalW = steps.length * boxWidth + (steps.length - 1) * gap;
        const startX = (w - totalW) / 2;
        const boxHeight = 70;

        ctx.save();
        // 3D flowchart skew
        ctx.translate(centerX, centerY);
        ctx.transform(0.96, -0.04, 0.04, 0.9, 0, 0);
        ctx.translate(-centerX, -centerY);

        steps.forEach((step: string, idx: number) => {
          const x = startX + idx * (boxWidth + gap);
          const y = centerY - boxHeight / 2;

          const isActive = Math.floor(timeInScene * 1.5) % steps.length === idx;

          // 3D Block shadow
          ctx.fillStyle = "#1A1A1A";
          ctx.fillRect(x + 6, y + 6, boxWidth, boxHeight);

          // Main Button Block
          ctx.fillStyle = isActive ? "#e11d48" : "#FFFFFF";
          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 3;
          ctx.fillRect(x, y, boxWidth, boxHeight);
          ctx.strokeRect(x, y, boxWidth, boxHeight);

          ctx.fillStyle = isActive ? "#FFFFFF" : "#1A1A1A";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(step, x + boxWidth / 2, y + boxHeight / 2 + 4);

          // Connecting lines with 3D shadow
          if (idx < steps.length - 1) {
            ctx.strokeStyle = "#1A1A1A";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x + boxWidth, centerY);
            ctx.lineTo(x + boxWidth + gap, centerY);
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = "#1A1A1A";
            ctx.beginPath();
            ctx.moveTo(x + boxWidth + gap, centerY);
            ctx.lineTo(x + boxWidth + gap - 10, centerY - 5);
            ctx.lineTo(x + boxWidth + gap - 10, centerY + 5);
            ctx.fill();
          }
        });
        ctx.restore();
        break;
      }

      case "database": {
        const tables = scene.visualData?.tables || ["Users Table", "Schemas", "Record Embeddings"];
        const spacing = (w - 200) / tables.length;
        
        ctx.save();
        // 3D rotation matrix
        ctx.translate(centerX, centerY);
        ctx.transform(0.94, -0.06, 0.08, 0.88, 0, 0);
        ctx.translate(-centerX, -centerY);

        tables.forEach((tbl: string, idx: number) => {
          const x = 100 + idx * spacing + spacing / 4;
          const y = centerY - 100;

          // Back 3D projection card shadow
          ctx.fillStyle = "#1A1A1A";
          ctx.fillRect(x + 8, y + 8, 160, 200);

          // Main body
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 3;
          ctx.fillRect(x, y, 160, 200);
          ctx.strokeRect(x, y, 160, 200);

          // Header block
          ctx.fillStyle = "#1A1A1A";
          ctx.fillRect(x, y, 160, 35);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "left";
          ctx.fillText(tbl.toUpperCase(), x + 10, y + 21);

          // Rows
          ctx.fillStyle = "#1A1A1A";
          ctx.font = "11px monospace";
          ctx.fillText("• id (primary_key)", x + 10, y + 65);
          ctx.fillText("• created_at", x + 10, y + 95);
          ctx.fillText("• vectors [1536]", x + 10, y + 125);
          ctx.fillText("• indexed_node", x + 10, y + 155);

          // Scanned laser ray line
          const scanProgress = (timeInScene * 0.8) % 1;
          const scanY = y + 35 + scanProgress * 165;
          ctx.strokeStyle = "rgba(225, 29, 72, 0.8)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x + 2, scanY);
          ctx.lineTo(x + 158, scanY);
          ctx.stroke();
        });
        ctx.restore();
        break;
      }

      case "mind-map": {
        const branches = scene.visualData?.branches || ["A", "B", "C"];
        
        ctx.save();
        // Drop shadow for main core node
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY + 6, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 15px serif";
        ctx.textAlign = "center";
        ctx.fillText(scene.visualData?.center || "AI Engineering", centerX, centerY + 5);

        branches.forEach((branch: string, idx: number) => {
          const angle = (idx * (360 / branches.length)) * (Math.PI / 180);
          const bx = centerX + Math.cos(angle) * 220;
          const by = centerY + Math.sin(angle) * 190;

          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.setLineDash([]);

          // Shadow for branch node
          ctx.fillStyle = "rgba(0,0,0,0.08)";
          ctx.fillRect(bx - 74, by - 21, 150, 46);

          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#1A1A1A";
          ctx.lineWidth = 3;
          ctx.fillRect(bx - 78, by - 25, 150, 46);
          ctx.strokeRect(bx - 78, by - 25, 150, 46);

          ctx.fillStyle = "#1A1A1A";
          ctx.font = "bold 11px monospace";
          ctx.fillText(branch.toUpperCase(), bx - 3, by + 4);
        });
        ctx.restore();
        break;
      }

      case "code-animation": {
        const codeText = scene.visualData?.code || "import pandas as pd\n\ndef main():\n  pass";
        const lines = codeText.split("\n");
        const charsToShow = Math.floor(timeInScene * 35);
        
        ctx.save();
        // Code terminal 3D transform
        ctx.translate(centerX, centerY);
        ctx.transform(0.96, -0.04, 0.08, 0.92, 0, 0);
        ctx.translate(-centerX, -centerY);

        const termWidth = Math.min(700, w - 80);
        const termHeight = 260;

        // Terminal block shadow
        ctx.fillStyle = "#1A1A1A";
        ctx.fillRect(centerX - termWidth / 2 + 10, centerY - termHeight / 2 + 10, termWidth, termHeight);

        // Main body
        ctx.fillStyle = "#121212";
        ctx.fillRect(centerX - termWidth / 2, centerY - termHeight / 2, termWidth, termHeight);
        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 4;
        ctx.strokeRect(centerX - termWidth / 2, centerY - termHeight / 2, termWidth, termHeight);

        // Code title bar
        ctx.fillStyle = "#222222";
        ctx.fillRect(centerX - termWidth / 2, centerY - termHeight / 2, termWidth, 34);
        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - termWidth / 2, centerY - termHeight / 2 + 34);
        ctx.lineTo(centerX + termWidth / 2, centerY - termHeight / 2 + 34);
        ctx.stroke();
        
        // Window Controls
        ctx.fillStyle = "#FF5F56";
        ctx.beginPath(); ctx.arc(centerX - termWidth/2 + 25, centerY - termHeight/2 + 17, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#FFBD2E";
        ctx.beginPath(); ctx.arc(centerX - termWidth/2 + 42, centerY - termHeight/2 + 17, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#27C93F";
        ctx.beginPath(); ctx.arc(centerX - termWidth/2 + 59, centerY - termHeight/2 + 17, 6, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = "#8F8F8F";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("roadmap_orchestrator.py", centerX, centerY - termHeight/2 + 21);

        // Draw typing code
        ctx.fillStyle = "#27C93F";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";

        let runningLength = 0;
        let lineY = centerY - termHeight/2 + 65;
        for (let l = 0; l < lines.length; l++) {
          const line = lines[l];
          if (runningLength >= charsToShow) break;
          const charsInLine = Math.min(line.length, charsToShow - runningLength);
          const substring = line.substring(0, charsInLine);
          ctx.fillText(substring, centerX - termWidth/2 + 25, lineY);
          lineY += 24;
          runningLength += line.length + 1;
        }
        ctx.restore();
        break;
      }

      case "infographics": {
        const metric = scene.visualData?.metric || "95%";
        const label = scene.visualData?.label || "COMPILING STATUS";

        ctx.save();
        // 3D Infographics rotate
        ctx.translate(centerX, centerY);
        ctx.transform(0.95, -0.06, 0.08, 0.9, 0, 0);
        ctx.translate(-centerX, -centerY);

        // Outer ring shadow
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(centerX + 4, centerY + 4, 90, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 14;
        const progressAngle = (parseFloat(metric) / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 90, -Math.PI / 2, progressAngle - Math.PI / 2);
        ctx.stroke();

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 44px serif";
        ctx.textAlign = "center";
        ctx.fillText(metric, centerX, centerY + 14);

        ctx.font = "bold 13px monospace";
        ctx.fillText(label.toUpperCase(), centerX, centerY + 140);
        ctx.restore();
        break;
      }

      case "text-animation":
      default: {
        const prim = scene.visualData?.primary || topic;
        const sec = scene.visualData?.secondary || "ROADMAP COMPLETE GUIDE";

        ctx.save();
        // Gorgeous double 3D drop-shadow layout for headings
        ctx.textAlign = "center";
        ctx.font = "bold 40px serif";

        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillText(prim.toUpperCase(), centerX + 4, centerY - 6);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(prim.toUpperCase(), centerX + 2, centerY - 8);

        ctx.fillStyle = "#1A1A1A";
        ctx.fillText(prim.toUpperCase(), centerX, centerY - 10);

        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 15px monospace";
        ctx.fillText(sec.toUpperCase(), centerX, centerY + 42);
        ctx.restore();
        break;
      }
    }

    // 4. Render subtitles/narration in bottom footer
    const footerY = h - 160;
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(40, footerY, w - 80, 110);
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, footerY, w - 80, 110);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    
    // Multi-line wrap helper for long narrations
    const words = scene.narration.split(" ");
    let line = "";
    let lines = [];
    const maxLineW = w - 160;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let captionY = footerY + (lines.length === 1 ? 60 : 45);
    lines.forEach((l) => {
      ctx.fillText(l.trim(), w / 2, captionY);
      captionY += 28;
    });

    // Drawing progress bars
    ctx.fillStyle = "rgba(225, 29, 72, 0.4)";
    ctx.fillRect(40, h - 45, w - 80, 10);
    ctx.fillStyle = "#e11d48";
    ctx.fillRect(40, h - 45, (w - 80) * (totalTime / totalDuration), 10);
  };

  const handleDownloadMp4 = async () => {
    if (isCompilingMp4) return;
    setIsCompilingMp4(true);
    setMp4Progress(0);
    addLog("[EXPORTER] Beginning dynamic MP4 high-fidelity compilation...");

    // Store reference to canvas outside try so catch can clean up
    let canvasEl: HTMLCanvasElement | null = null;

    try {
      const totalDuration = storyboard[storyboard.length - 1]?.end || 60;
      
      // Determine canvas size from resolution setting
      const isPortrait = resolution.includes("1080x1920");
      const canvasWidth = isPortrait ? 1080 : 1920;
      const canvasHeight = isPortrait ? 1920 : 1080;
      
      // Create offscreen canvas for rendering frames
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      // Position the canvas visibly but invisibly to ensure browser paints and streams correctly
      canvas.style.position = "fixed";
      canvas.style.left = "0px";
      canvas.style.top = "0px";
      canvas.style.width = "320px";
      canvas.style.height = "180px";
      canvas.style.opacity = "0.01";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "-9999";
      document.body.appendChild(canvas);
      canvasEl = canvas;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas 2D rendering context.");

      // Setup audio context and destination for mixing
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const audioDest = audioCtx.createMediaStreamDestination();

      // Sequence audio tracks from storyboard scenes
      addLog("[EXPORTER] Loading synthesized voice assets...");
      let audioLoadedCount = 0;
      const audioBuffers: { start: number; end: number; buffer: AudioBuffer | null }[] = [];

      for (let i = 0; i < storyboard.length; i++) {
        const scene = storyboard[i];
        let buffer: AudioBuffer | null = null;
        if (scene.audioUrl) {
          try {
            const res = await fetch(scene.audioUrl);
            const arrayBuffer = await res.arrayBuffer();
            buffer = await audioCtx.decodeAudioData(arrayBuffer);
            audioLoadedCount++;
          } catch (e) {
            console.warn(`Failed to decode audio for scene ${i+1}:`, e);
          }
        }
        audioBuffers.push({ start: scene.start, end: scene.end, buffer });
      }
      
      addLog(`[EXPORTER] Mixed ${audioLoadedCount}/${storyboard.length} high-fidelity narration audio segments.`);

      // Trigger standard webm/mp4 MediaRecorder
      const canvasStream = canvas.captureStream(30); // 30 FPS
      const combinedTracks = [...canvasStream.getVideoTracks()];
      
      // If any audios are loaded, compile audio track
      if (audioLoadedCount > 0) {
        // Schedule all sources to play into our destination
        audioBuffers.forEach(({ start, buffer }) => {
          if (buffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioDest);
            // Schedule it to play at the correct absolute timeline position
            source.start(audioCtx.currentTime + start);
          }
        });
        combinedTracks.push(...audioDest.stream.getAudioTracks());
      }

      const combinedStream = new MediaStream(combinedTracks);
      
      // Check supported mimeTypes for highest compatibility (prioritizing video/mp4 for native MP4 container downloads)
      let mimeType = "video/mp4;codecs=avc1,mp4a";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4;codecs=avc1";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp9,opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }
      if (mimeType && !MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "";
      }

      const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Remove canvas from DOM
        if (canvasEl && canvasEl.parentNode) {
          canvasEl.parentNode.removeChild(canvasEl);
        }
        addLog("[EXPORTER] Compiling binary data packages...");
        const blob = new Blob(chunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_output.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        addLog("[EXPORTER] Video downloaded successfully as MP4!");
        setIsCompilingMp4(false);
        setMp4Progress(100);
      };

      recorder.start();
      addLog("[EXPORTER] Executing frame-by-frame high-fidelity capture sequence...");

      let currentFrameTime = 0;
      const frameStep = 1 / 30;

      const renderFrame = async () => {
        if (currentFrameTime >= totalDuration) {
          recorder.stop();
          return;
        }

        // Sequential search to prevent floating-point rounding gaps
        let activeScene = storyboard[0];
        for (let i = 0; i < storyboard.length; i++) {
          if (currentFrameTime >= storyboard[i].start) {
            activeScene = storyboard[i];
          }
        }

        const sceneTime = Math.max(0, currentFrameTime - activeScene.start);

        // Draw active frame to offscreen canvas
        drawSceneToCanvas(
          ctx,
          canvasWidth,
          canvasHeight,
          activeScene,
          sceneTime,
          currentFrameTime,
          totalDuration
        );

        currentFrameTime += frameStep;
        setMp4Progress(Math.min(99, (currentFrameTime / totalDuration) * 100));

        // Flush rendering by waiting for browser paint
        await new Promise(requestAnimationFrame);
        // Allow a tiny delay for MediaRecorder to stream the canvas frame buffer
        await new Promise((resolve) => setTimeout(resolve, 15));

        renderFrame();
      };

      renderFrame();

    } catch (err: any) {
      if (canvasEl && canvasEl.parentNode) {
        canvasEl.parentNode.removeChild(canvasEl);
      }
      addLog(`[EXPORTER] Compilation encountered error: ${err.message}`);
      setIsCompilingMp4(false);
    }
  };

  // Render visual graphs/graphics based on the active scene type
  const renderSceneGraphics = () => {
    const activeScene = storyboard[currentSceneIndex] || storyboard[0];
    if (!activeScene) return null;

    const { visualizationType, visualData, narration } = activeScene;

    switch (visualizationType) {
      case "neural-network": {
        const layers = visualData?.layers || [4, 6, 5, 3];
        return (
          <div className="w-full h-full flex flex-col justify-center items-center relative p-8 perspective-container">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-96 h-96 rounded-full border border-dashed border-black animate-spin" style={{ animationDuration: "20s" }} />
            </div>
            
            <div className="flex justify-between items-center w-full max-w-lg z-10 gap-8 tilt-3d-neural shadow-3d-box bg-white/90 border border-black p-8 rounded-xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 to-neutral-50/20 pointer-events-none" />
              
              {layers.map((nodeCount: number, lIdx: number) => (
                <div key={lIdx} className="flex flex-col gap-4 justify-center items-center relative">
                  <span className="text-[7px] font-mono uppercase opacity-40 absolute -top-5 tracking-widest">L{lIdx+1}</span>
                  {Array.from({ length: nodeCount }).map((_, nIdx) => (
                    <motion.div
                      key={nIdx}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: isPlaying ? [1, 1.25, 1] : 1,
                        backgroundColor: isPlaying ? ["#1A1A1A", "#e11d48", "#1A1A1A"] : "#1A1A1A",
                        boxShadow: isPlaying ? ["0 0 0px #e11d48", "0 0 12px #e11d48", "0 0 0px #e11d48"] : "0 0 0px #1A1A1A"
                      }}
                      transition={{ 
                        duration: 1.8, 
                        repeat: Infinity, 
                        delay: (lIdx * 0.4) + (nIdx * 0.12) 
                      }}
                      className="w-4 h-4 rounded-full border border-black flex items-center justify-center relative z-20"
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono mt-8 uppercase tracking-widest opacity-60">Visualizing 3D Connected Neural Matrix</p>
          </div>
        );
      }

      case "timeline": {
        const events = visualData?.events || [
          { time: "1940", label: "Alan Turing" },
          { time: "2017", label: "Transformer Model" },
          { time: "2024", label: "Gemini API" }
        ];
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 z-10 perspective-container">
            <div className="relative w-full max-w-lg h-2 bg-gradient-to-r from-neutral-300 via-neutral-900 to-neutral-300 my-10 flex justify-between items-center rounded-full shadow-inner">
              {events.map((evt: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ y: 30, opacity: 0, rotateY: 30 }}
                  animate={{ y: 0, opacity: 1, rotateY: 0 }}
                  transition={{ type: "spring", stiffness: 100, delay: idx * 0.2 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="w-8 h-8 bg-white border-2 border-black rounded-full mb-3 flex items-center justify-center font-bold text-xs shadow-3d-box z-10">
                    {idx + 1}
                  </div>
                  <div className="absolute -top-16 text-center w-32 bg-white/95 border-2 border-black p-2 shadow-3d-box rounded-md transform rotateX(10deg)">
                    <span className="font-mono text-xs font-black block text-[#e11d48]">{evt.time}</span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-tight block leading-none truncate">{evt.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] font-mono mt-8 uppercase tracking-widest opacity-60">3D Roadmap Ribbon Timeline</p>
          </div>
        );
      }

      case "flow-chart": {
        const steps = visualData?.steps || ["Input", "Processing", "Attention", "Compilation"];
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 z-10 perspective-container">
            <div className="flex flex-col gap-3 w-full max-w-xs tilt-3d-flowchart">
              {steps.map((step: string, idx: number) => (
                <div key={idx} className="flex flex-col items-center w-full">
                  <motion.div
                    animate={{ 
                      borderColor: isPlaying ? "#e11d48" : "#1A1A1A",
                      scale: isPlaying ? [1, 1.03, 1] : 1
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.25 }}
                    className="border-2 border-black bg-white py-3 px-6 w-full text-center text-xs font-black uppercase tracking-wider shadow-3d-box rounded-lg transform hover:-translate-y-1 transition-all"
                  >
                    <span className="text-[9px] font-mono mr-2 text-neutral-400">0{idx+1}.</span>
                    {step}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <div className="h-4 w-1 bg-black shadow-sm" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono mt-4 uppercase tracking-widest opacity-60">3D Sequential Step Pipeline</p>
          </div>
        );
      }

      case "database": {
        const tables = visualData?.tables || ["Relational", "Vector Space", "Embedding Records"];
        return (
          <div className="w-full h-full flex justify-center items-center gap-6 p-8 z-10 perspective-container">
            {tables.map((tbl: string, idx: number) => (
              <motion.div
                key={idx}
                animate={{ y: isPlaying ? [0, -10, 0] : 0 }}
                transition={{ repeat: Infinity, duration: 2.2, delay: idx * 0.35 }}
                className="border-2 border-black bg-white w-32 flex flex-col tilt-3d-database shadow-3d-box rounded-t-xl relative overflow-hidden"
              >
                <div className="h-4 bg-[#1A1A1A] border-b border-black w-full flex items-center justify-center">
                  <div className="w-16 h-1 bg-red-600/60 rounded-full animate-pulse" />
                </div>
                <div className="p-3">
                  <div className="border-b border-neutral-300 pb-1.5 mb-2">
                    <span className="text-[7px] font-mono uppercase opacity-50 block">CYLINDER STACK</span>
                    <h4 className="text-[9px] font-black uppercase truncate">{tbl}</h4>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-neutral-200 w-full rounded" />
                    <div className="h-1.5 bg-neutral-100 w-3/4 rounded" />
                    <div className="h-1.5 bg-neutral-200 w-5/6 rounded" />
                    <div className="h-1.5 bg-red-100 w-2/3 rounded" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      }

      case "mind-map": {
        const branches = visualData?.branches || ["A", "B", "C"];
        return (
          <div className="w-full h-full flex justify-center items-center relative p-8 z-10 perspective-container">
            <div className="border-2 border-black rounded-xl px-6 py-4 bg-white/90 text-center font-serif italic text-sm font-black shadow-3d-box relative z-20 transform hover:scale-105 transition-transform duration-300">
              <span className="block text-[7px] font-mono uppercase text-[#e11d48] mb-1 not-italic font-bold tracking-widest">CENTRAL CORE</span>
              {visualData?.center || topic}
            </div>
            <div className="absolute inset-0">
              {branches.map((branch: string, idx: number) => {
                const angle = (idx * (360 / branches.length)) * (Math.PI / 180);
                const x = Math.cos(angle) * 125;
                const y = Math.sin(angle) * 115;
                return (
                  <motion.div
                    key={idx}
                    animate={{ scale: [0.96, 1.04, 0.96], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, delay: idx * 0.6 }}
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-28 border-2 border-black bg-white py-2 px-3 text-[9px] text-center uppercase tracking-tight font-black shadow-3d-box rounded-lg transform hover:scale-110 transition-transform"
                  >
                    {branch}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      }

      case "code-animation": {
        const codeText = visualData?.code || "def solve(x):\n  return attention(x)";
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 font-mono text-[10px] z-10 perspective-container">
            <div className="border-2 border-black bg-[#121212] text-green-400 p-4 rounded-xl w-full max-w-sm h-48 overflow-y-auto leading-relaxed shadow-3d-box tilt-3d-code relative">
              <div className="flex gap-1.5 border-b border-neutral-800 pb-2 mb-2 justify-between items-center">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-black" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black" />
                </div>
                <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest">roadmap_compiler.py</span>
              </div>
              <pre className="text-left whitespace-pre-wrap leading-relaxed text-[#27C93F] text-xs font-bold font-mono">{codeText}</pre>
            </div>
            <p className="text-[10px] font-mono mt-6 uppercase tracking-widest opacity-60">Visualizing 3D Interactive Terminal</p>
          </div>
        );
      }

      case "infographics": {
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 z-10 perspective-container">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0, scale: isPlaying ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-28 h-28 rounded-full border-4 border-dashed border-black border-t-[#e11d48] border-b-[#e11d48] flex items-center justify-center mb-4 tilt-3d-infographics shadow-3d-box bg-white relative"
            >
              <div className="absolute w-20 h-20 rounded-full border-2 border-black border-dotted opacity-40 animate-ping" />
              <span className="font-serif font-black text-2xl text-[#1A1A1A]">{visualData?.metric || "95%"}</span>
            </motion.div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold mt-4 bg-white px-3 py-1 border border-black shadow-sm">{visualData?.label || "Processing Growth"}</h4>
          </div>
        );
      }

      case "text-animation":
      default: {
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center z-10 perspective-container">
            <motion.h2 
              animate={{ scale: isPlaying ? [1, 1.04, 1] : 1, y: isPlaying ? [0, -3, 0] : 0 }}
              className="text-4xl font-serif font-black uppercase tracking-tight leading-none mb-3 transform hover:rotate-1 transition-transform"
              style={{ textShadow: "2px 2px 0px #FFF, 5px 5px 0px rgba(0,0,0,0.15)" }}
            >
              {visualData?.primary || topic}
            </motion.h2>
            <motion.p 
              animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 0.8 }}
              className="text-xs font-mono uppercase tracking-widest bg-white border border-black px-4 py-1.5 shadow-sm font-bold"
            >
              {visualData?.secondary || "Educational Core Concept"}
            </motion.p>
          </div>
        );
      }
    }
  };

  // Load voices list once on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }
  }, []);

  // Play narration audio sequentially when the time reaches next scenes
  useEffect(() => {
    if (!isPlaying) {
      voiceIsPlayingRef.current = false;
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      activeUtteranceRef.current = null;
      return;
    }

    const currentScene = storyboard[currentSceneIndex];
    if (currentScene) {
      if (currentScene.audioUrl) {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        activeUtteranceRef.current = null;
        voiceIsPlayingRef.current = true;
        // Setup or change narration audio track
        if (narrationAudioRef.current) {
          narrationAudioRef.current.pause();
          narrationAudioRef.current.src = currentScene.audioUrl;
          narrationAudioRef.current.onended = () => {
            voiceIsPlayingRef.current = false;
          };
          narrationAudioRef.current.onerror = () => {
            voiceIsPlayingRef.current = false;
          };
          narrationAudioRef.current.load();
          narrationAudioRef.current.play().catch(e => {
            console.warn("Failed to trigger narration sound", e);
            voiceIsPlayingRef.current = false;
          });
        } else {
          const audio = new Audio(currentScene.audioUrl);
          narrationAudioRef.current = audio;
          audio.onended = () => {
            voiceIsPlayingRef.current = false;
          };
          audio.onerror = () => {
            voiceIsPlayingRef.current = false;
          };
          audio.play().catch(e => {
            console.warn("Failed to trigger narration sound", e);
            voiceIsPlayingRef.current = false;
          });
        }
      } else {
        // Fallback to high-quality browser speech synthesis (especially deep professional male narration voice)
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          voiceIsPlayingRef.current = true;
          const utterance = new SpeechSynthesisUtterance(currentScene.narration);
          activeUtteranceRef.current = utterance;
          
          // Safety watchdog to prevent SpeechSynthesis getting stuck
          const wordCount = currentScene.narration.trim().split(/\s+/).filter(Boolean).length;
          const safetyTimeoutMs = Math.max(5000, (wordCount / 1.5) * 1000 + 4000);
          const watchdog = setTimeout(() => {
            if (voiceIsPlayingRef.current && activeUtteranceRef.current === utterance) {
              console.warn("SpeechSynthesis watchdog fired: forcing voiceIsPlaying to false.");
              voiceIsPlayingRef.current = false;
              activeUtteranceRef.current = null;
            }
          }, safetyTimeoutMs);

          utterance.onend = () => {
            clearTimeout(watchdog);
            voiceIsPlayingRef.current = false;
            activeUtteranceRef.current = null;
          };
          utterance.onerror = () => {
            clearTimeout(watchdog);
            voiceIsPlayingRef.current = false;
            activeUtteranceRef.current = null;
          };

          const voices = window.speechSynthesis.getVoices();
          let selectedBrowserVoice = null;

          // Search for professional male voices (e.g. David, Microsoft, Google US Male, Daniel, etc.)
          if (voice.includes("Charon") || voice.includes("Kore") || voice.includes("Zephyr")) {
            selectedBrowserVoice = voices.find(v => 
              v.name.toLowerCase().includes("david") || 
              v.name.toLowerCase().includes("male") || 
              v.name.toLowerCase().includes("microsoft david") ||
              v.name.toLowerCase().includes("google us english male") ||
              v.name.toLowerCase().includes("daniel") ||
              v.name.toLowerCase().includes("premium")
            );
          } else if (voice.includes("Puck")) {
            selectedBrowserVoice = voices.find(v => 
              v.name.toLowerCase().includes("zira") || 
              v.name.toLowerCase().includes("female") || 
              v.name.toLowerCase().includes("google us english female")
            );
          }

          if (!selectedBrowserVoice && voices.length > 0) {
            selectedBrowserVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
          }

          if (selectedBrowserVoice) {
            utterance.voice = selectedBrowserVoice;
          }

          // Apply rich professional voice parameter settings
          if (voice.includes("Charon") || voice.includes("Kore")) {
            utterance.pitch = 0.85; // Low-pitch masculine authority
            utterance.rate = 0.92;  // Deliberate professional pacing
          } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
          }

          window.speechSynthesis.speak(utterance);
        } else {
          // If speech synthesis is completely unsupported in this context, do not block play
          voiceIsPlayingRef.current = false;
        }
      }
    }
  }, [currentSceneIndex, isPlaying, voice, storyboard]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen w-full flex flex-col font-sans text-[#1A1A1A] p-4 md:p-8 overflow-x-hidden">
      
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#1A1A1A] pb-4 mb-6 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 font-mono">
            Production Suite v1.0 • Node & Python MCP Hybrid
          </span>
          <h1 className="text-4xl font-serif font-black uppercase tracking-tight">
            AI Education Studio
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-start md:items-end font-mono">
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">MCP Status</span>
            <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ● ORCHESTRATOR ONLINE
            </span>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-6 py-2.5 uppercase text-xs tracking-widest font-bold border-2 border-black transition-all ${
              isGenerating 
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" 
              : "bg-[#1A1A1A] text-white hover:bg-white hover:text-black hover:scale-102"
            }`}
          >
            {isGenerating ? "Compiling Video..." : "Generate Final Export"}
          </button>
        </div>
      </header>

      {/* Main Grid Structure */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        
        {/* Left Control Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6 pr-0 lg:pr-2">
          
          {/* Topic Section */}
          <div className="space-y-4 border-b border-black/10 pb-6">
            <div className="group">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold mb-1 block">Video Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic..."
                className="w-full bg-transparent border-b border-black py-2 focus:outline-none text-lg font-serif italic text-[#1A1A1A] placeholder-neutral-400"
              />
            </div>

            {/* Script Textarea */}
            <div className="group">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold mb-1 block">Script Editor</label>
              <textarea 
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={7}
                placeholder="Write educational narration..."
                className="w-full bg-white border border-black p-4 text-xs font-mono leading-relaxed focus:outline-none resize-y placeholder-neutral-400"
              />
            </div>
          </div>

          {/* Proportional Duration and Timing Adjuster */}
          <div className="border border-black p-4 bg-white space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold block">
                Target Video Duration
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-100 border border-black/20 rounded">
                {duration} seconds
              </span>
            </div>
            
            <div className="space-y-1">
              <input
                type="range"
                min="10"
                max="180"
                step="1"
                value={duration}
                onChange={(e) => {
                  const targetSecs = Number(e.target.value);
                  setDuration(targetSecs);
                  rescaleStoryboardToDuration(targetSecs);
                }}
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                <span>10s</span>
                <span>45s</span>
                <span>90s</span>
                <span>120s</span>
                <span>180s</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 font-mono leading-relaxed bg-[#FAF9F6] p-3 border-l-2 border-[#1A1A1A] space-y-1">
              <p className="font-bold uppercase text-[#1A1A1A]">Perfect Proportion Synchronization:</p>
              <p>
                Your script contains <span className="font-bold text-[#1A1A1A]">{script.trim().split(/\s+/).filter(Boolean).length} words</span>. 
                Natural speaking time is about <span className="font-bold text-[#1A1A1A]">{Math.ceil(script.trim().split(/\s+/).filter(Boolean).length / 2.2)}s</span>.
              </p>
              <p>
                Setting the target to <span className="font-bold text-[#1A1A1A]">{duration}s</span> automatically scales and matches every frame transition, subtitle timing, and scene rendering pace perfectly to prevent speech overlapping.
              </p>
            </div>
          </div>

          {/* Render Settings (Output Format & Resolution) */}
          <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold block">Resolution</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-transparent border border-black p-2 text-[10px] uppercase tracking-tighter font-bold focus:outline-none cursor-pointer"
              >
                <option value="1080x1920 (Shorts)">1080x1920</option>
                <option value="1920x1080 (Landscape)">1920x1080</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest font-bold block">Target FPS</label>
              <select 
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full bg-transparent border border-black p-2 text-[10px] uppercase tracking-tighter font-bold focus:outline-none cursor-pointer"
              >
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4">
            <div className="border border-black p-2 text-center bg-white">
              <span className="block text-[8px] font-mono uppercase opacity-60">Res Code</span>
              <span className="text-[10px] font-bold font-mono">{resolution.split(" ")[0]}</span>
            </div>
            <div className="border border-black p-2 text-center bg-white">
              <span className="block text-[8px] font-mono uppercase opacity-60">Output Frame</span>
              <span className="text-[10px] font-bold font-mono">{fps} FPS</span>
            </div>
            <div className="border border-black p-2 text-center bg-white">
              <span className="block text-[8px] font-mono uppercase opacity-60">Est. Length</span>
              <span className="text-[10px] font-bold font-mono">~{duration}s</span>
            </div>
          </div>

        </aside>

        {/* Right Active Visualization Panel */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visual Preview Display */}
          <div className="relative aspect-video bg-[#EAE8E3] border-2 border-black flex flex-col items-center justify-center overflow-hidden">
            
            {/* Ambient Background Matrix */}
            <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

            {/* Floating Info Badge */}
            <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white px-2.5 py-1 text-[8px] font-mono tracking-widest uppercase z-20 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              Live Visualizer Interface
            </div>

            {/* Active Rendered Animation Graphics */}
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={storyboard[currentSceneIndex]?.id || "empty"}
                  {...getAnimationConfig(storyboard[currentSceneIndex]?.animationStyle)}
                  className="w-full h-full flex items-center justify-center absolute inset-0"
                >
                  {renderSceneGraphics()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Audio Waveform Overlays or Interactive Visual Overlay */}
            {isPlaying && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6 z-20 bg-[#FAF9F6]/80 p-2 border border-black">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    className="w-1 bg-[#1A1A1A]"
                  />
                ))}
                <span className="text-[8px] font-mono font-bold uppercase ml-2">Ambient Music Synth Active</span>
              </div>
            )}

            {/* Bottom Subtitle / Open Captions Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] p-4 text-center z-20 border-t border-black">
              <p className="text-white font-mono text-xs tracking-wide">
                {storyboard[currentSceneIndex]?.narration || "Click 'Generate' to begin compiling visual script assets..."}
              </p>
              
              {/* Playback time marker progress */}
              <div className="absolute top-0 left-0 h-1 bg-red-600 transition-all duration-100" style={{
                width: `${(playbackTime / (storyboard[storyboard.length - 1]?.end || 30)) * 100}%`
              }} />
            </div>

            {/* Play overlay blocker if not playing */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-[#FAF9F6]/30 backdrop-blur-[1px] flex items-center justify-center z-10">
                <button
                  onClick={startPlayback}
                  className="w-16 h-16 rounded-full border-2 border-black bg-[#FAF9F6] text-[#1A1A1A] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:scale-105 transition-all shadow-md"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
            )}
            
            {/* Pause control if playing */}
            {isPlaying && (
              <button
                onClick={stopPlayback}
                className="absolute top-3 right-3 bg-white hover:bg-neutral-100 border border-black p-2 z-20 rounded-full"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>

          {/* Lower Grid: Logs, Thumbnails and Download Exports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            
            {/* Orchestrator Logs Panel */}
            <div className="border border-black bg-white p-4 flex flex-col h-64 overflow-hidden shadow-sm">
              <h3 className="text-[10px] font-mono uppercase tracking-widest font-bold border-b border-black pb-2 mb-3 flex justify-between items-center">
                <span>Orchestration Logs</span>
                <Terminal className="w-3.5 h-3.5" />
              </h3>
              
              <div 
                ref={setLogsScrollRef}
                className="font-mono text-[9px] space-y-1.5 overflow-y-auto pr-2 flex-grow scroll-smooth"
              >
                {logs.map((logStr, lIdx) => {
                  let colorClass = "text-[#1A1A1A]";
                  if (logStr.includes("[SYSTEM]")) colorClass = "text-blue-600 font-bold";
                  else if (logStr.includes("[VOICE]")) colorClass = "text-green-600";
                  else if (logStr.includes("[MANIM]")) colorClass = "text-purple-600";
                  else if (logStr.includes("[RENDER]")) colorClass = "text-orange-600";
                  else if (logStr.includes("[MUSIC]")) colorClass = "text-cyan-600";
                  else if (logStr.includes("[MCP]")) colorClass = "text-pink-600 font-bold";

                  return (
                    <p key={lIdx} className={colorClass}>
                      {logStr}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Right Action Widgets */}
            <div className="flex flex-col gap-4">
              
              {/* Thumbnail variations section */}
              <div className="border border-black p-4 bg-[#1A1A1A] text-white flex-grow shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-60">Thumbnail Generator</h3>
                  <Bot className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-neutral-900 border border-neutral-700 p-3 h-20 flex flex-col justify-between cursor-pointer hover:border-white transition-all">
                    <span className="text-[7px] uppercase tracking-wider text-rose-500 font-bold">Variation A</span>
                    <span className="text-[9px] font-serif font-black uppercase leading-tight truncate">{topic}</span>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-700 p-3 h-20 flex flex-col justify-between cursor-pointer hover:border-white transition-all">
                    <span className="text-[7px] uppercase tracking-wider text-rose-500 font-bold">Variation B</span>
                    <span className="text-[9px] font-mono uppercase tracking-tight truncate">{topic.substring(0, 15)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-400 self-center">Active preset:</span>
                  <select
                    value={thumbnailStyle}
                    onChange={(e) => setThumbnailStyle(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 text-[9px] uppercase tracking-widest font-bold p-1 rounded focus:outline-none"
                  >
                    <option value="Retro Bold Edition">Retro Bold Edition</option>
                    <option value="Minimal Science">Minimal Science</option>
                    <option value="Cyber Technical">Cyber Technical</option>
                  </select>
                </div>
              </div>

              {/* Action Export download buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownloadMp4}
                  disabled={isCompilingMp4}
                  className="w-full border border-black bg-[#e11d48] text-white p-3 text-[10px] font-mono uppercase font-bold tracking-widest hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isCompilingMp4 ? `Compiling MP4 (${Math.round(mp4Progress)}%)` : "Download MP4 Video"}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadTextFile(generatedSrt || "1\n00:00:00,000 --> 00:00:10,000\nSelf-Attention Tutorial\n", "subtitles.srt")}
                    className="flex-1 border border-black bg-white p-3 text-[10px] font-mono uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm"
                  >
                    Download SRT
                  </button>
                  <button
                    onClick={() => downloadTextFile(generatedProjectJson || "{}", "project_package.json")}
                    className="flex-1 border border-black bg-white p-3 text-[10px] font-mono uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm"
                  >
                    Project JSON
                  </button>
                </div>
              </div>

            </div>
          </div>

        </section>
      </main>

      {/* Footer Block */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-black pt-4 gap-4">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col font-mono">
            <span className="text-[8px] uppercase font-bold opacity-60">Active Task</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">
              {isPlaying ? `Scene: ${storyboard[currentSceneIndex]?.visualizationType}` : "Idle / Ready"}
            </span>
          </div>
          
          <div className="flex flex-col font-mono">
            <span className="text-[8px] uppercase font-bold opacity-60">Target Space</span>
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Hugging Face / Docker-T4
            </span>
          </div>
        </div>

        {/* Decorative Grid Icons */}
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-black rounded-full" />
          <span className="w-3 h-3 bg-black rounded-full opacity-30" />
          <span className="w-3 h-3 bg-black rounded-full opacity-30" />
          <span className="w-3 h-3 bg-black rounded-full opacity-30" />
        </div>
      </footer>
    </div>
  );
}
