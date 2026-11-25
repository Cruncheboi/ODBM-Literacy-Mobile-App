import { BottomSheetView } from "@gorhom/bottom-sheet";
import clsx from "clsx";

interface StyledBottomSheetViewProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

const StyledBottomSheetView = ({
  children,
  className,
}: StyledBottomSheetViewProps) => {
  return (
    <BottomSheetView
      className={clsx(
        "mb-safe flex items-center justify-center gap-4 bg-primary px-4 py-8",
        className,
      )}
    >
      {children}
    </BottomSheetView>
  );
};
export default StyledBottomSheetView;
