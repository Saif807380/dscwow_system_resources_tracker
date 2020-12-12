import { createApp } from "vue";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/mdc-light-deeppurple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import Components from "./components";
import App from "./App.vue";
import router from "./routes";
import store from "./store";

const app = createApp(App);
app.use(PrimeVue);
app.use(store);
app.use(router);

for (var x in Components) {
  app.component(x, Components[x]);
}

app.mount("#app");
