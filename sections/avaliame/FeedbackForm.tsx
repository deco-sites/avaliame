import { Section } from "deco/mod.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { ComponentProps, useComponent } from "../Component.tsx";
import { supabase } from "../../supabase/index.ts";
import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";
import { useScript } from "deco/hooks/useScript.ts";

export type Props = {
  sections: Section[];
  isSubmited?: boolean;
  error?: string;
};

export async function action(props: Props, request: Request, _: AppContext) {
  try {
    const user = await getIP({ ipv6: true });

    const regex = /\/feedback\/([^?]+)/;
    const match = request.url.match(regex);
    const productId = match?.[1];

    const result = await request.formData();

    result.forEach((value, key) => {
      console.log(`FormData key: ${key}, value: ${value}`);
    });

    const file = result.get("file");
    if (!(file instanceof File)) {
      console.log("File is not an instance of File");
      return {
        ...props,
        error: "Arquivo inválido. Por favor, envie um arquivo válido.",
      };
    }

    console.log("File details:", file);

    const feedbackInsert = await supabase.from("feedback").insert({
      rating: result.get("rating"),
      feedback_title: result.get("feedback_title"),
      feedback_description: result.get("feedback_description"),
      cost_benefit: result.get("cost_benefit"),
      quality: result.get("quality"),
      wash: result.get("wash"),
      user,
      product: productId,
      image: `https://fgdjvuulxptiwpucmbwj.supabase.co/storage/v1/object/public/images/${file.name}`
    });

    if (feedbackInsert.error) {
      console.log(feedbackInsert.error);
      return { ...props, error: feedbackInsert.error };
    }

    const imageUpload = await supabase.storage
      .from("images")
      .upload(file.name, file);

    console.log(imageUpload.data);

    if (imageUpload.error) {
      console.log(imageUpload.error);
      return { ...props, error: imageUpload.error };
    }

    return { ...props, isSubmited: true };
  } catch (error) {
    console.log("error ----->", error);
    return { ...props, error: "Ocorreu um erro inesperado" };
  }
}

export default function FeedbackForm(props: ComponentProps<typeof action>) {
  const goBack = () => {
    window.history.back();
  };

  if (props.error) {
    return (
      <div class="bg-white p-6 rounded-lg text-center">
        <h1 class="text-2xl font-bold mb-2">Erro ao enviar feedback</h1>
        <p class="text-gray-600">{props.error}</p>
        <button
          hx-on:click={useScript(goBack)}
          class="bg-blue-500 text-white rounded p-2 mt-4 hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (props?.isSubmited) {
    return (
      <div class="bg-white p-6 rounded-lg text-center">
        <div class="flex items-center justify-center mb-4">
          <svg
            class="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            >
            </path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Obrigado pelo seu feedback!</h1>
        <p class="text-gray-600">
          Nós apreciamos seu tempo e suas contribuições.
        </p>
        <a href="/" class="hover:text-blue-500 underline">
          Voltar para o inicio
        </a>
      </div>
    );
  }

  return (
    <form
      hx-post={useComponent(import.meta.url, { isSubmited: true })}
      enctype="multipart/form-data"
      hx-trigger="submit"
      id="form"
      class="w-full flex items-center flex-col gap-4"
    >
      {props?.sections.map((s) => <s.Component {...s.props} />)}
      <button
        hx-target="#form"
        hx-swap="outerHTML"
        type="submit"
        class="bg-blue-500 text-white rounded p-2 w-48 hover:bg-blue-700"
      >
        Enviar avaliação
      </button>
      <button
        hx-on:click={useScript(goBack)}
        class="hover:text-blue-500 underline"
      >
        Excluir feedback
      </button>
    </form>
  );
}
