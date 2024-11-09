import { Box, Typography } from "@mui/material";
import { Diagnosis, Entry } from "../../types";
import EntryDetail from "./EntryDetail";

const Entries = ({ entries, diagFacts }: { entries: Entry[], diagFacts: Diagnosis[] | undefined }) => {


  return <Box sx={{ margin: "2em 0 2em 0" }}>
    <Typography variant="h5" style={{ margin: "1em 0 1em 0" }}>Entries</Typography>

    {entries.map(en => <EntryDetail key={en.id} entry={en} diagFacts={diagFacts} />)}

  </Box>;
};

export default Entries;
