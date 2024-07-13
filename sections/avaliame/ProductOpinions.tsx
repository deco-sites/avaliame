import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";
import { supabase } from "../../supabase/index.ts";
import Ratings from "./Ratings.tsx";
import { Section } from "deco/mod.ts";

export type Props = {
  sections: Section[];
};

export default function ProductOpinions({ sections }: Props) {
  return (
    <div className="flex flex-col gap-4 px-[45px]">
      <h1 className="text-2xl	font-[400]">Opiniões do produto</h1>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-96">
          <Ratings />
        </div>
        <div className="flex flex-col w-96">
          {sections.map((sec) => <sec.Component {...sec.props} />)}
        </div>
      </div>
    </div>
  );
}

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
