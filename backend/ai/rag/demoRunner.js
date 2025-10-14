import { loadAndSplitDocs } from "./RAGLoader.js";
import { storeEmbeddings } from "./RAGVectorStore.js";
import { createRAGChain } from "./RAGChain.js";

const loadAndStore = async () => {
    const docs = await loadAndSplitDocs('AdityaB.pdf');
    await storeEmbeddings(docs);
}

// loadAndStore();

const runRAGChain = async ()=>{
    const ragChain = await createRAGChain();

    const result = await ragChain.invoke({
        question: "How many years of experience does Aditya have?"
    })

    console.log("Response:",result.content);
    
}

runRAGChain();