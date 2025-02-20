import ClickableStars from "./ClickableStars.tsx";

type Input = {
  input: "text" | "textArea" | "starRating" | "file";
  placeholder?: string;
  name?: string;
};

export type Props = {
  title?: string;
  description?: string;
  inputs: Input[];
};

export default function FeedbackInput({ inputs, description, title }: Props) {
  return (
    <div class="flex gap-4 flex-col items-center w-full m-auto max-w-[40rem]">
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-2xl">{title}</h2>
        <span class="text-sm text-gray-600">{description}</span>
      </div>

      {inputs.map((inp, index) => {
        if (inp.input == "text") {
          return (
            <input
              key={index}
              type="text"
              name={inp.name}
              placeholder={inp.placeholder}
              class="border p-2 rounded w-full"
            />
          );
        } else if (inp.input == "textArea") {
          return (
            <textarea
              key={index}
              name={inp.name}
              maxLength={1500}
              class="border w-full h-52 resize-none rounded p-2"
              placeholder={inp.placeholder}
            />
          );
        } else if (inp.input == "starRating") {
          return <ClickableStars key={index} />;
        } else if (inp.input == "file") {
          return (
            <input
              key={index}
              type="file"
              name={inp.name}
              class="border p-2 rounded w-full"
            />
          );
        }
      })}
    </div>
  );
}
