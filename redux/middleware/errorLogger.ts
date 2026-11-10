import { toast } from "@ncrft/native-toast";
import { isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";

export const rtkQueryNotificationMiddleware: Middleware =
  (api) => (next) => (action) => {
    // display toasts for successful mutations
    if (isFulfilled(action)) {
      // ONLY show toasts for mutations (POST, PUT, DELETE), ignore queries (GET)
      if (action.type.includes("/executeMutation/fulfilled")) {
        const payload = action.payload;

        if (
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof payload.message === "string"
        ) {
          toast.success(`Success: ${payload.message}`);
        }
      }
    }

    // display toasts for network request that have an error
    if (isRejectedWithValue(action)) {
      const payload = action.payload;

      let status: string | number = "Error";
      let errorMessage = "Something went wrong";

      if (payload && typeof payload === "object") {
        if ("status" in payload) {
          status = (payload as { status: string | number }).status;
        }

        // A 'data' field containing the res from the API
        if (
          "data" in payload &&
          payload.data &&
          typeof payload.data === "object"
        ) {
          const backendData = payload.data as Record<string, unknown>;

          // An 'error' field from the API response
          if ("error" in backendData && typeof backendData.error === "string") {
            errorMessage = backendData.error;
          }

          // Fallback to root network error property (e.g., FETCH_ERROR string)
        } else if ("error" in payload && typeof payload.error === "string") {
          errorMessage = payload.error;
        }
      }
      toast.error(`Action unsuccessful. (Error status: ${status})`);
      console.warn(
        `Action unsuccessful. (Error status: ${status})`,
        errorMessage,
      );
    }
    return next(action);
  };
