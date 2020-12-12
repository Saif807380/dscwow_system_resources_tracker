export default {
  setInstance(state, payload) {
    state.instance.name = payload.instance.name;
    state.instance._id = payload.instance.id;
    state.instance.provider = payload.instance.provider;
    state.instance.cluster = payload.instance.cluster;
    state.instance.publicIp = payload.instance.publicIp;
    state.instance.userId = payload.instance.userId;
  },
};
