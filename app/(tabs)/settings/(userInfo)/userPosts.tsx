import { useColorScheme } from "nativewind";
import { useAppDispatch } from "@/redux/hooks";

const UserPosts = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();
};
export default UserPosts;
