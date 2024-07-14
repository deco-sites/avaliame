import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";
import { supabase } from "../../supabase/index.ts";
import Ratings from "./Ratings.tsx";
import { Section } from "deco/mod.ts";
import { ComponentProps } from "../Component.tsx";

export type Props = {
  sections: Section[];
};

export default function ProductOpinions(props: ComponentProps<typeof action>) {
  return (
    <div className="flex flex-col gap-4 px-32">
      <h1 className="text-2xl	font-[400]">Opiniões do produto</h1>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-96">
          <Ratings />
        </div>
        <div className="flex flex-col">
          {props?.sections.map((sec) => <sec.Component {...sec.props} />)}
        </div>
      </div>
    </div>
  );
}

export async function action(props: Props, request: Request) {
  try {
    const user = await getIP({ ipv6: true });

    const regex = /\/feedback\/([^?]+)/;
    const match = request.url.match(regex);
    const productId = match?.[1];

    const result = await request.formData();
    await supabase.from("feedback").insert({
      rating: result.get("rating"),
      feedback_title: result.get("feedback_title"),
      feedback_description: result.get("feedback_description"),
      user,
      product: productId,
    });

    return { ...props };
  } catch (e) {
    console.log(e);
  }
}
