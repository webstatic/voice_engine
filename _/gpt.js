// // const { Configuration, OpenAIApi } = require("openai");
// import { OpenAI } from "openai";


// const openai = new OpenAI({
//     apiKey: "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"
// });


// const chatHistory = [];

// const GPTOutput = await openai.ChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [
//         { "role": "system", "content": "You are a helpful assistant." },
//         { "role": "user", "content": "Who won the world series in 2020?" }
//     ],
// });

// const output_text = GPTOutput.data.choices[0].message.content;
// console.log(output_text);

process.env.OPENAI_KEY = "org-6rtHcAkQpbfnqFpEOrwBIhsA"
process.env.OPENAI_SECRET_KEY = "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"

import { getCompletion } from "gpt3";

let option = {
    openAIKey: "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",
    openAISecretKey: "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"
};

const result = await getCompletion("Once upon a time, ", {}, option);

console.log(result);