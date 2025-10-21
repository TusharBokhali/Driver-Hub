type ResponseType = "success" | "error";

type ResponseObject = {
  type: ResponseType;
  message: string;
};

export const handleApiResponse = (error: any): ResponseObject => {
  const status = error?.response?.status || error?.status;

  if (status === 500) {
    return {
      type: "error",
      message: "Something went wrong on server. Please try again later.",
    };
  }


  if (status === 404) {
    return {
      type: "error",
      message: "The requested resource was not found.",
    };
  }


  if (status === 401) {
    return {
      type: "error",
      message: "Unauthorized access. Please login again.",
    };
  }


  if (error?.message?.includes("Network")) {
    return {
      type: "error",
      message: "No internet connection or very slow network.",
    };
  }

  if (error?.success) {
    return {
      type: "success",
      message: error?.message || "Operation completed successfully!",
    };
  }

  return {
    type: "error",
    message: error?.message || "Unexpected error occurred!",
  };
};
