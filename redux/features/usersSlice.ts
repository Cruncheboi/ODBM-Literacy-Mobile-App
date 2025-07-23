import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UsersState {
  firstName: string;
  lastName?: string;
  email: string;
  certificatesCompleted: {
    learner: boolean;
    facilitator: boolean;
  };
  isSignedIn: boolean;
}

const initialState: UsersState = {
  firstName: "",
  email: "",
  certificatesCompleted: {
    learner: false,
    facilitator: false,
  },
  isSignedIn: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    updateLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateCertificateLearner: (state, action: PayloadAction<boolean>) => {
      state.certificatesCompleted.learner = action.payload;
    },
    updateCertificateFacilitator: (state, action: PayloadAction<boolean>) => {
      state.certificatesCompleted.facilitator = action.payload;
    },
    updateIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const {
  updateFirstName,
  updateLastName,
  updateEmail,
  updateCertificateLearner,
  updateCertificateFacilitator,
  updateIsSignedIn,
  resetUser,
} = usersSlice.actions;
export default usersSlice.reducer;
