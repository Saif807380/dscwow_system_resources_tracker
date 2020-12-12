<template>
  <div class="p-mt-5">
    
    <Dialog v-model:visible="isModalVisible">
      <template #header>
        <h3>Create a new instance</h3>
      </template>

      <ul>
        <label for="name">Instance Name:</label
        ><br />
        <input v-model="name" placeholder="Instance Name" /><br />
        <label for="provider">Provider:</label
        ><br />
        <Dropdown v-model="provider" :options="providerOptions" placeholder="Select a Provider" />
        <label for="cluster">Cluster:</label
        ><br />
        <input v-model="cluster" placeholder="Cluster" /><br />
        <label for="publicIp">Public IP:</label
        ><br />
        <input v-model="publicIp" placeholder="Public IP" /><br />
        <label for="cpu">CPU:</label
        ><br />
        <input v-model="cpu" placeholder="Usage %" /><br />
        <label for="memory">Memory:</label
        ><br />
        <input v-model="memory" placeholder="Usage %" /><br />
        <label for="storage">Storage:</label
        ><br />
        <input v-model="storage" placeholder="Usage %" /><br />
      </ul>

      <template #footer>
        <Button
          label="Edit Instance"
          icon="pi pi-pencil"
          @click="editInstance"
          autofocus
          v-if="isEdit"
        />
        <Button
          label="Create Instance"
          icon="pi pi-check"
          @click="createInstance"
          autofocus
          v-else
        />
      </template>
    </Dialog>
    <DataView :value="instances" :layout="layout" :paginator="true" :rows="9">
      <template #header>
        <div class="p-grid p-nogutter">
          
          <div class="p-col-6" style="text-align: left">
            <DataViewLayoutOptions v-model="layout" />
          </div>
          <div class="p-col-6" style="text-align: right">
            <Button label="Add Instance" @click="showModal(false, null)" icon="pi pi-pencil" iconPos="left"></Button>
          </div>
          
        </div>
      </template>

      <template #list="slotProps">
        <div class="p-col-9 p-mx-auto p-mt-3">
          <div class="p-shadow-2 p-mb-3 p-p-3 p-grid">
            <div class="p-col-3" style="overflow: hidden">
              <img
                @click="viewDashboard(slotProps.data._id)"
                :src="getImgUrl(slotProps.data.provider)"
                :alt="slotProps.data.provider"
                style="object-fit: cover"
              />
            </div>

            <div class="p-col-4 p-ml-1" style="text-align: left">
              <div class="p-my-1">Name: {{ slotProps.data.name }}</div>
              <div class="p-my-1">Provider: {{ slotProps.data.provider }}</div>
              <div class="p-my-1">Cluster: {{ slotProps.data.cluster }}</div>
              <div class="p-my-1">Public IP: {{ slotProps.data.publicIp }}</div>
            </div>
            <div class="p-col-4" style="text-align: center;">
              <Button
                class="p-mr-2 p-button-warning"
                label="Edit"
                icon="pi pi-pencil"
                iconPos="left"
                @click="showModal(true, slotProps.data)"
              ></Button>
              <Button
                label="Delete"
                class="p-button-danger"
                icon="pi pi-trash"
                iconPos="left"
                @click="deleteInstance(slotProps.data._id)"
              ></Button>
              <Button
                class="p-ml-2"
                label="Terminal"
                icon="pi pi-dollar"
                iconPos="left"
                @click="$router.push('/terminal/' + slotProps.data._id)"
              ></Button>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="p-col-12 p-md-4 p-mt-3">
          <div class="p-shadow-2 p-m-2 card p-py-3">
            <div>
              <img
                @click="viewDashboard(slotProps.data._id)"
                :src="getImgUrl(slotProps.data.provider)"
                :alt="slotProps.data.provider"
                style="height: 150px"
              />
              <div class="p-my-2">Name: {{ slotProps.data.name }}</div>
              <div class="p-mb-2">Provider: {{ slotProps.data.provider }}</div>
              <div class="p-mb-2">Cluster: {{ slotProps.data.cluster }}</div>
              <div class="p-mb-2">Public IP: {{ slotProps.data.publicIp }}</div>
            </div>
            <div class="p-mt-4">
              <Button
                class="p-mr-2 p-button-warning"
                label="Edit"
                icon="pi pi-pencil"
                iconPos="left"
                @click="showModal(true, slotProps.data)"
              ></Button>
              <Button
                label="Delete"
                class="p-button-danger"
                icon="pi pi-trash"
                iconPos="left"
                @click="deleteInstance(slotProps.data._id)"
              ></Button>
              <Button
                class="p-ml-2"
                label="Terminal"
                icon="pi pi-dollar"
                iconPos="left"
                @click="$router.push('/terminal/' + slotProps.data._id)"
              ></Button>
            </div>
          </div>
        </div>
      </template>
      <template #empty>No instances found.</template>
    </DataView>
  </div>
</template>

<script>
import Api from "../api";
export default {
  data() {
    return {
      instances: null,
      layout: "grid",
      isModalVisible: false,
      name: "",
      provider: "",
      cluster: "",
      publicIp: "",
      isEdit: false,
      instanceId: "",
      cpu:50,
      memory:50,
      storage:50,
      providerOptions: [
        'google',
        'aws',
        'oracle',
        'local'
      ]
    };
  },
  methods: {
    getImgUrl(provider) {
      var images = require.context("../assets/", false, /\.png$/);
      return images("./" + provider + ".png");
    },
    showModal(value, instance) {
      if (instance) {
        this.name = instance.name;
        this.provider = instance.provider;
        this.cluster = instance.cluster;
        this.publicIp = instance.publicIp;
        this.instanceId = instance._id;
        this.isEdit = value;
      }
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.isEdit = false;
    },
    viewDashboard(value) {
      console.log(value);
      let instance = this.instances.find((instance) => {
        return instance._id == value;
      });
      this.$store.commit("instance/setInstance", { instance: instance });
      localStorage.setItem("instance", JSON.stringify(instance));
      this.$router.push("/dashboard/" + value);
    },
    async createInstance() {
      const { name, provider, cluster, publicIp } = this;
      const response = await Api.createInstance(
        { name, provider, cluster, publicIp },
        this.$store.getters["user/getId"]
      );
      const { instances } = response.data;
      console.log(response.data);
      this.$store.commit("user/setInstances", { instances });
      this.instances = this.$store.getters["user/getInstances"];
      (this.name = ""),
      (this.provider = ""),
      (this.cluster = ""),
      (this.publicIp = ""),
      (this.isModalVisible = false);
    },
    async editInstance() {
      const { name, provider, cluster, publicIp } = this;
      console.log({ name, provider, cluster, publicIp });
      await Api.editInstance(
        this.instanceId,
        { name, provider, cluster, publicIp },
        this.$store.getters["user/getId"]
      );
      const res = await Api.getInstances(this.$store.getters["user/getId"]);
      this.instances = res.data.instances;
      console.log(this.instances);
      this.$store.commit("user/setInstances", { instances: this.instances });
      this.isModalVisible = false;
      this.isEdit = false;
    },
    async deleteInstance(instanceId) {
      await Api.deleteInstance(instanceId, this.$store.getters["user/getId"]);
      this.instances.splice(
        this.instances.findIndex(
          (instance) => instance._id === instanceId
        ),
        1
      );
      this.$store.commit("user/setInstances", { instances: this.instances });
    },
  },
  created() {
    this.instances = this.$store.getters["user/getInstances"];
  },
  async mounted() {
    const response = await Api.getInstances(this.$store.getters["user/getId"]);
    this.$store.commit("user/setInstances", response.data);
    this.instances = this.$store.getters["user/getInstances"];
  },
};
</script>

<style scoped></style>
