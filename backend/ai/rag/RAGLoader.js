import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";

//TODO: Import this from config
const chunkConfig = {
  size: 1000, // characters per chunk
  overlap: 200, // small overlap for better semantic continuity
}

export const loadAndSplitDocs = async (fileName) => {
    const resolvedPath = path.resolve('public', 'data', fileName);

    // const filepath = path.resolve('public', 'data', 'sample-local-pdf.pdf');
  // Load the PDF document
  const loader = new PDFLoader(resolvedPath);
  const docs = await loader.load();

  // Split the document into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkConfig.size,
    chunkOverlap: chunkConfig.overlap,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);
  console.log(`✅ Loaded and split ${splitDocs.length} chunks.`);
  return splitDocs;
}