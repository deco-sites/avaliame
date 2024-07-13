import { useSection } from "deco/hooks/useSection.ts";
import Icon from "../../components/ui/Icon.tsx";
import ClickableStars from "./ClickableStars.tsx";

export type Props = {
  title?: string;
};

export default function StarRating({
  rating,
  title,
}: {
  rating?: number;
  title: Props;
}) {
  if (rating) {
    return (
      <div class="flex justify-between p-2 border-b w-full">
        <h3 class="mb-4">{title.title}</h3>
        <ClickableStars rating={rating} />
      </div>
    );
  }

  return (
    <div id="target" class="flex justify-between p-2 border-b w-full">
      <h3 class="mb-4">{title.title}</h3>
      <div class="flex gap-1">
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: 1 } })}
        >
          <Icon id="empty-star" />
        </button>
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: 2 } })}
        >
          <Icon id="empty-star" />
        </button>
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: 3 } })}
        >
          <Icon id="empty-star" />
        </button>
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: 4 } })}
        >
          <Icon id="empty-star" />
        </button>
        <button
          hx-swap="outerHTML"
          hx-target="#target"
          hx-get={useSection({ props: { rating: 5 } })}
        >
          <Icon id="empty-star" />
        </button>
      </div>
    </div>
  );
}
