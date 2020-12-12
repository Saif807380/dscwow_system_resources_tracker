import getters from "./getters";
import actions from "./actions.js";
import mutations from "./mutations.js";

export default {
  namespaced: true,
  state() {
    return {
      user: {
        _id: JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user"))._id
          : null,
        name: JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).name
          : "",
        email: JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).email
          : "",
        contact: JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).contact
          : "",
        isAuthenticated: localStorage.getItem("token") ? true : false,
        instances: [],
      },
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
};
