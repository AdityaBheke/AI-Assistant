import { getRetriever } from "./RAGRetriever.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from '@langchain/core/prompts';
import dotenv from 'dotenv';
dotenv.config();

export async function createRAGChain() {
    const llm = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
    });
    const prompt = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant. 
    Use the context below to answer the user's question accurately and concisely.

    Context:
    {context}

    Question:
    {question}

    Answer:
    `);
    const ragChain = RunnableSequence.from([
        async (input)=>{
            const result = await getRetriever(input.question);
            const context = result.map((doc)=>doc.pageContent).join("\n\n");
            return { question: input.question, context}
        },
        prompt,
        llm
    ]);
    return ragChain;
}