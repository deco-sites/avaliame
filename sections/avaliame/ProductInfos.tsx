import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  product: ProductDetailsPage | null;
}

export default function ProductInfos({ product }: Props) {
  console.log(product);

  const descriptionFirstPart = product?.seo?.description.split(",")[0];
  const descriptionSecondPart = product?.seo?.description.split(",")[1];

  const description = `${descriptionFirstPart}, ${descriptionSecondPart}`;

  const WIDTH = 200;
  const ASPECT_RATIO = `1/1`;

  const groupImages = product?.product.isVariantOf?.image ?? [];
  const filtered = groupImages.filter((img) => img.alternateName === name);
  const images = filtered.length > 0 ? filtered : groupImages;

  return (
    <div className="flex w-full items-center flex-col gap-4">
      <Image
        class="rounded-full"
        style={{ aspectRatio: ASPECT_RATIO }}
        src={images[0].url ?? ""}
        alt={images[0].alternateName}
        width={WIDTH}
      />
      <div class="w-full flex items-center flex-col">
        <p class="text-2xl font-bold">{product?.seo?.title}</p>
        <p class="text-gray-600 text-sm items-center">{description}</p>
      </div>
    </div>
  );
}
