<template>
  <div class="p-mt-5">
    <Card style="width: 50%" class="p-mx-auto p-px-0">
      <template #content>
        <div style="text-align: left">
          <div class="p-field">
            <InputText
              id="name"
              type="text"
              v-model="name"
              placeholder="Name"
              class="p-inputtext-lg"
            />
            <small id="username2-help" class="p-invalid">{{ nameError }}</small>
          </div>
          <div class="p-field">
            <InputText
              id="email"
              type="email"
              v-model="email"
              placeholder="Email"
              class="p-inputtext-lg"
            />
            <small id="username2-help" class="p-invalid">{{
              emailError
            }}</small>
          </div>
          <div class="p-field">
            <InputText
              id="contact"
              type="text"
              v-model="contact"
              placeholder="Phone Number"
              class="p-inputtext-lg"
            />
            <small id="username2-help" class="p-invalid">{{
              contactError
            }}</small>
          </div>
          <div class="p-field">
            <InputText
              id="password"
              type="password"
              v-model="password"
              placeholder="Password"
              class="p-inputtext-lg"
            />
            <small id="username2-help" class="p-invalid">{{
              passwordError
            }}</small>
          </div>
          <div class="p-field">
            <InputText
              id="confirm-password"
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              class="p-inputtext-lg"
            />
            <small id="username2-help" class="p-invalid">{{
              confirmPasswordError
            }}</small>
          </div>
          <Button label="Register" @click="register"></Button>
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
      name: "",
      email: "",
      password: "",
      contact: "",
      confirmPassword: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      contactError: "",
      isValid: true,
    };
  },
  methods: {
    resetErrors() {
      this.nameError = "";
      this.emailError = "";
      this.contactError = "";
      this.passwordError = "";
      this.confirmPasswordError = "";
    },
    resetInputs() {
      this.name = "";
      this.email = "";
      this.contact = "";
      this.password = "";
      this.confirmPassword = "";
    },
    validate() {
      this.isValid = true;
      this.resetErrors();

      if (this.name === "") {
        this.nameError = "*Please enter your name";
        this.isValid = false;
      }

      const emailPattern = new RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      );
      if (!emailPattern.test(this.email)) {
        this.emailError = "*Please enter a valid email address";
        this.isValid = false;
      }

      if (this.contact === "") {
        this.contactError = "*Please enter your phone number";
        this.isValid = false;
      }
      if (this.password === "" || this.password.length < 8) {
        this.passwordError = "*Please enter a valid password";
        this.isValid = false;
      }
      if (this.confirmPassword !== this.password) {
        this.confirmPasswordError = "*Passwords do not match";
        this.isValid = false;
      }
    },
    async register() {
      this.validate();
      if (!this.isValid) {
        return;
      }

      const response = await Api.register({
        name: this.name,
        email: this.email,
        mobileNumber: this.contact,
        password: this.password,
      });

      if (response.status === 200) {
        console.log(response.data);

        this.$store.commit("user/setUser", response.data);
        this.$store.commit("user/setAuth", { isAuthenticated: true });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("token", response.data.token);
        console.log(this.$store.getters["user/getEmail"]);
        console.log(this.$store.getters["user/isAuthenticated"]);
        console.log(this.$store.getters["user/getJWT"]);
        this.$router.replace("/home");
      } else {
        console.log(response);
      }
    },
  },
};
</script>

<style scoped></style>
