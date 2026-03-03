import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTitleDuplicate, createProject } from "../../services/projectService";

export default function AddProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [carType, setCarType] = useState("Sedan");
  const [uploadModel, setUploadModel] = useState(false);
  const [modelFile, setModelFile] = useState(null);
  const [defaultModel, setDefaultModel] = useState("model1.glb");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi title
    const duplicate = await isTitleDuplicate(title);
    if (duplicate) {
      setErrorMsg("Title sudah ada, silakan gunakan yang lain.");
      return;
    }

    // Build project object
    const project = {
      title,
      car_type: carType,
      upload_model: uploadModel,
      model_url: uploadModel
        ? URL.createObjectURL(modelFile)
        : defaultModel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert ke Supabase
    const result = await createProject(project);
    if (!result) {
      setErrorMsg("Terjadi error saat menyimpan project.");
      return;
    }

    // Redirect ke Customize page
    navigate(`/customize/${encodeURIComponent(title)}`);
  };

  return (
    <div>
      <h1>Add Project</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}
      >
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Car Type:
          <select value={carType} onChange={(e) => setCarType(e.target.value)}>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Coupe</option>
            <option>Hatchback</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={uploadModel}
            onChange={(e) => setUploadModel(e.target.checked)}
          />
          Upload model sendiri
        </label>

        {uploadModel && (
          <label>
            Upload file:
            <input
              type="file"
              accept=".glb,.gltf,.obj"
              onChange={(e) => setModelFile(e.target.files[0])}
            />
          </label>
        )}

        {!uploadModel && (
          <label>
            Pilih model yang tersedia:
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
            >
              <option value="model1.glb">Model 1</option>
              <option value="model2.glb">Model 2</option>
              <option value="model3.glb">Model 3</option>
            </select>
          </label>
        )}

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Start Customizing</button>
      </form>
    </div>
  );
}