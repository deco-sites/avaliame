import Star from "./Star.tsx";
export default function Ratings() {
  const rating = 4.0;
  return (
    <div className="flex flex-row gap-2">
      <h1 className="text-5xl		 text-green-600	font-[700]">5.0</h1>
      <div className="flex flex-col">
        <Star rating={rating} />
        <span className=" text-sm font-[300]">32.392 avaliacoes</span>
      </div>
    </div>
  );
}
