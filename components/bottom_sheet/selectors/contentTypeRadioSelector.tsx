import StyledLabel from "../../styledLabel";
import SelectableButton, { RadioProps } from "../../selectableButton";
import { Filter } from "@/definitions/moderation";

const ContentTypeRadioSelector = ({ value, setValue }: RadioProps<Filter>) => {
  return (
    <>
      <StyledLabel label="Filter by Content Type" className="my-2 text-2xl" />
      <SelectableButton
        isSelected={value === "all"}
        handleSelectAction={() => setValue("all")}
      >
        <StyledLabel label="All" />
      </SelectableButton>
      <SelectableButton
        isSelected={value === "testimony"}
        handleSelectAction={() => setValue("testimony")}
      >
        <StyledLabel label="Testimony" />
      </SelectableButton>
      <SelectableButton
        isSelected={value === "event"}
        handleSelectAction={() => setValue("event")}
      >
        <StyledLabel label="Event" />
      </SelectableButton>
      <SelectableButton
        isSelected={value === "comment"}
        handleSelectAction={() => setValue("comment")}
      >
        <StyledLabel label="Comment" />
      </SelectableButton>
    </>
  );
};
export default ContentTypeRadioSelector;
