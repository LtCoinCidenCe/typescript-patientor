import { Box, List, Typography } from "@mui/material";
import { Diagnosis, Entry } from "../../types";
import { useEffect, useState } from "react";
import diagnoses from "../../services/diagnoses";
import SingleDiagnosis from "./SingleDiagnosis";

const Entries = ({ entries }: { entries: Entry[] }) => {
  const [diagFacts, setDiagFacts] = useState<Diagnosis[]>();
  useEffect(() => {
    (async () => {
      const diags = await diagnoses.getAll();
      setDiagFacts(diags);
    })();
  }, []);

  return <Box sx={{ margin: "2em 0 2em 0" }}>
    <Typography variant="h5" style={{ margin: "1em 0 1em 0" }}>Entries</Typography>
    {entries.map(en => <Box key={en.id} sx={{ margin: "1em 0 1em 0" }}>
      <Typography>{en.date} {en.description}</Typography>
      <List>{en.diagnosisCodes?.map(diagCode =>
        <SingleDiagnosis key={diagCode} diagCode={diagCode} diagFacts={diagFacts} />)}
      </List>
    </Box>)}
  </Box>;
};

export default Entries;
