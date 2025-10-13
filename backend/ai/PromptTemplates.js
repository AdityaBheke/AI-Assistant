// Predefined prompts templates

// These are Simple Javascript functions with parameters.

// Reasoning stage
// This builder will build prompt using agent configuration and user's message.
export const reasoningPromptBuilder = (agent, userMessage, memoryContext = "") => {
    const prompt = `
    You are a ${agent.name}, a ${agent.role}.
    Your main goal: ${agent.goal || "assist and complete task efficiently."}

    Previous context: ${memoryContext || "No prior context."}

    New instructions from User: 
    ${userMessage}

    Analyze the situation carefully and decide the best action to take.
    Provide your response in a clear and structured way, indicating:
    1. What action you will perform (e.g., email, update lead, follow conversation)
    2. Any required data or follow-ups

    Respond concisely, focusing only on actionable steps.
    `.trim();

    return prompt;
}

// Tool Prompt builder for Tool execution
export const toolPromptBuilder = (toolName, instruction) => {
    const prompt = `
    You are executing the ${toolName} tool.
    Instruction: ${instruction}
    
    Make sure the output is in a structured format suitable for the tool.
    Do not include irrelevant information.
    `.trim();

  return prompt;
}

// Summary prompt builder to create summary of conversation.
export const summaryPromptBuilder = (conversation)=>{
    const prompt = `
    Summarize the following conversation or task into key points to store as context for future reference:

    ${conversation}

    Make it concise and easy to recall later.
    `.trim();
    return prompt;
}