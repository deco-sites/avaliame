import { supabase } from "../../supabase/index.ts";
import Comment, { Props as CommentProps } from "./Comment.tsx";
import { type AppContext } from "../../apps/site.ts";
import { SectionProps } from "deco/mod.ts";

// deno-lint-ignore ban-types
export type CommentListProps = {};

export const loader = async (
  _props: CommentProps,
  _req: Request,
  _ctx: AppContext,
) => {
  const regex = /\/products\/([^?]+)/;
  const match = _req.url.match(regex);
  const productId = match?.[1];

  if (!productId) {
    console.error("Product ID not found in URL");
    return { comments: null };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await supabase
      .from("feedback")
      .select("*")
      .eq("product", productId)
      .abortSignal(controller.signal);

    clearTimeout(timeoutId);

    const { data, error } = response;

    if (error) {
      console.error("Error fetching comments:", error.message);
      return { comments: null };
    }

    const comments = data;

    return { comments };
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Fetch aborted due to timeout");
    } else {
      console.error("Error during fetching comments:", error);
    }
    return { comments: null };
  }
};

export default function CommentList({ comments }: SectionProps<typeof loader>) {
  console.log("Received comments:", comments);

  return (
    <div className="gap-4 flex flex-col">
      <h1 className="font-[600] text-lg">Opiniões em destaque</h1>
      {comments?.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}
