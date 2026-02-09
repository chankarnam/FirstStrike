
import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../constants";
import { CommandPlan, Incident, Resource } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateCommandPlan(incidents: Incident[], resources: Resource[], latLng?: { latitude: number, longitude: number }): Promise<CommandPlan & { error?: string, grounding?: any }> {
    const ai = this.getAI();
    
    // Explicitly reinforcing the JSON structure in the user prompt to override conversational tendencies during grounding
    const prompt = `
      CONTEXT: You are the FirstStrike Multi-Agent Orchestrator.
      INCIDENTS: ${JSON.stringify(incidents)}
      RESOURCES: ${JSON.stringify(resources)}
      USER LOCATION: ${latLng ? JSON.stringify(latLng) : 'Unknown'}
      
      TASK: 
      1. Use Google Search and Maps to verify real-world conditions/hospitals.
      2. Produce a TACTICAL COMMAND PLAN in JSON format.
      
      JSON SCHEMA (Strict Requirement):
      {
        "summary": "Concise tactical overview (string)",
        "nextSteps": ["Step 1", "Step 2"],
        "allocations": [{"resourceId": "UNIT-ID", "incidentId": "INC-ID", "task": "Specific task"}],
        "risks": ["Risk factor 1", "Risk factor 2"]
      }

      Return ONLY the JSON. No conversational text.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: latLng ? {
            retrievalConfig: {
              latLng: {
                latitude: latLng.latitude,
                longitude: latLng.longitude
              }
            }
          } : undefined
        },
      });

      const text = response.text || "";
      const grounding = response.candidates?.[0]?.groundingMetadata;

      // Improved extraction: look for JSON even if wrapped in markdown or conversational text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      let data: CommandPlan;

      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[0]);
          // Validate structure - ensure arrays exist
          data.nextSteps = data.nextSteps || [];
          data.allocations = data.allocations || [];
          data.risks = data.risks || [];
          if (!data.summary) data.summary = text.split('{')[0].trim() || "Plan synthesized.";
        } catch (e) {
          // JSON was found but malformed
          data = this.createFallbackPlan(text);
        }
      } else {
        // No JSON found at all, treat the whole response as a summary
        data = this.createFallbackPlan(text);
      }

      return { ...data, grounding };
    } catch (error: any) {
      console.error("Gemini Plan Error:", error);
      const errorMsg = error?.message || "";
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
        return {
          ...this.createFallbackPlan("TACTICAL NODE OFFLINE: Public quota exhausted."),
          error: "QUOTA_LIMIT"
        };
      }
      return this.createFallbackPlan("Communication link disrupted. Manual override active.");
    }
  }

  private createFallbackPlan(rawText: string): CommandPlan {
    return {
      summary: rawText.slice(0, 500) || "Awaiting tactical assessment...",
      nextSteps: ["Verify manual protocols", "Check secondary communications"],
      allocations: [],
      risks: ["Automatic synthesis degraded"]
    };
  }

  async generateSatelliteIntelligence(incident: Incident): Promise<string | null> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high-resolution satellite thermal map view of a ${incident.type} at ${incident.location.address}. Tactical HUD overlay style.` }]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      return null;
    }
  }

  async generateAudioBriefing(text: string): Promise<AudioBuffer | null> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Commander, tactical update: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) return null;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      return await this.decodeAudioData(this.base64ToUint8(base64Audio), audioCtx, 24000, 1);
    } catch (error) {
      return null;
    }
  }

  private base64ToUint8(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}

export const geminiService = new GeminiService();
