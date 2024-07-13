import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../Component.tsx";

export interface Props {
  /*
  @hide
  */
  rating?: number;
  title?: string;
}

export default function ClickableStars(props: Props) {
  const { rating = 0, title } = props;

  function createStarArray() {
    console.log(rating);
    const fullStars = Math.floor(rating ?? 0);
    const hasHalfStar = (rating ?? 0) % 1 !== 0;

    const starArray: AvailableIcons[] = [];

    for (let i = 0; i < fullStars; i++) {
      starArray.push("star");
    }

    if (hasHalfStar) {
      starArray.push("half-star");
    }

    while (starArray.length < 5) {
      starArray.push("empty-star");
    }

    return starArray;
  }
  const stars: AvailableIcons[] = createStarArray();

  const randomId = useId();

  const starLouca = (
    <div id={randomId} class="flex gap-1">
      <input type="hidden" name="cost_benefit" value={rating} />
      {stars.map((s, i) => (
        <div>
          <input
            hx-get={useComponent(import.meta.url, {
              ...props,
              rating: i + 1,
            })}
            id={i + "cost_benefit"}
            type="radio"
            class="hidden"
            hx-target={`#${randomId}`}
            hx-swap="outerHTML"
          />
          <label
            for={i + "cost_benefit"}
            htmlFor={i + "cost_benefit"}
            class="cursor-pointer"
          >
            {" "}
            <Icon id={s} />
          </label>
        </div>
      ))}
    </div>
  );

  if (rating > 0) {
    return starLouca;
  }

  return (
    <div class="flex justify-between w-full border-b p-2">
      <h3 class="text-sm">{title}</h3>
      {starLouca}
    </div>
  );
}
