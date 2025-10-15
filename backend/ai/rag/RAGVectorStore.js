import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { hashString } from './../../utils/hash.js'
import dotenv from 'dotenv';
import path from "path";
dotenv.config();

// Pinecone client initialization
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const NAMESPACE = "demo-namespace";
const index = pinecone.Index("demo");

// Google embedding model name
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'text-embedding-004', 
    apiKey: process.env.GEMINI_API_KEY,
});

// To create or Retrieve the vector store

export const getVectorStore = async () => {
    try {
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
            pineconeIndex: index,
            namespace: NAMESPACE
        });
        console.log("Retrieved existing vector store from Pinecone successfully!");
        return vectorStore;
    } catch (error) {
        console.error("Failed to retrieve vector store from Pinecone:", error);
    }
}

// Store Embeddings to Pinecone.
export const storeEmbeddings = async (docs) => {
    // Check to ensure docs are valid
    if (!docs || docs.length === 0) {
        console.error("No documents were loaded or split. Aborting storage.");
        return;
    }
    try {
        const vectorStore = await getVectorStore();
        const uniqueDocs = [];
        const seenChunks = new Set();
        for (const doc of docs) {
      const source = doc.metadata?.source || "unknown";
      // Combine source + content to uniquely identify chunks
      const chunkId = hashString(source + doc.pageContent);

      if (!seenChunks.has(chunkId)) {
        seenChunks.add(chunkId);
        uniqueDocs.push({
          ...doc,
          metadata: {
            ...doc.metadata,
            source,
            hash: hashString(source), // same across all chunks of a file
            chunkId, // unique to each chunk
          },
        });
      }
    }

        await vectorStore.addDocuments(uniqueDocs);
        console.log(`Successfully stored ${uniqueDocs.length} unique documents in Pinecone.`);
    } catch (error) {
        console.error("Failed to store embeddings in Pinecone:", error);
    }
};

export const deleteBySource = async (source) => {
  if (!source) {
    console.error("Source is required for deletion.");
    return;
  }

  try {
    const src = path.resolve('public', 'data', source);
    console.log("Resolved source path for deletion:", src);
    const hashValue = hashString(src);
    const namespace = index.namespace(NAMESPACE);
    const deleteResponse = await namespace.deleteMany({ hash: hashValue });
    console.log(`Deleted all vectors for source: ${source}`, deleteResponse);
  } catch (error) {
    console.error("Error deleting vectors by source:", error);
  }
};