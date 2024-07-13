import Ratings from "./Ratings.tsx";
import { Section } from "deco/mod.ts";

export type Props = {
  sections: Section[];
};

export default function ProductOpinions({ sections }: Props) {
  return (
    <div className="flex flex-col gap-4 px-[45px]">
      <h1 className="text-2xl	font-[400]">Opiniões do produto</h1>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-96">
          <Ratings />
        </div>
        <div className="flex flex-col w-96">
          {sections.map((sec) => <sec.Component {...sec.props} />)}
        </div>
      </div>
    </div>
  );
}
