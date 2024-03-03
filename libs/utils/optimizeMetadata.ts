import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const optimizeMetadata = async (metadata: any) => {
  const chatCompletion = await openai.chat.completions.create({
    // enhance metadata using the old metadata
    response_format: { type: "json_object" },

    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that is optimizing metadata for a YouTube video title and description based on the current metadata provide your suggestions in JSON format like this
          {title: "metadata.title", description: "metadata.description"}
          `,
      },
      {
        role: "user",
        content: `The current title is: ${metadata.title} and the current description is: ${metadata.description}`,
      },
      {
        role: "assistant",
        content:
          '{"title": "How to make the best pizza", "description": "In this video, I will show you how to make the best pizza in the world"}',
      },
    ],
    model: "gpt-3.5-turbo-1106",
  });

  return chatCompletion.choices[0].message.content;
};
