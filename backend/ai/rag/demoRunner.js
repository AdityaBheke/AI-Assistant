import { loadAndSplitDocs } from "./RAGLoader.js";
import { storeEmbeddings, deleteBySource } from "./RAGVectorStore.js";
import { createRAGChain } from "./RAGChain.js";

const loadAndStore = async () => {
    const docs = await loadAndSplitDocs('Creo Design Premium Plus Brochure.pdf');
    await storeEmbeddings(docs);
}

// loadAndStore();
// deleteBySource('AdityaB.pdf');

const runRAGChain = async ()=>{
    const ragChain = await createRAGChain();

    const result = await ragChain.invoke({
        question: "Give answer again for the previous question.",
        messages: [
            { role: "user", content: "List the features of the product." }
        ]
    })

    console.log("Response:",result.content);
    
}

runRAGChain();