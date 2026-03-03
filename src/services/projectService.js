import { supabase } from "./supabaseClient";

// Cek apakah title sudah ada
export async function isTitleDuplicate(title) {
  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("title", title)
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);
    return true;
  }

  return data.length > 0;
}

// Tambah project baru
export async function createProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select(); // ambil data yang baru saja diinsert

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  return data[0];
}