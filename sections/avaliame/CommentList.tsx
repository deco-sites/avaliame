import { supabase } from "../../supabase/index.ts";
import Comment, { Props as CommentProps } from "./Comment.tsx";
import { SectionProps } from "deco/mod.ts";

// deno-lint-ignore ban-types
export type CommentListProps = {};

export const loader = async (_: CommentProps, _req: Request) => {
  const regex = /\/products\/([^?]+)/;
  const match = _req.url.match(regex);
  const productId = match?.[1];

  if (!productId) {
    console.error("Product ID not found in URL");
  }

  console.log("Product ID:", productId);

  const response = await supabase
    .from("feedback")
    .select("*")
    .eq("product", productId);

  const { data, error } = response;

  if (error) {
    console.error("Error fetching comments:", error.message);
  }

  const comments = data;

  console.log("Fetched comments:", data);

  return { comments };
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
