import { Section } from "deco/mod.ts";

export type Props = {
  title?: string;
  sections: Section[];
};

export default function Box({ sections, title }: Props) {
  return (
    <div class="mx-auto w-[44rem] flex flex-col mt-10 p-4 rounded bg-white">
      <h2 class="text-primary text-2xl mx-auto">{title}</h2>
      {sections.map((s) => <s.Component {...s.props} />)}
    </div>
  );
}
