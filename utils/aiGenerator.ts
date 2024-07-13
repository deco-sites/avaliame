export type Props = {
  id: string;
  rating: number;
  feedback_title: string;
  feedback_description: string;
  user: string;
  created_at: string;
  product: string;
};

export function extractFeedbackDescriptions(
  comments: Props[],
): string[] {
  return comments.map((comment) => comment.feedback_description);
}

export async function aiGenerator(
  feedbackDescriptions: string[],
  key: string,
): Promise<string> {
  const apiKey = key;
  const prompt =
    `Por favor, Imagine que voce e um consumidor e formule uma opinião imparcial de até 50 palavras baseado nessas opiniões: ${
      JSON.stringify(feedbackDescriptions)
    }`;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: prompt },
        ],
        max_tokens: 70,
      }),
    });
    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    console.log("GPT OPINION ------->", data.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return `Error: ${error.message}`;
  }

  // return data.choices[0].text.trim();
  return "tets";
}
