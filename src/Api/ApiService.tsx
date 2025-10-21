import axios from "axios";

let baseUrl = "http://192.168.1.7:5000"; // ✅ works for real device in same Wi-Fi

export const Api = {
  login: `${baseUrl}/api/auth/login`,
  register: `${baseUrl}/api/auth/register`,
  profileUpdate: `${baseUrl}/api/auth/profile`,
};

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

const getMimeType = (uri: string) => {
  if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
  if (uri.endsWith(".png")) return "image/png";
  if (uri.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
};

export const ApiService = async (
  url: string,
  customData: any = {},
  method: ApiMethod = "POST"
) => {
  try {
    let body: any = customData;
    let headers: any = customData?.headers || {};

    // ✅ Handle image upload properly
    if (customData?.profileImage) {
      const formData = new FormData();

      Object.keys(customData).forEach((key) => {
        if (key !== "profileImage" && key !== "headers") {
          formData.append(key, customData[key]);
        }
      });

      const imageUri = customData.profileImage.startsWith("file://")
        ? customData.profileImage
        : "file://" + customData.profileImage;

      formData.append("profileImage", {
        uri: imageUri,
        type: getMimeType(imageUri),
        name: imageUri.split("/").pop() || "photo.jpg",
      } as any);

      body = formData;

      
    }

    const response = await axios({
      method,
      url,
      data: method !== "GET" ? body : undefined,
      params: method === "GET" ? body : undefined,
      headers,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.log("API Error:", error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
