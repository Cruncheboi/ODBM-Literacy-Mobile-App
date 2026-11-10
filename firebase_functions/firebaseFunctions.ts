import { auth } from "@/firebaseConfig";

/**
 * @description The maximum number of documents to be retreived from a query.
 */
export const QUERY_LIMIT = 15;

export const checkIfIsAdmin = async () => {
  try {
    const tokenResult = await auth.currentUser?.getIdTokenResult();
    if (tokenResult) {
      const isAdmin = tokenResult.claims.admin
        ? (tokenResult.claims.admin as boolean)
        : false;
      return isAdmin;
    }
  } catch (error) {
    console.error(error);
  }
  return false;
};
