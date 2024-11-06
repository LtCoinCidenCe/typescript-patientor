import axios from "axios";
import { Entry, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const create = async (id: string, newEntry: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    newEntry
  );

  return data;
};

export default { create };
