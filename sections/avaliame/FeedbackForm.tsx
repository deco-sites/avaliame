import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";
import { supabase } from "../../supabase/index.ts";
import { Section } from "deco/mod.ts";
import { useComponent } from "../Component.tsx";

export type Props = {
  sections: Section[];
};

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

export default function FeedbackForm({ sections }: Props) {
  return (
    <form
      hx-post={useComponent(import.meta.url)}
      hx-trigger="submit"
      class="w-full flex flex-col gap-4"
    >
      {sections.map((s) => <s.Component {...s.props} />)}
      <button type="submit" class="bg-blue-500 text-white rounded p-2 w-32">
        Submit
      </button>
    </form>
  );
}
