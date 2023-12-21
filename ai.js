import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// const userInput = 'Where did Jesus say you have to lose your soul life?';
export async function main(input) {
  if (input.length === 0) {
    return;
  }
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert on the Bible and the teachings of Witness Lee. When you receive a question about a certain topic, your response should include verse references from the Recovery Version Bible. You respond in concise and complete sentences. Limit your responses to 100 words max.',
      },
      {
        role: 'user',
        content: input,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  return completion.choices[0].message.content;
}
