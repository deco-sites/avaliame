import { supabase } from "../../supabase/index.ts";
import Comment from "./Comment.tsx";
import { type AppContext } from "../../apps/site.ts";
import { SectionProps } from "deco/mod.ts";
import {
  aiGenerator,
  extractFeedbackDescriptions,
} from "../../utils/aiGenerator.ts";
import Icon from "../../components/ui/Icon.tsx";

interface Key {
  key: string;
}

export const loader = async (props: Key, _req: Request, _ctx: AppContext) => {
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

    console.log("Comments-------->", comments);
    const feedbackDescriptions = extractFeedbackDescriptions(comments ?? []);

    console.log("Feedbacks-------->", feedbackDescriptions);
    const opinion = await aiGenerator(feedbackDescriptions, props.key);

    console.log(opinion);

    return { comments, generalOpinion: opinion };
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Fetch aborted due to timeout");
    } else {
      console.error("Error during fetching comments:", error);
    }
    return { comments: null, key: null };
  }
};

export default function CommentList({
  comments,
  generalOpinion,
}: SectionProps<typeof loader>) {
  return (
    <div className="gap-4 flex flex-col w-full">
      <h1 className="font-[600] text-lg">Opiniões em destaque</h1>
      <div class="">
        <div class="">{generalOpinion}</div>
        <div class="flex gap-2 mt-3 text-gray-600">
          <Icon width={20} height={20} id="ai" />
          <span class="text-sm">
            Resumo com base em opiniões de compradores
          </span>
        </div>
      </div>
      {comments?.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}
