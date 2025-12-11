import AsyncStorage from "@react-native-async-storage/async-storage"; // if using React Native
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
    let headers: any = {};

    // ✅ Include headers only if header: true
    const includeHeader = customData?.header || false;
    if (includeHeader) {
      const token = await AsyncStorage.getItem("token");
      headers = {
        "Content-Type": customData?.profileImage ? "multipart/form-data" : "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customData?.headers,
      };
    }

    // ✅ Handle image upload
    let body: any;
    if (customData?.profileImage) {
      const formData = new FormData();

      Object.keys(customData).forEach((key) => {
        if (key !== "profileImage" && key !== "header" && key !== "headers") {
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
    } else {
      // ✅ Normal JSON payload without `header` key
      body = {};
      Object.keys(customData).forEach((key) => {
        if (key !== "header" && key !== "headers" && key !== "profileImage") {
          body[key] = customData[key];
        }
      });
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

    return { success: false, error: error.response?.data || error.message };
  }
};

