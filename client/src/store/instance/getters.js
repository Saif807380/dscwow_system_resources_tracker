export default {
  getInstanceName(state) {
    return state.instance.name;
  },
  getInstanceId(state) {
    return state.instance._id;
  },
  getProvider(state) {
    return state.instance.provider;
  },
  getCluster(state) {
    return state.instance.cluster;
  },
  getPublicIp(state) {
    return state.instance.publicIp;
  },
  getUserId(state) {
    return state.instance.userId;
  },
};
