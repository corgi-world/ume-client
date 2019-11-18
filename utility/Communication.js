import ServerURL from "./ServerURL";
import axios from "axios";

const callServer = async (
  url,
  parameter,
  log
) => {
  let result = null;

  try {
    result = await axios.post(
      ServerURL + url,
      parameter,
      { timeout: 2000 }
    );
  } catch (err) {
    console.log(log);
  }

  return result.data;
};

export default callServer;
