import { Alert, Box, Button, FormControl, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from "react";
import { Entry, HealthCheckEntry } from "../../types";
import { useParams } from "react-router-dom";
import entries from "../../services/entries";
import { AxiosError } from "axios";

type Props = { addEntryforPatient: (entry: Entry) => void };

const NewEntry = ({ addEntryforPatient }: Props) => {
  const url = useParams();
  const [displayed, setDisplayed] = useState(false);
  const [version, setVersion] = useState("Health Check");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [rating, setRating] = useState("");
  const [codes, setCodes] = useState("");
  const [errrrr, setError] = useState("");

  const filledReady = description.length > 0 && date.length > 0 && specialist.length > 0 && rating.length > 0 && codes.length > 0;
  const onFormSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("onFormSubmit");

    event.preventDefault();
    if (!url.id) {
      console.error("something wrong with url patient id");
      return;
    }
    const newID: Omit<HealthCheckEntry, "id"> = {
      description,
      date,
      specialist,
      healthCheckRating: Number(rating),
      type: "HealthCheck",
      diagnosisCodes: codes.split(/\s*,\s*/),
      // addddd: "addddd",
    };
    console.log(newID.diagnosisCodes);

    try {
      const result = await entries.create(url.id, newID);
      addEntryforPatient(result);
      setDisplayed(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError)
        setError(error.message);
    }
  };

  const rotateVersion = () => {
    switch (version) {
      case "Health Check":
        setVersion("Hospital");
        break;
      case "Hospital":
        setVersion("Occupational Healthcare");
        break;
      case "Occupational Healthcare":
        setVersion("Health Check");
        break;
      default:
        throw new Error("something Went wrong");
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
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Healthcheck Rating" value={rating} onChange={(event) => setRating(event.currentTarget.value)} />
          <TextField sx={{ margin: "0.5em 0 0.5em 0" }} variant="standard" label="Diagnosis Codes" value={codes} onChange={(event) => setCodes(event.currentTarget.value)} />
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
