import { supabase } from "./supabaseClient";

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

export async function createProject(project) {
	const { data, error } = await supabase
		.from("projects")
		.insert([project])
		.select();

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

export async function updateProject(id, updates) {
	const { data, error } = await supabase
		.from("projects")
		.update(updates)
		.eq("id", id)
		.select();

	if (error) {
		console.error("Update error:", error);
		return null;
	}

	return data[0];
}

export async function deleteProject(id) {
	const { data: project, error: fetchError } = await supabase
		.from("projects")
		.select("model_url, upload_model")
		.eq("id", id)
		.single();

	if (fetchError) {
		console.error("Fetch error:", fetchError);
		return false;
	}

	if (project.upload_model && project.model_url) {
		try {
			const fileName = project.model_url.split("/").pop();

			const { error: deleteFileError } = await supabase.storage
				.from("models")
				.remove([fileName]);

			if (deleteFileError) {
				console.error("Delete file error:", deleteFileError);
				return false;
			}
		} catch (err) {
			console.error("Error parsing file:", err);
			return false;
		}
	}

	const { error: deleteError } = await supabase
		.from("projects")
		.delete()
		.eq("id", id);

	if (deleteError) {
		console.error("Delete project error:", deleteError);
		return false;
	}

	return true;
}