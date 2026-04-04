<script setup>
import { useLayout } from "@/layout/composables/layout";
import { ref, computed } from "vue";

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
  return `/layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
  }.svg`;
});
</script>

<template>
  <Toast />
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Login Stock Opname</div>
          </div>

          <div>
            <label for="username1" class="block text-900 text-xl font-medium mb-2"
              >Username</label
            >
            <InputText
              id="username1"
              type="text"
              placeholder="username"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="username"
            />

            <label for="password1" class="block text-900 font-medium text-xl mb-2"
              >Password</label
            >
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
            ></Password>
            <Button
              label="LogIn"
              class="w-full p-3 text-xl"
              :disabled="isDisabledLogin"
              :loading="loadingLogin"
              @click.prevent="login"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLoginStore } from "@/stores/login";

export default {
  data() {
    return {
      isDisabledLogin: false,
      loadingLogin: false,
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      this.loadingLogin = true;

      const loginStore = useLoginStore();
      const login = await loginStore.setLogin(this.username, this.password);
      if (login.success == true) {
        this.$toast.add({
          severity: "success",
          summary: "Login Berhasil",
          life: 3000,
        });

        this.$router.push({ path: "/" });
        loginStore.startIntervalSession();
        this.loadingLogin = false;
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Login Gagal",
          detail: login.response?.data?.message,
          life: 3000,
        });
        this.username = "";
        this.password = "";
        this.loadingLogin = false;
      }
    },
  },
  watch: {
    username(value) {
      if (value.length > 0 && this.password.length > 0) {
        this.isDisabledLogin = false;
      } else {
        this.isDisabledLogin = true;
      }
    },
    password(value) {
      if (value.length > 0 && this.username.length > 0) {
        this.isDisabledLogin = false;
      } else {
        this.isDisabledLogin = true;
      }
    },
  },
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
