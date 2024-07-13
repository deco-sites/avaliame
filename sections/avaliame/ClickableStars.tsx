import { useSection } from "deco/hooks/useSection.ts";
import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";

export default function ClickableStars({ rating }: { rating?: number }) {
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

  return (
    <div id="sla" class="flex gap-1">
      {stars.map((s, i) => (
        <div>
          <input
            hx-swap="outerHTML"
            hx-target="#sla"
            hx-get={useSection({ props: { rating: i + 1 } })}
            id={i + ""}
            type="radio"
            class="hidden"
            value="rating-stars"
          />
          <label for={i + ""} htmlFor={i + ""}>
            {" "}
            <Icon id={s} />
          </label>
        </div>
      ))}
    </div>
  );
}
