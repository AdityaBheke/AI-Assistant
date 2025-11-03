// backend/agents/GeminiAgent.js
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  sendEmailTool,
  ragTool,
  createLeadTool,
  updateMessagesTool
} from "./GeminiAgentTools.js";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini LLM
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
});

// Create the agent with all tools
export const agent = createReactAgent({
  llm: model,
  tools: [
    createLeadTool,
    sendEmailTool,
    updateMessagesTool,
    ragTool,
  ],
});

// Helper function to invoke the agent
export const invokeAgent = async ({messages}) => {
  try {
    console.log("Inside Invoke Agent", messages);
    
    const result = await agent.invoke({ messages });
    return result;
  } catch (err) {
    console.error("Error invoking Gemini agent:", err);
    throw err;
  }
};
