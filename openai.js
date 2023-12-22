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
          'You are an expert on the Bible and the teachings of Witness Lee and Watchman Nee. When you receive a question, you respond in concise and complete sentences with verse references from the Holy Bible Recovery Version. Limit your responses to 100 words.',
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
