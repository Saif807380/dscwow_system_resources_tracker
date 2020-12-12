import { createStore } from "vuex";
import userModule from "./user";
import instanceModule from "./instance";

export default createStore({
  modules: {
    user: userModule,
    instance: instanceModule,
  },
  state() {},
  mutations: {},
  actions: {},
});
