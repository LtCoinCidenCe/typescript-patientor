import { Alert, Box, Button, FormControl, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from "react";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import { useParams } from "react-router-dom";
import entries from "../../services/entries";
import { AxiosError } from "axios";

type Props = { addEntryforPatient: (entry: Entry) => void };

const NewEntry = ({ addEntryforPatient }: Props) => {
  const url = useParams();
  const [displayed, setDisplayed] = useState(false);
  const [version, setVersion] = useState("HealthCheck");

  const [errrrr, setError] = useState("");
  const [errorTimeout, setErrorTimeout] = useState(0);

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState("");


  const [rating, setRating] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const filledReady = description.length > 0 && date.length > 0 && specialist.length > 0 && rating.length > 0 && codes.length > 0;
  const onFormSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("onFormSubmit");

    event.preventDefault();
    if (!url.id) {
      console.error("something wrong with url patient id");
      return;
    }

    let newID;
    switch (version) {
      case "HealthCheck": {
        const newID2: Omit<HealthCheckEntry, "id"> = {
          description,
          date,
          specialist,
          healthCheckRating: Number(rating),
          type: "HealthCheck",
          diagnosisCodes: codes.split(/\s*,\s*/),
          // addddd: "addddd",
        };
        newID = newID2;
        console.log(newID.diagnosisCodes);

        break;
      }
      case "Hospital": {
        const newID2: Omit<HospitalEntry, "id"> = {
          description,
          date,
          specialist,
          type: "Hospital",
          diagnosisCodes: codes.split(/\s*,\s*/),
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        newID = newID2;
        break;
      }
      case "Occupational Healthcare": {
        const newID2: Omit<OccupationalHealthcareEntry, "id"> = {
          description,
          date,
          specialist,
          type: "OccupationalHealthcare",
          diagnosisCodes: codes.split(/\s*,\s*/),
          employerName,
          sickLeave: sickLeaveStart.length > 0 && sickLeaveEnd.length > 0 ?
            {
              startDate: sickLeaveStart,
              endDate: sickLeaveEnd
            }
            : undefined
        };
        newID = newID2;
        break;
      }
      default:
        throw new Error("something went wrong with version");
        break;
    }
    try {
      const result = await entries.create(url.id, newID);
      addEntryforPatient(result);
      setDisplayed(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
        clearTimeout(errorTimeout);
        setErrorTimeout(setTimeout(() => setError(""), 5000));
      }
    }
  };

  const rotateVersion = () => {
    switch (version) {
      case "HealthCheck":
        setVersion("Hospital");
        break;
      case "Hospital":
        setVersion("Occupational Healthcare");
        break;
      case "Occupational Healthcare":
        setVersion("HealthCheck");
        break;
      default:
        throw new Error("something went wrong with version");
        break;
    }
  };

  return <Box sx={{ margin: "2em 0 2em 0", border: '1px dashed grey' }}>
    <Typography variant="h5">New {version} Entry</Typography>
    <div><Button variant="outlined" onClick={() => setDisplayed(!displayed)}>{displayed ? "collapse" : "expand"}</Button></div>
    {displayed ?
      <>
        {errrrr.length > 0 ? <Alert severity="error">{errrrr}</Alert> : null}
        <FormControl fullWidth>
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Description" value={description} onChange={(event) => setDescription(event.currentTarget.value)} />
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Date" value={date} onChange={(event) => setDate(event.currentTarget.value)} />
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Specialist" value={specialist} onChange={(event) => setSpecialist(event.currentTarget.value)} />
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Diagnosis Codes" value={codes} onChange={(event) => setCodes(event.currentTarget.value)} />

          {version === "HealthCheck" ?
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Healthcheck Rating" value={rating} onChange={(event) => setRating(event.currentTarget.value)} />
            : null}

          {version === "Hospital" ? <>
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Discharge Date" value={dischargeDate} onChange={(event) => setDischargeDate(event.currentTarget.value)} />
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Discharge Criteria" value={dischargeCriteria} onChange={(event) => setDischargeCriteria(event.currentTarget.value)} />
          </>
            : null}

          {version === "Occupational Healthcare" ? <>
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Employer Name" value={employerName} onChange={(event) => setEmployerName(event.currentTarget.value)} />
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Sick Leave Start" value={sickLeaveStart} onChange={(event) => setSickLeaveStart(event.currentTarget.value)} />
            <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Sick Leave End" value={sickLeaveEnd} onChange={(event) => setSickLeaveEnd(event.currentTarget.value)} />
          </>
            : null}


          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" endIcon={<SendIcon />} onClick={onFormSubmit} disabled={!filledReady}>Add</Button>
            <Button variant="outlined" color="secondary" endIcon={<ArrowForwardIcon />} onClick={rotateVersion}>Switch</Button>
          </Box>
        </FormControl>
      </>
      : null}
  </Box>;
};

export default NewEntry;
