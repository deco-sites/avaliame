import { supabase } from "../../supabase/index.ts";
import Comment from "./Comment.tsx";
import { type AppContext } from "../../apps/site.ts";
import { SectionProps } from "deco/mod.ts";
import {
  aiGenerator,
  extractFeedbackDescriptions,
} from "../../utils/aiGenerator.ts";
import Icon from "../../components/ui/Icon.tsx";
import { useSection } from "deco/hooks/useSection.ts";

interface Key {
  key?: string;
  /*
  @hide
  */
  recente?: boolean;
  /*
  @hide
  */
  qualification?: boolean;
}

export const loader = async (props: Key, req: Request, _ctx: AppContext) => {
  const regex = /\/products\/([^?]+)/;
  const match = req.url.match(regex);
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

    const feedbackDescriptions = extractFeedbackDescriptions(comments ?? []);

    const opinion = await aiGenerator(feedbackDescriptions, props.key);

    return {
      comments,
      generalOpinion: opinion,
      recente: props.recente,
      qualification: props.qualification,
    };
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
  recente,
  qualification,
}: SectionProps<typeof loader>) {
  const sortFeedbacksByDate = comments
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const orderByQualification = comments
    ?.slice()
    .sort((a, b) => b.rating - a.rating);

  if (recente) {
    return (
      <div id="comments">
        {sortFeedbacksByDate?.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    );
  }

  if (qualification) {
    return (
      <div id="comments">
        {orderByQualification?.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    );
  }

  return (
    <div className="gap-4 flex flex-col w-full">
      <details class="dropdown">
        <summary class="btn m-1 px-4">Ordenar ▼</summary>
        <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li>
            <button
              hx-swap="outerHTML"
              hx-target="#comments"
              hx-get={useSection({ props: { recente: true } })}
            >
              Mais recentes
            </button>
          </li>
          <li>
            <button
              hx-swap="outerHTML"
              hx-target="#comments"
              hx-get={useSection({ props: { qualification: true } })}
            >
              Qualificação
            </button>
          </li>
        </ul>
      </details>
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
      <div id="comments">
        {comments?.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
}
