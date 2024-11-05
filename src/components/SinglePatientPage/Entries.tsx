import { Box, Typography } from "@mui/material";
import { Diagnosis, Entry } from "../../types";
import { useEffect, useState } from "react";
import diagnoses from "../../services/diagnoses";
import EntryDetail from "./EntryDetail";

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

    {entries.map(en => <EntryDetail key={en.id} entry={en} diagFacts={diagFacts} />)}

  </Box>;
};

export default Entries;
