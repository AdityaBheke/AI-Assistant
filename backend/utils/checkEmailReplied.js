import { ImapFlow } from "imapflow";
import dotenv from "dotenv";
import emailLogService from "../services/EmailLogService.js";
import leadService from "../services/LeadService.js";
dotenv.config();


export const checkEmailReplies = async () => {
    const client = new ImapFlow({
          host: "imap.gmail.com",
          port: 993,
          secure: true,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
          logger: false
      });
  try {

    await client.connect();
    console.log("Connected:", client.usable);

    const mailbox = await client.mailboxOpen("INBOX");
    console.log("Opened mailbox:", mailbox.path, " | Total messages:", mailbox.exists);

    const sinceDate = new Date(Date.now()- (2*24*60*60*1000));
    const result = await client.search({since: sinceDate});

    console.log("Found result:", result?.length);
    
    for (let msgId of result){
        const msg = await client.fetchOne(msgId, {envelope:true, source:true})

        const headers = msg.envelope;
        console.log("Headers of mails", headers);
        // console.log("Source of mails", msg.source.toString());
        const inReplyTo = headers.inReplyTo || msg.source.toString().match(/In-Reply-To:\s*(.*)/i)?.[1];
        console.log("Found in reply to:", inReplyTo);
        if (inReplyTo) {
            const emailLog = await emailLogService.updateEmailLogByMessageId(inReplyTo);
            if (emailLog) {
                const lead = await leadService.updateLeadStatus(emailLog.leadId, 'replied')
                console.log("Lead has replied to your email: ", lead?.lead?.email);
                
            }
        }
        console.log("From:", msg.envelope.from[0]?.address);
        console.log("Subject:", msg.envelope.subject);
        console.log("Date:", msg.envelope.date);
        console.log("------------------------");        
    }

    if (client.usable && client.mailbox) {
      console.log("✅ Connection to inbox is successful!");
    } else {
      console.log("❌ Not connected to inbox");
    }
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await client.logout();
  }
};
