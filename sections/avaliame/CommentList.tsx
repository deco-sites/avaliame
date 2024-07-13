import { supabase } from "../../supabase/index.ts";
import Comment, { Props as CommentProps } from "./Comment.tsx";
import { type AppContext } from "../../apps/site.ts";
import { SectionProps } from "deco/mod.ts";
import {
  aiGenerator,
  extractFeedbackDescriptions,
} from "../../utils/aiGenerator.ts";

// deno-lint-ignore ban-types
export type CommentListProps = {};

interface Key {
  key: string;
}

export const loader = async (
  props: Key,
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
    return { comments: null, key: props.key };
  }
};

export default function CommentList(
  { comments, key }: SectionProps<typeof loader>,
) {
  console.log("Comments-------->", comments);
  const feedbackDescriptions = extractFeedbackDescriptions(comments ?? []);

  console.log("Feedbacks-------->", feedbackDescriptions);
  aiGenerator(feedbackDescriptions, key!).then((opinion) => {
    console.log("Opinião geral:", opinion);
  });

  return (
    <div className="gap-4 flex flex-col">
      <h1 className="font-[600] text-lg">Opiniões em destaque</h1>
      {comments?.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}
