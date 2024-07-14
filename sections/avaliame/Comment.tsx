import Image from "apps/website/components/Image.tsx";
import Star from "./Star.tsx";

export type Props = {
  comment: {
    id: string;
    rating: number;
    feedback_title: string;
    feedback_description: string;
    user: string;
    created_at: string;
    product: string;
    image: string;
  };
};

export default function Comment({ comment }: Props) {
  return (
    <div key={comment.id} className="mt-8 space-y-4">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span>
            <Star rating={comment.rating} />
          </span>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        {comment.image && (
          <div className="mb-3">
            <Image src={comment.image} width={100} className="rounded-md" />
          </div>
        )}
        <div className="text-gray-800">{comment.feedback_description}</div>
      </div>
    </div>
  );
}
