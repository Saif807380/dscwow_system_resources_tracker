import axios from "axios";

export default () => {
  return axios.create({
    baseURL: `https://www.nerdsofafeather.ml/server/api/user`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });
};
