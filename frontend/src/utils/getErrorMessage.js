// Utility function to get the error message
export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const { message, code } = error.response.data;

    return {
      message: message || "An unexpected error occurred.",
      code: code || error.response.status, 
    };
  } else {
    // Handle network or unexpected errors
    return { message: "Network error. Please try again later.", code: null };
  }
};
