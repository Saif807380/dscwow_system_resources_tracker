import Api from "./api";

export default {
  register(user) {
    const response = Api().post("signup", { data: user });
    return response;
  },
  login(user) {
    const response = Api().post("signin", { data: user });
    return response;
  },
  createInstance(instance, userId) {
    const response = Api().post(`${userId}/instance`, { data: instance });
    return response;
  },
  getInstances(userId) {
    const response = Api().get(`${userId}/instance`);
    return response;
  },
  getInstance(instanceId, userId) {
    const response = Api().get(`${userId}/instance/${instanceId}`);
    return response;
  },
  editInstance(instanceId, instance, userId) {
    const response = Api().put(`${userId}/instance/${instanceId}`, {
      data: instance,
    });
    return response;
  },
  deleteInstance(instanceId, userId) {
    const response = Api().delete(`${userId}/instance/${instanceId}`);
    return response;
  },
};
