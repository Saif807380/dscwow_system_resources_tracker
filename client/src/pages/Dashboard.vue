<template>
  <div>
    <div v-if="status === 'online'">
      <!-- dashboard -->
      <!-- {{ status }} -->
      <div class="p-mx-3">
        <TabMenu class="center p-mt-3" :model="items" />
      </div>

      <div
        v-show="selectedMetric === 'CPU'"
        class="p-mt-3 p-shadow-2 p-mx-auto p-p-3"
        style="width: 80%"
      >
        <Chart type="line" :options="graphOptions" :data="cpuData" ref="cpu" />
        <h1 class="p-mt-5">Data for the last 24 hours</h1>
        <Chart
          type="line"
          :options="graphOptions"
          :data="cpuDayData"
          ref="cpuDay"
        />
      </div>
      <div
        v-show="selectedMetric === 'RAM'"
        class="p-mt-3 p-shadow-2 p-mx-auto p-p-3"
        style="width: 80%"
      >
        <Chart type="pie" :data="ramData" ref="ram" />
      </div>
      <div
        v-show="selectedMetric === 'Storage'"
        class="p-mt-3 p-shadow-2 p-mx-auto p-p-3"
        style="width: 80%"
      >
        <Chart type="pie" :data="storageData" ref="storage" />
      </div>
      <div
        v-show="selectedMetric === 'Processes'"
        class="p-mt-3 p-shadow-2 p-mx-auto p-p-3"
        style="width: 80%"
      >
        <DataTable :value="processes">
          <Column field="pid" header="PID"></Column>
          <Column field="cpu" header="CPU Usage (%)"></Column>
          <Column field="memory" header="Memory Usage (%)"></Column>
          <Column field="name" header="Process Name"></Column>
        </DataTable>
      </div>
      <div
        v-show="selectedMetric === 'System Info'"
        class="p-mt-3 p-shadow-2 p-mx-auto p-p-3"
        style="width: 80%"
      >
        <Card class="p-m-4">
          <template #title> Operating System </template>
          <template #content>
            <p>{{ systemInfo.os }}</p>
          </template>
        </Card>
        <Card class="p-m-4">
          <template #title> Hostname </template>
          <template #content>
            <p>{{ systemInfo.hostname }}</p>
          </template>
        </Card>
        <Card class="p-m-4">
          <template #title> Uptime (hours) </template>
          <template #content>
            <p>{{ systemInfo.uptime }}</p>
          </template>
        </Card>
        <Card class="p-m-4">
          <template #title> Architecture </template>
          <template #content>
            <p>{{ systemInfo.arch }}</p>
          </template>
        </Card>
      </div>
    </div>

    <div v-else>
      <h1>Instance is offline</h1>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Dashboard",
  props: ["id"],
  data() {
    return {
      metrics: null,
      socket: null,
      instance: null,
      status: "",
      processes: [],
      cpuData: {
        labels: [],
        datasets: [
          {
            label: "CPU Usage",
            data: [],
            fill: false,
            borderColor: "#42A5F5",
          },
        ],
      },
      cpuDayData: {
        labels: [],
        datasets: [
          {
            label: "CPU Usage",
            data: [],
            fill: false,
            borderColor: "#66BB6A",
          },
        ],
      },
      graphOptions: {
        animation: {
          duration: 7500,
          easing: "linear",
        },
      },
      // line ram data
      // ramData: {
      // 	labels: [],
      // 	datasets: [
      // 		{
      // 			label: 'Used Memory',
      // 			data: [],
      // 			fill: false,
      // 			borderColor: '#42A5F5'
      // 		},
      // 		{
      // 			label: 'Free Memory',
      // 			data: [],
      // 			fill: false,
      // 			borderColor: '#00bb7e',
      //     },
      // 	]
      // },
      // pie ram data
      ramData: {
        labels: ["Used Memory", "Free Memory"],
        datasets: [
          {
            data: [],
            backgroundColor: ["#42A5F5", "#66BB6A"],
            hoverBackgroundColor: ["#64B5F6", "#81C784"],
          },
        ],
      },
      storageData: {
        labels: ["Used", "Free"],
        datasets: [
          {
            data: [],
            backgroundColor: ["#42A5F5", "#66BB6A"],
            hoverBackgroundColor: ["#64B5F6", "#81C784"],
          },
        ],
      },
      systemInfo: "",
      items: [
        { label: "CPU", command: () => this.clickHandler("CPU"), class: null },
        { label: "RAM", command: () => this.clickHandler("RAM"), class: null },
        {
          label: "Storage",
          command: () => this.clickHandler("Storage"),
          class: null,
        },
        {
          label: "Processes",
          command: () => this.clickHandler("Processes"),
          class: null,
        },
        {
          label: "System Info",
          command: () => this.clickHandler("System Info"),
          class: null,
        },
      ],
      selectedMetric: "CPU",
    };
  },
  created() {
    if (localStorage.getItem("instance"))
      this.instance = JSON.parse(localStorage.getItem("instance"));
    else this.instance = this.$store.getters["instance/getInstance"];
    console.log(this.instance);
    console.log(this.instance.publicIp);
    this.socket = io.connect(this.instance.publicIp);
    this.socket.on("connect", () => {
      console.log("inside on connect");
      this.status = "online";
    });
    this.socket.on("connect_error", (err) => {
      console.log(err);
      this.status = "offline";
    });
    this.socket.on("connect_failed", (err) => {
      console.log(err);
      this.status = "offline";
    });
    this.socket.on("logs", (data) => {
      let d = new Date();
      this.systemInfo = data.systemInfo;
      let temp = [];
      for (var key in data.logs) {
        console.log(key);

        var sum = data.logs[key].metrics.reduce(
          (a, b) => {
            return { cpu: { usage: a.cpu.usage + b.cpu.usage } };
          },
          { cpu: { usage: 0 } }
        );
        sum.cpu.usage /= data.logs[key].metrics.length;
        temp.push(sum);
      }
      temp = temp.map((e) => {
        return e.cpu.usage;
      });
      console.log(temp);
      this.$refs.cpuDay.data.datasets[0].data = temp;
      this.$refs.cpuDay.data.labels = [...Array(24).keys()];
      temp = [];
      console.log(data.logs);
      for (
        var i = data.logs[d.getUTCHours()].metrics.length - 1;
        i >= Math.max(data.logs[d.getUTCHours()].metrics.length - 30, 0);
        i--
      ) {
        temp.push(data.logs[d.getUTCHours()].metrics[i].cpu.usage);
      }
      this.$refs.cpu.data.datasets[0].data = temp;
      this.$refs.cpu.data.labels = [
        ...Array(this.$refs.cpu.data.datasets[0].data.length).keys(),
      ];
      let last =
        data.logs[d.getUTCHours()].metrics[
          data.logs[d.getUTCHours()].metrics.length - 1
        ];
      this.$refs.ram.data.datasets[0].data = [
        last.memory.usedPercentage,
        100 - last.memory.usedPercentage,
      ];
      this.$refs.storage.data.datasets[0].data = [
        last.storage.usedPercentage,
        100 - last.storage.usedPercentage,
      ];
    });
    this.getData();
  },
  beforeUnmount() {
    this.socket.close();
  },
  methods: {
    newData(currentData, nData) {
      if (currentData.length > 30) {
        currentData.splice(0, 1);
      }
      currentData.push(nData);
    },
    getData() {
      this.status = "online";
      this.socket.on("metrics", (data) => {
        // cpu
        this.newData(this.$refs.cpu.data.datasets[0].data, data.cpu.usage);
        this.$refs.cpu.data.labels = [
          ...Array(this.$refs.cpu.data.datasets[0].data.length).keys(),
        ];
        // memory
        // this.$refs.ram.data.datasets[0].data.push(data.memory.usedPercentage);
        // this.$refs.ram.data.datasets[1].data.push(data.memory.freePercentage);
        // this.$refs.cpu.data.labels = [
        //   ...Array(this.$refs.cpu.data.datasets[0].data.length).keys()
        // ];
        // memory pie
        this.$refs.ram.data.datasets[0].data = [
          data.memory.usedPercentage,
          data.memory.freePercentage,
        ];
        // storage pie
        this.$refs.storage.data.datasets[0].data = [
          data.storage.usedPercentage,
          data.storage.freePercentage,
        ];
        // system info
        this.systemInfo = data.systemInfo;
        // refresh
        this.$refs.cpu.refresh();
        this.$refs.ram.refresh();
        this.$refs.storage.refresh();
        this.$refs.cpuDay.refresh();
      });
      this.socket.on("processList", (data) => {
        this.processes = data;
      });
    },
    clickHandler(value) {
      this.selectedMetric = value;
      this.items.forEach((elem, index) => {
        if (elem.label === value) {
          this.items[index].class = "bg-blue";
        } else {
          this.items[index].class = "bg-white";
        }
      });
    },
  },
};
</script>

<style scoped>
.bg-blue {
  background-color: turquoise;
}
.bg-white {
  background-color: white;
}
.center {
  text-align: center;
}
</style>
