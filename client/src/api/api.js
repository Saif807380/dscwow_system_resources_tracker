import axios from "axios";

export default () => {
  return axios.create({
    baseURL: `http://localhost:3000/api/user`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });
};
