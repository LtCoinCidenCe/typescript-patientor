import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../../types";
import patients from "../../services/patients";
import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import Entries from "./Entries";
import NewEntry from "./NewEntry";
import diagnoses from "../../services/diagnoses";

const SinglePatientPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string>("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagFacts, setDiagFacts] = useState<Diagnosis[]>();

  useEffect(() => {
    (async () => {
      const diags = await diagnoses.getAll();
      setDiagFacts(diags);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!id) {
        return;
      }
      try {
        const returnedPatient: Patient = await patients.getPatientbyId(id);
        setPatient(returnedPatient);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    })();
  }, [id]);

  const addEntryforPatient = (entry: Entry) => {
    if (patient) {
      setPatient({
        ...patient,
        entries: patient.entries.concat(entry)
      });
    }
  };

  if (!id) {
    return <Alert severity="error">invalid url id</Alert>;
  }

  if (error.length > 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <Alert severity="error">unknown error, report to the developers</Alert>;
  }

  return <Box>
    <Typography variant="h4" style={{ margin: "0.5em 0em 0.5em 0em" }}>
      {patient.name} {((gender: string) => {
        switch (gender) {
          case 'male':
            return <MaleIcon />;
            break;
          case 'female':
            return <FemaleIcon />;
          default:
            return <TransgenderIcon />;
            break;
        }
      })(patient.gender)}
    </Typography>
    <Typography>
      ssn: {patient.ssn}
    </Typography>
    <Typography>
      occupation: {patient.occupation}
    </Typography>
    <NewEntry addEntryforPatient={addEntryforPatient} diagFacts={diagFacts}></NewEntry>
    <Entries entries={patient.entries} diagFacts={diagFacts} />
  </Box>;
};

export default SinglePatientPage;
