<template>
  <div class="p-mt-5">
    <Card style="width: 50%" class="p-mx-auto">
      <template #content>
        <div style="text-align: center">
          <div class="p-field">
            <InputText
              id="email"
              type="email"
              v-model="email"
              placeholder="Email"
              class="p-inputtext-lg p-col-6"
            />
            <small id="username2-help" class="p-invalid">{{
              emailError
            }}</small>
          </div>
          <div class="p-field">
            <InputText
              id="password"
              type="password"
              v-model="password"
              placeholder="Password"
              class="p-inputtext-lg p-col-6"
            />
            <small id="username2-help" class="p-invalid">{{
              passwordError
            }}</small>
          </div>
          <Button label="Login" @click="login"></Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import Api from "../api";
export default {
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      isValid: true,
    };
  },
  created() {
    console.log(localStorage.getItem("token"));
    console.log(JSON.parse(localStorage.getItem("user")));
  },
  methods: {
    resetInputs() {
      this.email = "";
      this.password = "";
    },
    resetErrors() {
      this.emailError = "";
      this.passwordError = "";
    },
    validate() {
      this.isValid = true;
      this.resetErrors();
      const emailPattern = new RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      );
      if (!emailPattern.test(this.email)) {
        this.emailError = "*Please enter a valid email address";
        this.isValid = false;
      }
      if (this.password === "" || this.password.length < 8) {
        this.passwordError = "*Please enter a valid password";
        this.isValid = false;
      }
    },
    async login() {
      this.validate();
      if (!this.isValid) return;

      const response = await Api.login({
        email: this.email,
        password: this.password,
      });

      if (response.status === 200) {
        console.log(response.data.user);
        this.$store.commit("user/setUser", response.data);
        this.$store.commit("user/setAuth", { isAuthenticated: true });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("token", response.data.token);
        this.$router.replace("/home");
      } else {
        console.log(response);
      }
    },
  },
};
</script>

<style scoped></style>
