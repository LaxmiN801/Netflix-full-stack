// import axios from "axios";

// export const fetchFromTMDB = async (url) => {
//   const options = {
//     headers: {
//       accept: "application/json",
//       Authorization: "Bearer " + process.env.TMDB_API_KEY
//     }
//   };

//   const response = await axios.get(url, options);

//   if (response.status !== 200) {
//     throw new Error("Failed to fetch data from TMDB: " + response.statusText);
//   }

//   return response.data;
// };

// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");

import axios from "axios";

export const fetchFromTMDB = async (url) => {
  const response = await axios.get(url, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API_KEY
    }, timeout: 10000
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB: " + response.statusText);
  }

  return response.data;
};

