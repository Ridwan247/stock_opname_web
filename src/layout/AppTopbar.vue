<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useRouter } from "vue-router";
import { usePrimeVue } from "primevue/config";
import { useLoginStore } from "@/stores/login";
import axios from "axios";

const $primevue = usePrimeVue();
const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

const items = ref([
  {
    label: "Logout",
    icon: "pi pi-fw pi-sign-out",
    command: () => {
      logout();
      router.push("/auth/login");
    },
  },
]);

const logout = () => {
  axios.post("https://apipod.lariscargo.co.id/api/logout-so", {
    token: useLoginStore().getDecryptToken(),
  });

  useLoginStore().removeIntervalSession();
};

const onDarkModeChange = (value) => {
  const newThemeName = value
    ? layoutConfig.theme.value.replace("light", "dark")
    : layoutConfig.theme.value.replace("dark", "light");

  layoutConfig.darkTheme.value = value;
  onChangeTheme(newThemeName, value);
};

const onChangeTheme = (theme, mode) => {
  $primevue.changeTheme(layoutConfig.theme.value, theme, "theme-css", () => {
    layoutConfig.theme.value = theme;
    layoutConfig.darkTheme.value = mode;
  });
};

const router = useRouter();

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const logoUrl = computed(() => {
  return `/layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
  }.svg`;
});

const onSettingsClick = () => {
  topbarMenuActive.value = false;
};
const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <span>Stock Opname</span>
    </router-link>

    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>
    <!-- <div>
      <InputSwitch
        :modelValue="layoutConfig.darkTheme.value"
        @update:modelValue="onDarkModeChange"
      />
    </div> -->
    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <Toast />
      <SplitButton text severity="secondary" @click="onSettingsClick" :model="items">
        <i class="pi pi-user" style="font-size: 1.5rem"></i>
      </SplitButton>
    </div>
  </div>
</template>
