import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UsersState {
  displayName: string;
  displayNameLowerCase: string;
  firstName: string;
  lastName?: string;
  email: string;
  certificatesCompleted: {
    learner: boolean;
    facilitator: boolean;
  };
  isSignedIn: boolean;
  blockedUserIds: string[];
}

const initialState: UsersState = {
  displayName: "",
  displayNameLowerCase: "",
  firstName: "",
  email: "",
  certificatesCompleted: {
    learner: false,
    facilitator: false,
  },
  isSignedIn: false,
  blockedUserIds: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    updateDisplayNameLowerCase: (state, action: PayloadAction<string>) => {
      state.displayNameLowerCase = action.payload;
    },
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
    updateBlockedUserIds: (state, action: PayloadAction<string[]>) => {
      state.blockedUserIds = action.payload;
    },
    addBlockedUserId: (state, action: PayloadAction<string>) => {
      if (!state.blockedUserIds.includes(action.payload)) {
        state.blockedUserIds.push(action.payload);
      }
    },
    removeBlockedUserId: (state, action: PayloadAction<string>) => {
      state.blockedUserIds = state.blockedUserIds.filter(
        (id) => id !== action.payload,
      );
    },
    resetUser: () => initialState,
  },
});

export const {
  updateDisplayName,
  updateDisplayNameLowerCase,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateCertificateLearner,
  updateCertificateFacilitator,
  updateIsSignedIn,
  updateBlockedUserIds,
  addBlockedUserId,
  removeBlockedUserId,
  resetUser,
} = usersSlice.actions;
export default usersSlice.reducer;
