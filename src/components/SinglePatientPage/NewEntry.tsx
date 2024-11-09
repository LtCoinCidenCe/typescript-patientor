import { Alert, Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from "react";
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import { useParams } from "react-router-dom";
import entries from "../../services/entries";
import { AxiosError } from "axios";

type Props = { addEntryforPatient: (entry: Entry) => void, diagFacts: Diagnosis[] | undefined };

const NewEntry = ({ addEntryforPatient, diagFacts }: Props) => {
  const url = useParams();
  const [displayed, setDisplayed] = useState(false);
  const [version, setVersion] = useState("HealthCheck");

  const [errrrr, setError] = useState("");
  const [errorTimeout, setErrorTimeout] = useState(0);

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<string[]>([]);


  const [rating, setRating] = useState(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");


  const onFormSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("onFormSubmit");

    event.preventDefault();
    if (!url.id) {
      console.error("something wrong with url patient id");
      return;
    }

    // const diagnosisCodes = codes.split(/\s*,\s*/);
    const diagnosisCodes = codes;

    let newID;
    switch (version) {
      case "HealthCheck": {
        const newID2: Omit<HealthCheckEntry, "id"> = {
          description,
          date,
          specialist,
          healthCheckRating: rating,
          type: "HealthCheck",
          diagnosisCodes,
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
          diagnosisCodes,
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
          diagnosisCodes,
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

  const onCodesSelectChange = (event: SelectChangeEvent<string[]>) => {
    const vv = event.target.value;
    setCodes(typeof vv === "string" ? vv.split(",") : vv);
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
          <TextField margin="dense" variant="standard" label="Description" value={description} onChange={(event) => setDescription(event.currentTarget.value)} />
          <TextField margin="dense" variant="standard" type="date" label="Date" InputLabelProps={{ shrink: true }} value={date} onChange={(event) => setDate(event.currentTarget.value)} />
          <TextField margin="dense" variant="standard" label="Specialist" value={specialist} onChange={(event) => setSpecialist(event.currentTarget.value)} />

          <FormControl fullWidth>
            <InputLabel id="multiple-code-label" margin="dense" variant="standard">Diagnosis Codes</InputLabel>
            <Select multiple labelId="multiple-code-label" margin="dense" variant="standard" value={codes} onChange={onCodesSelectChange}>
              {diagFacts?.map(diag => <MenuItem key={diag.code} value={diag.code}>{diag.code}</MenuItem>)}
            </Select>
          </FormControl>

          <FormLabel sx={{ marginTop: "2em" }}>{version}</FormLabel>

          <FormControl sx={{ marginLeft: "1em" }}>
            {version === "HealthCheck" ? <>
              <InputLabel id="healthcheck-rating-label" margin="dense" variant="standard">Healthcheck Rating</InputLabel>
              <Select labelId="healthcheck-rating-label" margin="dense" variant="standard" value={rating} onChange={(event) => setRating(event.target.value as number)}>
                <MenuItem value={0}>Healthy</MenuItem>
                <MenuItem value={1}>Low Risk</MenuItem>
                <MenuItem value={2}>High Risk</MenuItem>
                <MenuItem value={3}>Critical Risk</MenuItem>
              </Select>
            </>
              : null}

            {version === "Hospital" ? <>
              <TextField margin="dense" variant="standard" type="date" label="Discharge Date" InputLabelProps={{ shrink: true }} value={dischargeDate} onChange={(event) => setDischargeDate(event.currentTarget.value)} />
              <TextField margin="dense" variant="standard" label="Discharge Criteria" value={dischargeCriteria} onChange={(event) => setDischargeCriteria(event.currentTarget.value)} />
            </>
              : null}

            {version === "Occupational Healthcare" ? <>
              <TextField margin="dense" variant="standard" label="Employer Name" value={employerName} onChange={(event) => setEmployerName(event.currentTarget.value)} />
              <TextField margin="dense" variant="standard" type="date" label="Sick Leave Start" InputLabelProps={{ shrink: true }} value={sickLeaveStart} onChange={(event) => setSickLeaveStart(event.currentTarget.value)} />
              <TextField margin="dense" variant="standard" type="date" label="Sick Leave End" InputLabelProps={{ shrink: true }} value={sickLeaveEnd} onChange={(event) => setSickLeaveEnd(event.currentTarget.value)} />
            </>
              : null}
          </FormControl>

          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" endIcon={<SendIcon />} onClick={onFormSubmit}>Add</Button>
            <Button variant="outlined" color="secondary" endIcon={<ArrowForwardIcon />} onClick={rotateVersion}>Switch</Button>
          </Box>
        </FormControl>
      </>
      : null}
  </Box>;
};

export default NewEntry;
