// SocketService.js

// Manage Socket.IO server
const socketIO = require("socket.io");
const PTYService = require("./PTYService");
const { cpu, drive, mem, os, proc } = require("node-os-utils");
const psList = require("ps-list");

const Logs = {};
const logMetrics = async (s) => {
  Promise.all([cpu.usage(), drive.info(), mem.info(), os.uptime()])
    .then((result) => {
      let metrics = {
        cpu: {
          usage: 0,
        },
        storage: {
          used: 0,
          usedPercentage: 0,
        },
        memory: {
          used: 0,
          usedPercentage: 0,
        },
        systemInfo: {
          uptime: 0,
        },
      };
      metrics.cpu.usage = result[0];
      metrics.storage.used = result[1].usedGb;
      metrics.storage.usedPercentage = result[1].usedPercentage;
      metrics.memory.used = result[2].usedMemMb;
      metrics.memory.usedPercentage = 100 - result[2].freeMemPercentage;
      metrics.systemInfo.uptime = Math.round(result[3] / 3600);
      return metrics;
    })
    .then((metrics) => {
      let d = new Date();
      if (!Logs[d.getHours()] || Logs[d.getHours()].day !== d.getDay())
        Logs[d.getHours()] = { metrics: [], day: d.getDay() };
      Logs[d.getHours()].metrics.push(metrics);
    })
    .catch((err) => console.log(err));
};
setInterval(logMetrics, 10000);

class SocketService {
  constructor() {
    this.socket = null;
    this.pty = null;
  }

  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const sendMetrics = async (s) => {
      let metrics = {
        cpu: {
          usage: 0,
          model: "",
        },
        storage: {
          total: 0,
          used: 0,
        },
        memory: {
          total: 0,
          used: 0,
          free: 0,
          freePercentage: 0,
        },
        systemInfo: {
          os: "",
          platform: "",
          uptime: 0,
          hostname: "",
          type: "",
          arch: "",
        },
      };
      try {
        const cpuUsage = await cpu.usage();
        metrics.cpu.usage = cpuUsage;
      } catch (err) {
        metrics.cpu.usage = 0;
      }
      metrics.cpu.model = cpu.model();
      try {
        const driveInfo = await drive.info();
        metrics.storage.total = driveInfo.totalGb;
        metrics.storage.used = driveInfo.usedGb;
        metrics.storage.free = driveInfo.freeGb;
        metrics.storage.usedPercentage = driveInfo.usedPercentage;
        metrics.storage.freePercentage = driveInfo.freePercentage;
      } catch (err) {
        metrics.storage.total = 0;
        metrics.storage.used = 0;
        metrics.storage.free = 0;
        metrics.storage.usedPercentage = 0;
        metrics.storage.freePercentage = 0;
      }
      try {
        const memInfo = await mem.info();
        metrics.memory.total = memInfo.totalMemMb;
        metrics.memory.used = memInfo.usedMemMb;
        metrics.memory.free = memInfo.freeMemMb;
        metrics.memory.usedPercentage = 100 - memInfo.freeMemPercentage;
        metrics.memory.freePercentage = memInfo.freeMemPercentage;
      } catch (err) {
        metrics.memory.total = 0;
        metrics.memory.used = 0;
        metrics.memory.free = 0;
        metrics.memory.usedPercentage = 0;
        metrics.memory.freePercentage = 0;
      }
      try {
        const osInfo = await os.oos();
        metrics.systemInfo.os = osInfo;
      } catch (err) {
        metrics.systemInfo.os = "";
      }
      os.oos()
        .then((info) => {
          metrics.systemInfo.os = info;
        })
        .catch(() => (metrics.systemInfo.os = ""));
      metrics.systemInfo.platform = os.platform();
      metrics.systemInfo.uptime = Math.round(os.uptime() / 3600);
      metrics.systemInfo.hostname = os.hostname();
      metrics.systemInfo.type = os.type();
      metrics.systemInfo.arch = os.arch();
      s.emit("metrics", metrics);
    };

    const sendProcessDetails = async (s) => {
      psList()
        .then((info) => {
          const sortedCpu = info.sort(
            (a, b) => parseFloat(b.cpu) - parseFloat(a.cpu)
          );
          sortedCpu.forEach((elem) => {
            delete elem.cmd;
            delete elem.ppid;
            delete elem.uid;
          });
          s.emit("processList", sortedCpu.slice(0, 10));
        })
        .catch(() => s.emit("processList", []));
    };

    const io = socketIO(server, {
      cors: {
        origin: "http://localhost:8080",
        credentials: true,
      },
    });
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", async (socket) => {
      console.log("Client connect to socket.", socket.id);
      let systemInfo = {};
      try {
        const osInfo = await os.oos();
        systemInfo.os = osInfo;
      } catch (err) {
        systemInfo.os = "";
      }
      systemInfo.platform = os.platform();
      systemInfo.uptime = Math.round(os.uptime() / 3600);
      systemInfo.hostname = os.hostname();
      systemInfo.type = os.type();
      systemInfo.arch = os.arch();
      this.socket = socket;
      this.socket.emit("logs", { logs: Logs, systemInfo });
      // Just logging when socket disconnects.
      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
        clearInterval(metricInterval);
        clearInterval(procInterval);
      });

      let metricInterval = setInterval(() => sendMetrics(this.socket), 5000);
      let procInterval = setInterval(
        () => sendProcessDetails(this.socket),
        5000
      );
      // Create a new pty service when client connects.
      this.pty = new PTYService(this.socket);

      // Attach any event listeners which runs if any event is triggered from socket.io client
      // For now, we are only adding "input" event, where client sends the strings you type on terminal UI.
      this.socket.on("input", (input) => {
        //Runs this event function socket receives "input" events from socket.io client
        this.pty.write(input);
      });
    });
  }
}

module.exports = SocketService;
