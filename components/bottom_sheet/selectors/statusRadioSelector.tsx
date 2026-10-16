import StyledLabel from "../../styledLabel";
import SelectableButton, { RadioProps } from "../../selectableButton";
import { ReportStatus } from "@/definitions/moderation";

const StatusRadioSelector = ({ value, setValue }: RadioProps<ReportStatus>) => {
  return (
    <>
      <StyledLabel label="Filter By Current Status" className="my-2 text-2xl" />
      <SelectableButton
        isSelected={value === "pending"}
        handleSelectAction={() => setValue("pending")}
      >
        <StyledLabel label="Pending" />
      </SelectableButton>
      <SelectableButton
        isSelected={value === "resolved"}
        handleSelectAction={() => setValue("resolved")}
      >
        <StyledLabel label="Resolved" />
      </SelectableButton>
    </>
  );
};
export default StatusRadioSelector;
