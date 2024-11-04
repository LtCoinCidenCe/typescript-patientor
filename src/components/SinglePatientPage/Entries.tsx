import { Box, List, ListItem, ListItemIcon, Typography } from "@mui/material";
import LabelIcon from '@mui/icons-material/Label';
import { Entry } from "../../types";

const Entries = ({ entries }: { entries: Entry[] }) => {
  return <Box sx={{ margin: "2em 0 2em 0" }}>
    <Typography variant="h5" style={{ margin: "1em 0 1em 0" }}>Entries</Typography>
    {entries.map(en => <Box key={en.id} sx={{ margin: "1em 0 1em 0" }}>
      <Typography>{en.date} {en.description}</Typography>
      <List>{en.diagnosisCodes?.map(diagCode =>
        <ListItem key={diagCode}><ListItemIcon><LabelIcon /></ListItemIcon>{diagCode}</ListItem>)}
      </List>
    </Box>)}
  </Box>;
};

export default Entries;
