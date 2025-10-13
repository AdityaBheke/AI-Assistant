// Wrapper for LLM API calls
import { ApplicationError } from './../config/ApplicationError.js'

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Create Generative AI instance using API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getLLMResponse = async (prompt)=>{
    try {
        //Initialize model using Model name
        const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
        // Get Response from LLM
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        
        // Return response
        return result.response.text();
    } catch (error) {
        console.log("Gemini Client error:", error);
        throw new ApplicationError("Failed to get response from LLM");
    }
}