import { Section, SectionProps } from "deco/mod.ts";
import { supabase } from "../../supabase/index.ts";
import Star from "./Star.tsx";

export interface Props {
  sections: Section[];
}

export const loader = async (props: Props, req: Request) => {
  const regex = /\/products\/([^?]+)/;
  const match = req.url.match(regex);
  const productId = match?.[1];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 500);

  const response = await supabase
    .from("feedback")
    .select("*")
    .eq("product", productId)
    .abortSignal(controller.signal);

  clearTimeout(timeoutId);

  const { data } = response;

  const comments = data;

  return {
    sections: props.sections,
    comments: comments,
  };
};

export default function CharacteristicsRating({
  comments,
  sections,
}: SectionProps<typeof loader>) {
  console.log(comments);
  return (
    <div>
      {comments?.map((c) => (
        <Star rating={c.rating} />
      ))}
    </div>
  );
}
