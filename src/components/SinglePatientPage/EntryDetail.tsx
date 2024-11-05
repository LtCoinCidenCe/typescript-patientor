import { Box, List, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import WorkIcon from '@mui/icons-material/Work';
import { Diagnosis, Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import SingleDiagnosis from "./SingleDiagnosis";

const EntryDetail = ({ entry, diagFacts }: { entry: Entry, diagFacts: Diagnosis[] | undefined }) => {
  let outlet: JSX.Element | null = null;
  let icon: JSX.Element | null = null;
  switch (entry.type) {
    case "HealthCheck":
      outlet = <HealthCheckEntryDetail entry={entry} />;
      icon = <HealthAndSafetyIcon />;
      break;
    case "Hospital":
      outlet = <HospitalEntryDetail entry={entry} />;
      icon = <NightShelterIcon />;
      break;
    case "OccupationalHealthcare":
      outlet = <OccupationalHealthcareEntryDetail entry={entry} />;
      icon = <WorkIcon />;
      break;
    default:
      assertNever(entry);
      break;
  }
  return <Box key={entry.id} sx={{ margin: "1em 0 1em 0", padding: "1em 0 1em 0", bgcolor: "#e8f8f5" }}>
    <Typography>{entry.date} {icon}</Typography>
    <Typography fontStyle="italic">{entry.description}</Typography>
    {outlet}
    <List>{entry.diagnosisCodes?.map(diagCode =>
      <SingleDiagnosis key={diagCode} diagCode={diagCode} diagFacts={diagFacts} />)}
    </List>
    <Typography>Diagnosed by {entry.specialist}</Typography>
  </Box>;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HealthCheckEntryDetail = ({ entry }: { entry: HealthCheckEntry }) => {
  let result: JSX.Element | null = null;
  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      result = <><Typography><FavoriteIcon sx={{ color: "red" }} />Healthy</Typography></>;
      break;
    case HealthCheckRating.LowRisk:
      result = <><Typography><FavoriteIcon sx={{ color: "darkred" }} />Low risk</Typography></>;
      break;
    case HealthCheckRating.HighRisk:
      result = <><Typography><FavoriteIcon sx={{ color: "darkviolet" }} />High risk</Typography></>;
      break;
    case HealthCheckRating.CriticalRisk:
      result = <><Typography><FavoriteIcon sx={{ color: "black" }} />Critical risk</Typography></>;
      break;
    default:
      assertNever(entry.healthCheckRating);
      break;
  }
  return result;
};

const HospitalEntryDetail = ({ entry }: { entry: HospitalEntry }) => {
  return <Typography>Discharge: {entry.discharge.date} if {entry.discharge.criteria}</Typography>;
};

const OccupationalHealthcareEntryDetail = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  return <>
    <Typography>Employer: {entry.employerName}</Typography>
    {entry.sickLeave ? <Typography>Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</Typography> : null}
  </>;
};

export default EntryDetail;
