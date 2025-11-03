import { invokeAgent } from "../ai/agent/GeminiAgent.js";
import { isAIMessage, isToolMessage } from "@langchain/core/messages";

export const chatWithAgent = async (req, res, next) => {
    try {
        // Extract all messages and conversationId(optional) from req.body
        const { messages, leadId } = req.body;

        if (leadId) {
            // Update all messages to conversation
            await invokeAgent({messages:[{
                role: "user",
                content: `Update the messages for this leadId: ${leadId} with these messages: ${JSON.stringify(messages)}`
            }]});
        }else{
            console.log('leadId not found');
        }
        // Make RAG call
        console.log('Making rag call with messages array:', messages);
        const response = await invokeAgent({
            messages
        });
        const finalMessage = response.messages.reverse().find(isAIMessage);
        
        res.json({ success: true, message: 'Chat with agent successful', data: finalMessage.content });
    } catch (error) {
        next(error);
    }
};

export const generateLead = async (req, res, next) => {
    try {
        const { email } = req.body;
        // create lead with email
        const leadResult = await invokeAgent({messages:[{
            role: "user", content: `Create a lead with this email: ${email}`
        }]})

        const leadToolMsg = leadResult.messages.find(isToolMessage);
        const { leadId } = JSON.parse(leadToolMsg.content);

        // send welcome email to email
        await invokeAgent({messages:[{
            role: "user", content: `Send a welcome email to lead with leadId: ${leadId} and email: ${email} with subject: Welcome to Our Service and body: Hello, thank you for showing interest in our services. We will get back to you shortly.`
        }]});
        res.json({ success: true, message: 'Lead generated successfully', leadId });
    } catch (error) {
        next(error);
    }
};
