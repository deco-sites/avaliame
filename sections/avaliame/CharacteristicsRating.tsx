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
}: SectionProps<typeof loader>) {
  const averageValues = comments?.reduce(
    (acc, curr) => {
      acc.cost_benefit += curr.cost_benefit;
      acc.quality += curr.quality;
      acc.wash += curr.wash;
      return acc;
    },
    { cost_benefit: 0, quality: 0, wash: 0 },
  );

  const numFeedbacks = comments?.length;
  if (numFeedbacks !== undefined && numFeedbacks !== 0) {
    averageValues.cost_benefit /= numFeedbacks;
    averageValues.quality /= numFeedbacks;
    averageValues.wash /= numFeedbacks;
  } else {
    averageValues.cost_benefit /= 0;
    averageValues.quality /= 0;
    averageValues.wash /= 0;
  }

  return (
    <div className="flex flex-col gap-2 mt-8">
      <h1 className="text-base		 text-black-600	font-semibold">
        Avaliação de características
      </h1>
      <div className="flex flex-col">
        <span className={"font-[400] text-sm"}>Custo-benefício</span>
        <Star rating={averageValues.cost_benefit} />
      </div>
      <div className="flex flex-col">
        <span className={"font-[400] text-sm"}>Qualidade</span>
        <Star rating={averageValues.quality} />
      </div>
      <div className="flex flex-col">
        <span className={"font-[400] text-sm"}>Não encolhe na lavagem</span>
        <Star rating={averageValues.wash} />
      </div>
    </div>
  );
}
