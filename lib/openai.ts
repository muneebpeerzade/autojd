import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_TESTKEY;
const openai = new OpenAI({
  apiKey,
});

const response = openai.responses.create({
  model: "gpt-4o-mini",
  input: "write a haiku about ai",
  store: true,
});

response.then((result) => console.log(result.output_text));
