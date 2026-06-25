import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

app.use(express.json({ limit: "50mb" }));

// API endpoint to generate storyboard from topic & script
app.post("/api/generate-storyboard", async (req, res) => {
  const { topic, script, style, duration, resolution, fps } = req.body;

  if (!topic || !script) {
    return res.status(400).json({ error: "Topic and script are required." });
  }

  try {
    const ai = getAiClient();
    const systemPrompt = `
You are an expert Educational Creative Director and Storyboard Planner.
Analyze the user's requested educational video topic and script.
Your task is to break down this script into sequentially ordered, time-coded scenes.
Each scene must visualize key parts of the narration.

The style requested is: "${style || 'Manim (Mathematical)'}".
Target duration of video: ~${duration || '60'} seconds.
Target resolution: ${resolution || '1080x1920'}.

Generate a JSON array of scenes. Each scene object MUST strictly follow this structure:
{
  "id": "scene_X" (where X is 1, 2, 3...),
  "start": number (start time in seconds),
  "end": number (end time in seconds),
  "narration": "the exact portion of the script narrated in this scene",
  "visualPrompt": "highly detailed description of visual assets, layouts, camera zooms or panning actions",
  "visualizationType": "one of: 'neural-network' | 'timeline' | 'flow-chart' | 'database' | 'mind-map' | 'code-animation' | 'infographics' | 'text-animation'",
  "visualData": {
    // For 'neural-network': { "layers": [4, 6, 4], "activeConnections": true }
    // For 'timeline': { "events": [{ "time": "1940", "label": "First Turing concept" }, ...] }
    // For 'flow-chart': { "steps": ["Input", "Encoding", "Attention", "Output"] }
    // For 'database': { "tables": ["Users", "Query: SELECT *", "Results"] }
    // For 'mind-map': { "center": "Deep Learning", "branches": ["CNNs", "RNNs", "Transformers"] }
    // For 'code-animation': { "language": "python", "code": "def attention(q, k, v):\n  return softmax(q @ k.T) @ v" }
    // For 'infographics': { "metric": "95%", "label": "Accuracy Boost" }
    // For 'text-animation': { "primary": "Transformers", "secondary": "The Game Changer" }
  },
  "animationStyle": "must be one of: 'fade' | 'zoom-in' | 'slide-left' | 'slide-right' | 'bounce' | 'rotate' | 'flip' | 'pulse'. Select the single best, most visually appealing, and contextually appropriate cinematic animation or entrance transition style for this educational frame."
}

Respond ONLY with a valid JSON array, without markdown blocks.
`;

    const userPrompt = `
Topic: "${topic}"
Script: "${script}"
`;

    // Implement a robust model-fallback and retry chain to overcome temporary 503 model unavailability
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2;
      while (attempts < maxAttempts) {
        try {
          console.log(`[Gemini] Attempting content generation using model: ${modelName} (Attempt ${attempts + 1}/${maxAttempts})...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          attempts++;
          const is503 = err.status === 503 || (err.message && err.message.includes("503")) || (err.message && err.message.includes("temporary"));
          console.warn(`[Gemini] Model ${modelName} attempt ${attempts} failed. Error: ${err.message || err}`);
          if (is503 && attempts < maxAttempts) {
            const delay = attempts * 1000;
            console.log(`[Gemini] 503 Service Unavailable detected. Retrying after ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // If not a 503, or we exceeded max attempts for this model, fall through to the next model
            break;
          }
        }
      }
      if (responseText) {
        console.log(`[Gemini] Successfully generated storyboard using model: ${modelName}`);
        break;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All fallback models returned empty responses.");
    }

    const resultText = responseText;
    let storyboard = [];
    try {
      storyboard = JSON.parse(resultText.trim());
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON, returning fallback parser.");
      // Attempt to clean JSON
      const cleaned = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      storyboard = JSON.parse(cleaned);
    }

    res.json({ storyboard });
  } catch (error: any) {
    console.error("Error in generate-storyboard:", error);
    
    // Return high quality dynamic fallback storyboard parsed from the actual script so there are never unrelated frames
    try {
      const sentences = script
        .split(/[.!?\n]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 8);

      if (sentences.length === 0) {
        sentences.push(script);
      }

      const totalTargetDuration = Number(duration) || 60;
      const durationPerScene = totalTargetDuration / sentences.length;

      const generatedFallbackStoryboard = sentences.map((sentence: string, index: number) => {
        const start = Math.round(index * durationPerScene);
        const end = Math.round((index + 1) * durationPerScene);
        
        const lower = sentence.toLowerCase();
        let visualizationType = "text-animation";
        let visualData: any = { primary: topic.substring(0, 30).toUpperCase(), secondary: "Educational Roadmap" };
        let visualPrompt = "Sleek display heading centering the core lesson topic.";
        let animationStyle = "fade";

        if (lower.includes("python") || lower.includes("code") || lower.includes("programming") || lower.includes("function") || lower.includes("script") || lower.includes("api") || lower.includes("backend") || lower.includes("fastapi")) {
          visualizationType = "code-animation";
          visualData = {
            language: lower.includes("typescript") ? "typescript" : "python",
            code: lower.includes("python")
              ? "def start_learning():\n    print('Initializing process...')\n    # Practice fundamentals\n    return True"
              : "const agent = new AI_Agent({\n  role: 'Architect',\n  tools: []\n});"
          };
          visualPrompt = "Interactive dark editor window typing out active functional commands and snippets.";
          animationStyle = "zoom-in";
        } else if (lower.includes("sql") || lower.includes("database") || lower.includes("table") || lower.includes("queries") || lower.includes("postgres") || lower.includes("indexes")) {
          visualizationType = "database";
          visualData = { tables: ["Users", "Queries", "Aggregates"] };
          visualPrompt = "Structured entity relational mapping schema showcasing database tables and relational keys.";
          animationStyle = "slide-left";
        } else if (lower.includes("neural") || lower.includes("deep learning") || lower.includes("network") || lower.includes("transformer") || lower.includes("layer") || lower.includes("attention")) {
          visualizationType = "neural-network";
          visualData = { layers: [4, 6, 5, 3], activeConnections: true };
          visualPrompt = "Multilayer interconnected neural network structure mapping query, key, and value vectors.";
          animationStyle = "pulse";
        } else if (lower.includes("flow") || lower.includes("step") || lower.includes("roadmap") || lower.includes("timeline") || lower.includes("process") || lower.includes("milestone") || lower.includes("deploy")) {
          visualizationType = "flow-chart";
          visualData = { steps: ["Fundamentals", "Mastery", "Build Projects", "Production"] };
          visualPrompt = "Linear flowchart outlining sequential pipeline steps and progression milestones.";
          animationStyle = "slide-right";
        } else if (lower.includes("stats") || lower.includes("math") || lower.includes("probability") || lower.includes("metric") || lower.includes("calculus") || lower.includes("algebra")) {
          visualizationType = "infographics";
          visualData = { metric: "99%", label: "Core Foundation Math" };
          visualPrompt = "Elegant circular progress infographic showing high metric and mathematical scale.";
          animationStyle = "bounce";
        } else if (lower.includes("mind") || lower.includes("concept") || lower.includes("learn") || lower.includes("category")) {
          visualizationType = "mind-map";
          visualData = { center: "AI Engineering", branches: ["LLMs", "RAG Systems", "AI Agents"] };
          visualPrompt = "Radial branching mind map with links exploring modular educational subtopics.";
          animationStyle = "flip";
        }

        return {
          id: `scene_${index + 1}`,
          start,
          end,
          narration: sentence,
          visualPrompt,
          visualizationType,
          visualData,
          animationStyle
        };
      });

      res.json({ storyboard: generatedFallbackStoryboard });
    } catch (fallbackErr) {
      console.error("Fatal in dynamic fallback generation:", fallbackErr);
      res.json({
        storyboard: [
          {
            id: "scene_1",
            start: 0,
            end: 30,
            narration: script,
            visualPrompt: "Sleek typography presentation.",
            visualizationType: "text-animation",
            visualData: { primary: topic.toUpperCase(), secondary: "Introductory Overview" },
            animationStyle: "fade"
          }
        ]
      });
    }
  }
});

// API endpoint to synthesize TTS vocals using Gemini 3.1 TTS
app.post("/api/generate-voice", async (req, res) => {
  const { text, voiceName } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const ai = getAiClient();
    
    // Choose voice: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const selectedVoice = voiceName || "Zephyr";

    let base64Audio = "";
    let lastError: any = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        console.log(`[Gemini TTS] Requesting speech synthesis (Attempt ${attempts + 1}/${maxAttempts})...`);
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData?.data) {
              base64Audio = part.inlineData.data;
              break;
            }
          }
        }
        if (base64Audio) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        attempts++;
        console.warn(`[Gemini TTS] Attempt ${attempts} failed: ${err.message || err}`);
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
        }
      }
    }

    if (!base64Audio) {
      throw lastError || new Error("No inline audio data returned from Gemini TTS.");
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("Error in generate-voice API:", error);
    // Return empty string with a friendly message instead of a 500 error, so the frontend falls back gracefully without crashing
    res.json({ 
      audio: "", 
      message: "TTS API Quota exceeded or service unavailable. Falling back to high-quality browser SpeechSynthesis."
    });
  }
});

async function startServer() {
  // Vite dev middleware if not in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
