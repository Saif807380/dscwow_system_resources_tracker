import getters from "./getters";
import actions from "./actions.js";
import mutations from "./mutations.js";

export default {
  namespaced: true,
  state() {
    return {
      instance: {
        name: "",
        provider: "",
        cluster: "",
        _id: null,
        publicIp: "",
      },
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
};
