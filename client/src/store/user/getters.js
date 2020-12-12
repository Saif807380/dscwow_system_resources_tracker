export default {
  getId(state) {
    return state.user._id;
  },
  getName(state) {
    return state.user.name;
  },
  getEmail(state) {
    return state.user.email;
  },
  getContact(state) {
    return state.user.contact;
  },
  getJWT(state) {
    return state.user.jwt;
  },
  getInstances(state) {
    return state.user.instances;
  },
  isAuthenticated(state) {
    return state.user.isAuthenticated;
  },
};
