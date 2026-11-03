import {
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const CustomBottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    opacity={0.5}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);
export default CustomBottomSheetBackdrop;
