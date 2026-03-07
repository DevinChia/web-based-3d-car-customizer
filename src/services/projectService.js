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

export async function getProjectById(id) {
	const { data, error } = await supabase
		.from("projects")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Supabase fetch error:", error);
		return null;
	}

	return data;
}

export async function uploadModel(file) {
	const fileName = `${Date.now()}_${file.name}`;

	const { data, error } = await supabase.storage
		.from("models")
		.upload(fileName, file);

	if (error) {
		console.error("Upload error:", error);
		return null;
	}

	const { data: publicUrl } = supabase.storage
		.from("models")
		.getPublicUrl(fileName);
	
	console.log("Generated URL:", publicUrl.publicUrl);
	return publicUrl.publicUrl;
}

export async function getAllProjects(sortBy = "created_at", order = "desc", carType = null) {
	let query = supabase
		.from("projects")
		.select("*");

	if (carType && carType !== "All") {
		query = query.eq("car_type", carType);
	}

	query = query.order(sortBy, { ascending: order === "asc" });

	const { data, error } = await query;

	if (error) {
		console.error("Supabase fetch error:", error);
		return [];
	}

	return data;
}