import { useEffect, useRef } from "react";
import { View, Text } from "react-native";

const useDidMountEffect = (func: () => void, deps: [any]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
export default useDidMountEffect;
