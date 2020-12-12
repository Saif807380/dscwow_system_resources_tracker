<template>
  <div>
    <div
      id="terminal-container"
      style="width: 50%"
      class="p-my-5 p-mx-auto p-shadow-5"
    ></div>
  </div>
</template>

<script>
import io from "socket.io-client";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

// import { TerminalUI } from "../TerminalUI";

const terminal = new Terminal({
  rows: 25,
});

const fitAddon = new FitAddon();

terminal.loadAddon(fitAddon);

terminal.setOption("theme", {
  background: "#202B33",
  foreground: "#F5F8FA",
});
terminal.setOption("fontSize", 16);
terminal.loadAddon(new WebLinksAddon());

export default {
  props: ["id"],
  data() {
    return {
      socket: null,
      instance: null,
    };
  },
  created() {
    if (localStorage.getItem("instance"))
      this.instance = JSON.parse(localStorage.getItem("instance"));
    else this.instance = this.$store.getters["instance/getInstance"];
    console.log(`INSTANCE: ${this.instance}`);
    console.log(this.instance);
    console.log(this.instance.publicIp);
    this.socket = io.connect(this.instance.publicIp);
  },
  mounted() {
    console.log("entered");
    terminal.open(document.getElementById("terminal-container"));
    fitAddon.fit();
    terminal.write(`\r\n$ `);
    terminal.onData((data) => {
      this.socket.emit("input", data);
    });
    this.socket.on("output", (data) => {
      terminal.write(data);
    });
  },
  beforeUnmount() {
    console.log("COMPONENT UNMOUNTED!");
    terminal.reset();
    //terminal.dispose();
    this.socket.close();
  },
};
</script>

<style scoped></style>
