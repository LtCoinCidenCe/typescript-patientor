import { ListItem, ListItemIcon } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import { Diagnosis } from "../../types";

const SingleDiagnosis = ({ diagCode, diagFacts }: { diagCode: string, diagFacts: Diagnosis[] | undefined }) => {
  return <ListItem><ListItemIcon><LabelIcon /></ListItemIcon>{diagCode} {diagFacts?.find(diag => diag.code === diagCode)?.name}</ListItem>;
};

export default SingleDiagnosis;
