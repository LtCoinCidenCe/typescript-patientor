import { ListItem, ListItemIcon, Typography } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import { Diagnosis } from "../../types";

const SingleDiagnosis = ({ diagCode, diagFacts }: { diagCode: string, diagFacts: Diagnosis[] | undefined }) => {
  return <ListItem><ListItemIcon><LabelIcon /></ListItemIcon><Typography>{diagCode} {diagFacts?.find(diag => diag.code === diagCode)?.name}</Typography></ListItem>;
};

export default SingleDiagnosis;
