import Star from "./Star.tsx";
import formatDateTime from '../../utils/formatDateTime.ts'

export type Props = {
  comment: {
    id: string;
    rating: number;
    feedback_title: string;
    feedback_description: string;
    user: string;
    created_at: string;
    product: string;
  };
};


export default function Comment({ comment }: Props) {
  return (
    <div className="flex flex-col w-96 gap-2">
      <div className="flex flex-row w-full justify-between	">
        <Star rating={comment.rating} />
        <span className="text-sm">{formatDateTime(comment.created_at)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg">{comment.feedback_title}</h3>
        <p>{comment.feedback_description}</p>
      </div>
    </div>
  );
}
