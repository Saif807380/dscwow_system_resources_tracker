<template>
  <div>
    <div id="terminal-container" class="p-my-3"></div>
  </div>
</template>

<script>
import io from "socket.io-client";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

// import { TerminalUI } from "../TerminalUI";

const terminal = new Terminal();

const fitAddon = new FitAddon();

terminal.loadAddon(fitAddon);

terminal.setOption("theme", {
  background: "#202B33",
  foreground: "#F5F8FA",
});
terminal.setOption("fontSize", 20);
terminal.loadAddon(new WebLinksAddon());

export default {
  props: ["id"],
  data() {
    return {
      socket: null,
    };
  },
  created() {
    this.socket = io.connect("http://localhost:8000");
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
    terminal.dispose();
    this.socket.close();
  },
};
</script>

<style scoped></style>
