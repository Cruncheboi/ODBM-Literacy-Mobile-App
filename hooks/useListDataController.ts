import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useRef, useState } from "react";

interface ListDataControllerProps<T> {
  /**
   * Tells the when when the data is in use. This determines whether some functions are run.
   */
  dataInUse: boolean;
  /**
   * Retrieves the next batch of data to be appended to the list.
   * @param lastVisibleDoc
   * @returns
   */
  getData: (
    lastVisibleDoc?: QueryDocumentSnapshot,
  ) => Promise<[T[], QueryDocumentSnapshot?]>;
  updateLocalStorage?: (data: T[]) => void;
  resetLocalStorage?: () => void;
}

interface ReturnListDataController<T> {
  data: T[];
  /**
   * Whether the list is loading data.
   */
  isLoading: boolean;
  /**
   * Resets the list's data controller, as well as runs func 'resetLocalStorage' if
   * provided to the hook, and loads the new initial data.
   */
  onListRefreshed: () => Promise<void>;
  /**
   * Loads more of the specified data when the end of the current list is reached.
   */
  onEndReached: () => Promise<void>;
}

/**
 * A hook to control data flow in an infinitely scrolled list.
 */
const useListDataController = <T>({
  dataInUse,
  getData,
  updateLocalStorage,
  resetLocalStorage,
}: ListDataControllerProps<T>): ReturnListDataController<T> => {
  // Data state
  const [data, setData] = useState<T[]>([]);
  const lastDocReachedRef = useRef(false);
  const lastVisibleDocRef = useRef<QueryDocumentSnapshot | undefined>(
    undefined,
  );

  // List state
  const [isLoading, setIsLoading] = useState(false);

  // Loads more of the specified data when the end of the current list is reached.
  const onEndReached = async () => {
    console.log("end reached.");
    // Don't run function when there is no data or the last document was reached.
    if (
      !dataInUse ||
      lastDocReachedRef.current ||
      lastVisibleDocRef.current == undefined
    ) {
      console.log("Last doc Reached.");
      return;
    }

    console.log("Trying to load more...");
    setIsLoading(true);
    await loadData(lastVisibleDocRef.current);
    setIsLoading(false);
  };

  // Retrieves initial posts
  const onListRefreshed = async () => {
    if (
      dataInUse ||
      (!lastDocReachedRef.current && lastVisibleDocRef.current == undefined)
    ) {
      setIsLoading(true);
      resetList();
      await loadData();
      setIsLoading(false);
    }
  };

  // Retrieves QUERY_LIMIT more data and updates the state. If lastVisibleDoc is
  // provided, then loads QUERY_LIMIT more from the last retrieved query document.
  const loadData = async (lastVisibleDoc?: QueryDocumentSnapshot) => {
    const [newData, lastDoc] = await getData(lastVisibleDoc);
    if (updateLocalStorage) {
      updateLocalStorage(newData);
    }
    if (newData.length < QUERY_LIMIT) {
      lastDocReachedRef.current = true;
    }
    lastVisibleDocRef.current = lastDoc;
    if (lastVisibleDoc != undefined) {
      setData((prev) => (prev ? [...prev, ...newData] : newData));
    } else {
      setData(newData);
    }
  };

  // Resets all info about the list to its initial state
  const resetList = () => {
    if (resetLocalStorage) {
      resetLocalStorage();
    }
    lastVisibleDocRef.current = undefined;
    lastDocReachedRef.current = false;
    setData([]);
  };

  return {
    data,
    isLoading,
    onListRefreshed,
    onEndReached,
  };
};

export default useListDataController;
