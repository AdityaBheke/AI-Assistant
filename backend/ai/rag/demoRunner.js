import { loadAndSplitDocs } from "./RAGLoader.js";
import { storeEmbeddings, deleteBySource } from "./RAGVectorStore.js";
import { createRAGChain } from "./RAGChain.js";

const loadAndStore = async () => {
    const docs = await loadAndSplitDocs('AdityaB.pdf');
    await storeEmbeddings(docs);
}

// loadAndStore();
deleteBySource('AdityaB.pdf');

const runRAGChain = async ()=>{
    const ragChain = await createRAGChain();

    const result = await ragChain.invoke({
        question: "List the projects mentioned in the document.",
    })

    console.log("Response:",result.content);
    
}

// runRAGChain();