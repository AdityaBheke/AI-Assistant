import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from 'dotenv';

dotenv.config();

// Pinecone client initialization
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.Index("business-knowledge");
// Google embedding model name
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'text-embedding-004', 
    apiKey: process.env.GEMINI_API_KEY,
});

export const storeEmbeddings = async (docs) => {
    // Check to ensure docs are valid
    if (!docs || docs.length === 0) {
        console.error("No documents were loaded or split. Aborting storage.");
        return;
    }
    try {
        const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: "business"
        });
        console.log("Documents embedded and stored in Pinecone successfully!");
        return vectorStore;
    } catch (error) {
        console.error("Failed to store embeddings in Pinecone:", error);
    }
};

export const getVectorStore = async () => {
    try {
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
            pineconeIndex: index,
            namespace: "business"
        });
        console.log("Retrieved existing vector store from Pinecone successfully!");
        return vectorStore;
    } catch (error) {
        console.error("Failed to retrieve vector store from Pinecone:", error);
    }
}