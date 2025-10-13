// TODO: Set-up NodeMailer

export const sendEmail = async (to, subject, body)=>{
    setTimeout(()=>{
        console.log(`Email sent to: ${to} with Subject: ${subject} and body: ${body}`);
    },1000)
}