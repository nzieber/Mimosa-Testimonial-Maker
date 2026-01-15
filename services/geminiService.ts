
import { GoogleGenAI, Type } from "@google/genai";
import { TestimonialEntry, TestimonialOutputs } from "../types";

export const geminiService = {
  generateTestimonials: async (entry: TestimonialEntry): Promise<TestimonialOutputs> => {
    // Initialize GoogleGenAI with process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Clean data for AI processing
    const inputData = { ...entry };
    if (entry.anonymize) {
      inputData.participantName = "[Anonymized]";
      inputData.company = "[Anonymized Org]";
    }

    const prompt = `
      Act as a world-class marketing copywriter and brand strategist for "Mimosa Workshops".
      Your task is to generate four types of testimonials based on the following participant data:
      ${JSON.stringify(inputData, null, 2)}

      Brand Voice Guidelines: ${entry.brandVoice}
      Tone: ${entry.tone}
      Target Length: ${entry.length}
      CTA Style: ${entry.ctaStyle}

      Output Requirements:
      1. Blog Post: Long-form narrative with sections (Hook, Before, What I built, How it works with screenshot placeholders like [Screenshot 1: Description], What surprised me, Who this is for, Closing).
      2. LinkedIn: Professional, high-converting with hook and bullets.
      3. X (Twitter) Thread: 5-10 engaging tweets starting with a strong hook.
      4. Email: Referral style to a friend or manager with 3 subject line options.

      Strictly follow the JSON schema provided. Do not invent metrics; use provided ones or speak about "early results".
    `;

    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for the complex reasoning task of generating high-quality marketing copy across multiple formats
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blogPost: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
              },
              required: ["title", "content"],
            },
            linkedIn: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
              },
              required: ["content"],
            },
            twitterThread: {
              type: Type.OBJECT,
              properties: {
                tweets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["tweets"],
            },
            email: {
              type: Type.OBJECT,
              properties: {
                subjects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                content: { type: Type.STRING },
              },
              required: ["subjects", "content"],
            },
          },
          required: ["blogPost", "linkedIn", "twitterThread", "email"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}") as TestimonialOutputs;
    return result;
  }
};
