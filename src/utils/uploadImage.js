import { toast } from "react-toastify";

// Logic upload img into cloudinary to get the URL return
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "milk_shop_cloudinary"); //Upload into server without API Key
  formData.append("cloud_name", "tuanbin");
  formData.append("folder", "milk_shop");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/tuanbin/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || "Upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

export const handleImageUpload = async (event, setImageCallback) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imgUrl = await uploadToCloudinary(file);
    toast.success("Ảnh đã được lưu trên Cloudinary");
    setImageCallback(imgUrl);
  } catch (error) {
    console.error("Upload thất bại:", error);
    toast.error("Tải ảnh lên thất bại");
  }
};
