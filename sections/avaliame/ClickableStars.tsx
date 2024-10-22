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
      <input type="hidden" name="rating" value={rating} />
      {stars.map((s, i) => (
        <div>
          <input
            hx-get={useComponent(import.meta.url, {
              ...props,
              rating: i + 1,
            })}
            id={i + "click"}
            type="radio"
            class="hidden"
            hx-target={`#${randomId}`}
            hx-swap="outerHTML"
          />
          <label for={i + "click"} htmlFor={i + "click"} class="cursor-pointer">
            {" "}
            <Icon width={36} height={36} id={s} />
          </label>
        </div>
      ))}
    </div>
  );

  if (rating > 0) {
    return starLouca;
  }

  return (
    <div
      class={`flex ${
        title ? "justify-between" : "justify-center"
      }  w-full border-b p-2`}
    >
      <h3 class="text-sm">{title}</h3>
      {starLouca}
    </div>
  );
}
