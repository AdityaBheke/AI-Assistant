import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {createRAGChain} from './../rag/RAGChain.js'
import leadService from "../../services/LeadService.js";
import emailLogService from "../../services/EmailLogService.js";

// --- Tool 1: createLead ---
const createLeadTool = tool(
  async ({ email }) => {
    // TODO: Implement the actual service call
    const lead = await leadService.findLeadsByEmail(email);
    console.log('Result of findLeadByEmail:', lead);
    
    if (lead) {
        return { leadId: lead._id };
    }
    const newLead = await leadService.createLead({ email });
    console.log('Result of createLead:', newLead);
    return { leadId: newLead._id };
  },
  {
    name: "createLead",
    description: "Creates a lead with email",
    schema: z.object({
      email: z.string().email().describe("Customer's email address")
    }),
  }
);

const updateMessagesTool = tool(
  async ({ leadId, messages }) => {
    // TODO: Implement the actual service call
    console.log('Updating messages for lead:', leadId, messages);
    await leadService.updateLead(leadId, { messages });
    return { success: true };
  },
  {
    name: "updateMessages",
    description: "Updates the messages for a lead.",
    schema: z.object({
      leadId: z.string().describe("The ID of the lead"),
      messages: z.array(z.object({
        role: z.string().describe("The role of the message sender"),
        content: z.string().describe("The content of the message")
      })).describe("The messages to update")
    }),
  }
);

// --- Tool 2: sendEmail ---
const sendEmailTool = tool(
  async ({ leadId, to, subject, body }) => {
    // Implement the actual service call
    console.log(`Sending email to`,{leadId, to, subject, body});
    await emailLogService.sendEmailToLead(leadId, to, subject, body);
    console.log('e-mail sent to:', to, subject);
  },
  {
    name: "sendEmail",
    description: "Sends an email to a customer or lead.",
    schema: z.object({
      leadId: z.string().describe("Lead ID od a lead to which we are sending email"),
      to: z.string().email().describe("Email Id to which we are sending a mail"),
      subject: z.string().describe("Subject of a mail"),
      body: z.string().describe("Body of a mail"),
    }),
  }
);

const ragTool = tool(
    async ({ messages }) => {
        console.log("RAG tool invoked with messages:", messages);

        const ragChain = await createRAGChain();
        const tempMessages = [...messages];
        const lastMessage = tempMessages.pop();

        const result = await ragChain.invoke({ question: lastMessage.content, messages: tempMessages });

        console.log("RAG result:", result.content);
        return result.content;
    },
    {
        name: "RAGKnowledgeBase",
        description: "Retrieves factual information about product and services from business knowledge base documents.",
        schema: z.object({
            messages: z.array(
                z.object({
                    role: z.string(),
                    content: z.string()
                })
            ).describe("Chat messages including user query and prior context."),
        }),
    }
);

export {
  createLeadTool,
  sendEmailTool,
  updateMessagesTool,
  ragTool,
}