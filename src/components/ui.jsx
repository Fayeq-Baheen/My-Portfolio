export const inputClass = "mt-1 w-full rounded border border-slate-300 p-2";
export const btnPrimary = "rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60";
export const btnSecondary = "rounded border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-50";

export function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Reads an image file and shrinks it to a JPEG Blob before uploading
export function resizeImage(file, maxWidth = 1400) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("This image could not be opened."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Could not process the image."))),
          "image/jpeg",
          0.82
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
