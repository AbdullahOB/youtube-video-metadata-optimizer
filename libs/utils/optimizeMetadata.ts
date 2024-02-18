import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const optimizeMetadata = async (
  metadata: string,
  transcript: string
) => {
  const chatCompletion = await openai.chat.completions.create({
    // enhance metadata using the old metadata and the transcript
    messages: [
      {
        role: "user",
        content: `Act live a youtube video content creator, working in the 
        news field, so make the title and the description of the video be the most efficient for youtube according to this transcript: ${transcript}`,
      },
      { role: "assistant", content: metadata },
    ],
    model: "gpt-3.5-turbo",
  });

  // Open in dev

  // console.log(chatCompletion.choices[0].message.content);
  // return as json
  return chatCompletion.choices[0].message.content;
};
