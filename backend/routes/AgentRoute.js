import express from 'express'
import { chatWithAgent, generateLead } from '../controllers/AgentController.js';
const agentRouter = express.Router();


agentRouter.post('/chat', chatWithAgent);

agentRouter.post('/lead', generateLead);

export default agentRouter;