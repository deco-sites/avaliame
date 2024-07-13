import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";

export type Star = {
  rating: number;
};

export default function Star({ rating }: Star) {
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
    <div class="flex flex-row gap-[4px]">
      {stars.map((s) => <Icon id={s} />)}
    </div>
  );
}
