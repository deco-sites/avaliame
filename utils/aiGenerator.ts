export type Props = {
  id: string;
  rating: number;
  feedback_title: string;
  feedback_description: string;
  user: string;
  created_at: string;
  product: string;
};

export function extractFeedbackDescriptions(comments: Props[]): string[] {
  return comments.map((comment) => comment.feedback_description);
}

export async function aiGenerator(
  feedbackDescriptions: string[],
  key: string,
): Promise<string> {
  const apiKey = key;
  const prompt =
    `Por favor, Imagine que voce e um consumidor e formule uma opinião imparcial de até 50 palavras baseado nessas opiniões: ${
      JSON.stringify(
        feedbackDescriptions,
      )
    }`;
  let data;
  try {
    console.log(apiKey);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
      }),
      // Adding a timeout option (if your environment supports it)
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });
    data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return `Error: ${error.message}`;
  }

  return data.choices[0].message.content;
}
