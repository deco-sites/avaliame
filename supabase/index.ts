import { createClient } from "https://esm.sh/v135/@supabase/supabase-js@2.7.0/dist/module/index.js";

export const supabase = createClient(
  "https://fgdjvuulxptiwpucmbwj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZGp2dXVseHB0aXdwdWNtYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA4MTg2OTYsImV4cCI6MjAzNjM5NDY5Nn0.Cb1P-4hFNTxwp7nt9V6wxLlX1RIUNIzByhuD11msJRY",
);
