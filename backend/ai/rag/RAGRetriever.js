import { getVectorStore } from "./RAGVectorStore.js";

export const getRetriever = async (query, topK=5) => {
    try {
        const vectorStore = await getVectorStore();
        if (!vectorStore) {
            console.error("Vector store is not available. Cannot create retriever.");
            return null;
        }
    
        const results = await vectorStore.similaritySearch(query, topK);
        console.log("Retrieved results:", results.length);
        
        return results;
    } catch (error) {
        console.error("Error retrieving from vector store:", error);
        return [];
    }
}