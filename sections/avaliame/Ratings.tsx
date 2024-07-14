import { SectionProps } from "deco/mod.ts";
import { supabase } from "../../supabase/index.ts";
import Star from "./Star.tsx";

export const loader = async (_: unknown, _req: Request) => {
  const regex = /\/products\/([^?]+)/;
  const match = _req.url.match(regex);
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

  const count = data?.length || 0;

  const ratings = data?.map((d) => d.rating);

  const ratingLength = ratings?.length || 0;

  const ratingAverage =
    ratings?.reduce((sum, rating) => sum + rating, 0) / ratingLength;

  const productInfo = {
    rating: Number(ratingAverage.toFixed(2)),
    count: count,
  };

  return { productInfo };
};

export default function Ratings(props: SectionProps<typeof loader>) {
  return (
    <div className="flex flex-row gap-2">
      <h1 className="text-5xl		 text-green-600	font-[700]">
        {props.productInfo.rating}
      </h1>
      <div className="flex flex-col">
        <Star rating={props.productInfo.rating} />
        <span className=" text-sm font-[300]">
          {props.productInfo.count} avaliações
        </span>
      </div>
    </div>
  );
}
