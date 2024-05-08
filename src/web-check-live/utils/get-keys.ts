
const keys = {
  shodan: import.meta.env.REACT_APP_SHODAN_API_KEY || "default_value_if_not_set",
  whoApi: import.meta.env.REACT_APP_WHO_API_KEY || "default_value_if_not_set",
};
// const keys = process && process.env ? {
//   shodan: process.env.REACT_APP_SHODAN_API_KEY,
//   whoApi: process.env.REACT_APP_WHO_API_KEY,
// } : {
//   shodan: import.meta.env.REACT_APP_SHODAN_API_KEY || "default_value_if_not_set",
//   whoApi: import.meta.env.REACT_APP_WHO_API_KEY || "default_value_if_not_set",
// };

export default keys;
