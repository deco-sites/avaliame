import { supabase } from "../supabase/index.ts";

export default async function getRatings(product: string) {
  const data = await supabase
    .from("feedback")
    .select("*")
    .eq("product", product);

  return data;
}
