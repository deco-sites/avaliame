import { supabase } from "../../supabase/index.ts";
import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";

export async function action(_: unknown, request: Request) {
  try {
    const user = await getIP({ ipv6: true });

    const regex = /\/feedback\/([^?]+)/;
    const match = request.url.match(regex);
    const productId = match?.[1];

    const result = await request.formData();
    const { error } = await supabase.from("feedback").insert({
      rating: result.get("rating"),
      feedback_title: result.get("feedback_title"),
      feedback_description: result.get("feedback_description"),
      user,
      product: productId,
    });

    return error ? { success: false, error } : { success: true };
  } catch (e) {
    console.log(e);
  }
}

export default function FeedbackInput() {
  return (
    <div class="flex gap-4 flex-col items-center w-full m-auto max-w-[40rem]">
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-2xl">Dê mais detalhes sobre seu produto</h2>
        <span class="text-sm text-gray-600">(Opcional)</span>
      </div>

      <textarea
        name="feedback_description"
        maxLength={1500}
        class="border w-full h-52 resize-none rounded p-2"
        placeholder="Eu achei que meu produto..."
      />
      <input
        type="number"
        name="rating"
        placeholder="Rating (number)"
        class="border p-2 rounded w-full"
      />
      <input
        type="text"
        name="feedback_title"
        placeholder="Feedback Title"
        class="border p-2 rounded w-full"
      />
    </div>
  );
}
