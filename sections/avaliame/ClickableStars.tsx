import { useSection } from "deco/hooks/useSection.ts";
import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";

export type Star = {
  rating: number;
};

export default function ClickableStars({ rating }: Star) {
  function createStarArray() {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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
    <div id="target" class="flex gap-1">
      {stars.map((s, i) => (
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: i + 1 } })}
        >
          <Icon id={s} />
        </button>
      ))}
    </div>
  );
}
