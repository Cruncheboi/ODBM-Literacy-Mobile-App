import StyledLabel from "../../styledLabel";
import SelectableButton, { RadioProps } from "../../selectableButton";
import { SortType } from "@/definitions/moderation";

const ReportSortByRadioSelector = ({
  value,
  setValue,
}: RadioProps<SortType>) => {
  return (
    <>
      <StyledLabel label="Sort By" className="my-2 text-2xl" />
      <SelectableButton
        isSelected={value === "count"}
        handleSelectAction={() => setValue("count")}
      >
        <StyledLabel label="Greatest Count" />
      </SelectableButton>
      <SelectableButton
        isSelected={value === "recency"}
        handleSelectAction={() => setValue("recency")}
      >
        <StyledLabel label="Most Recently Reported" />
      </SelectableButton>
    </>
  );
};
export default ReportSortByRadioSelector;
