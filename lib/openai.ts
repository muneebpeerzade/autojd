"use server"
import OpenAI from "openai";

export const openaiClient = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.OPENAI_API_TESTKEY, 
});