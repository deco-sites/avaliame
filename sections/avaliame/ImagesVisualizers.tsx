import { SectionProps } from "deco/mod.ts";
import { supabase } from "../../supabase/index.ts";
import Image from "apps/website/components/Image.tsx";

export const loader = async (_props: unknown, req: Request) => {
  const regex = /\/products\/([^?]+)/;
  const match = req.url.match(regex);
  const productId = match?.[1];

  if (!productId) {
    console.error("Product ID not found in URL");
    return { comments: null };
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 500);

  const response = await supabase
    .from("feedback")
    .select("*")
    .eq("product", productId)
    .abortSignal(controller.signal);

  clearTimeout(timeoutId);

  const { data } = response;

  return { comments: data };
};

export default function ImagesVisualizers({
  comments,
}: SectionProps<typeof loader>) {
  return (
    <div className="flex gap-4 w-full p-4 rounded-md">
      {comments?.map((comment) =>
        comment.image ? (
          <a href={`#${comment.id}`}>
            <Image
              src={comment.image}
              width={90}
              height={90}
              alt={`Image for comment ${comment.id}`}
              className="rounded-md hover:cursor-pointer hover:scale-125 transition-transform duration-500 ease-in-out shadow-md"
            /> 
          </a>
        ) : null
      )}
    </div>
  );
}
