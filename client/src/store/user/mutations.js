export default {
  setUser(state, payload) {
    console.log(payload.user);
    state.user._id = payload.user._id;
    state.user.name = payload.user.name;
    state.user.email = payload.user.email;
    state.user.contact = payload.user.mobileNumber;
    state.user.jwt = payload.token;
    state.user.instances = payload.user.instances;
  },
  setInstances(state, payload) {
    state.user.instances = payload.instances;
  },
  setAuth(state, payload) {
    state.user.isAuthenticated = payload.isAuthenticated;
  },
};
