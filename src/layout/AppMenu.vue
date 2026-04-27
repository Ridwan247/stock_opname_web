<script setup>
import { ref } from "vue";
import { useLoginStore } from "@/stores/login";
import axios from "axios";
import AppMenuItem from "./AppMenuItem.vue";

const logout = () => {
  axios.post("https://apipod.lariscargo.co.id/api/logout-so", {
    token: useLoginStore().getDecryptToken(),
  });

  useLoginStore().removeIntervalSession();
};

const model = ref([
  // {
  //   label: "Home",
  //   items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
  // },
  //   {
  //     label: "Pages",
  //     icon: "pi pi-fw pi-briefcase",
  //     to: "/pages",
  //     items: [
  //       {
  //         label: "Auth",
  //         icon: "pi pi-fw pi-user",
  //         items: [
  //           {
  //             label: "Login",
  //             icon: "pi pi-fw pi-sign-in",
  //             to: "/auth/login",
  //           },
  //           {
  //             label: "Error",
  //             icon: "pi pi-fw pi-times-circle",
  //             to: "/auth/error",
  //           },
  //           {
  //             label: "Access Denied",
  //             icon: "pi pi-fw pi-lock",
  //             to: "/auth/access",
  //           },
  //         ],
  //       },
  //       {
  //         label: "Not Found",
  //         icon: "pi pi-fw pi-exclamation-circle",
  //         to: "/pages/notfound",
  //       },
  //       {
  //         label: "Empty",
  //         icon: "pi pi-fw pi-circle-off",
  //         to: "/pages/empty",
  //       },
  //     ],
  //   },
  {
    label: "Master",
    items: [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        to: "/dashboard",
      },
      {
        label: "Master Data",
        icon: "pi pi-fw pi-server",
        to: "/master-data",
      }

    ],
  },
  {
    label: "Pages",
    items: [
      {
        label: "Recon Data",
        icon: "pi pi-fw pi-sync",
        to: "/",
      },

    ],
  },
  {
    items: [
      {
        label: "Logout",
        icon: "pi pi-fw pi-sign-out",
        to: "/auth/login",
        command: () => {
          logout();
        },
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
