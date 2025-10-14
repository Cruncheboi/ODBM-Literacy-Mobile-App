import { usersCollection } from "@/firebaseConfig";
import { getDocs, query, where } from "firebase/firestore";

export const checkIfDisplayNameIsAvailable = async (
  displayName: string
): Promise<boolean> => {
  const q = query(
    usersCollection,
    where("displayNameLowerCase", "==", displayName.toLowerCase())
  );
  console.log("before");
  try {
    const querySnapshot = await getDocs(q);
    console.log("after");
    console.log(querySnapshot.size);
    if (querySnapshot.empty) {
      return true;
    }
    console.log(querySnapshot.docs[0].data);
  } catch (error) {
    console.log(error);
  }

  return false;
};
