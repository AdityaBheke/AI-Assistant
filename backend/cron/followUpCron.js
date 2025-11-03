// backend/cron/followUpCron.js
import cron from "node-cron";
import leadService from "../services/LeadService.js";
import { checkEmailReplies } from "../utils/checkEmailReplied.js";
import { invokeAgent } from "../ai/agent/GeminiAgent.js";
import { isAIMessage } from "@langchain/core/messages";
import emailLogService from "../services/EmailLogService.js";

// Schedule the cron job to run every day at 9:00 AM
cron.schedule("* * * * *", async () => {
  try {
    console.log("---------------------------------------------");
    
    console.log("Starting daily follow-up cron job...");

    // Step 1: Check for email replies and update statuses
    await checkEmailReplies();
    console.log("Email replies checked and statuses updated.");

    // Step 2: Fetch all leads who haven't replied yet (status: 'new')
    const pendingLeads = await leadService.getPendingLeads();
    console.log(`Found ${pendingLeads.length} pending leads.`);

    // Step 3: Process each pending lead
    for (const lead of pendingLeads) {
      try {
        // Generate summary from lead messages
        // messages[] contains conversation history
        const allMessages = lead.messages.length>0?lead.messages:{role:"user", content: "I just want to explore about Modelcam Tevhnologies pvt. ltd."};
        console.log('All messages', allMessages);
        
        const response = await invokeAgent({messages:[{role:'user', content:`Generate only an email body with no extra information which I can directly pass as an email body for follow-up a lead Summarize the following chat between AI agent and a lead where all messages are: ${JSON.stringify(allMessages)} `}]});
        const summary = response.messages.reverse().find(isAIMessage).content;
        // Construct email body with summary
        // const emailBody = `Hi ${lead.name || "there"},\n\nFollowing up on our previous conversation:\n\n${summary}\n\nBest regards,\nYour Company`;

        // Step 4: Send follow-up email
        console.log("Pending Lead:", lead);
        await emailLogService.sendEmailToLead(lead._id, lead.email, "Following up on our conversation", summary)

        console.log(`Follow-up email sent to ${lead.email}`);
      } catch (err) {
        console.error(`Error processing lead ${lead._id}:`, err.message);
      }
    }

    console.log("Daily follow-up cron job completed successfully.");
  } catch (err) {
    console.error("Error in follow-up cron job:", err.message);
  }
});
