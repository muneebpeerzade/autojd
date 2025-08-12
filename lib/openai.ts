
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.OPENAI_API_TESTKEY, 
});
// "use server"
// import OpenAI from "openai";

// const apiKey = process.env.OPENAI_API_TESTKEY;
// console.log("this is the key", apiKey)
// const openai = new OpenAI({
//   baseURL: 'https://api.deepseek.com',
//   apiKey: apiKey,
// });

// const response = openai.responses.create({
//   model: "deepseek-chat",
//   input: "write a haiku about ai",
//   store: true,
// });

// response.then((result) => console.log(result.output_text));
// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "deepseek-chat",
//   });

//   console.log(completion.choices[0].message.content);
// }

// main();