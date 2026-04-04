<template>
  <div class="card">
    <TabView>
      <TabPanel v-for="(i, index) in panelData" :header="i.header" :key="index">
        <component :is="i.panel"></component>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import { markRaw } from "vue";
import CreateMasterSO from "./master/MasterSO.vue";
import ShowMasterSO from "./master/ShowMasterSO.vue";
import ShowScanSO from "./master/ShowScanSO.vue";

export default {
  components: {
    CreateMasterSO,
    ShowMasterSO,
    ShowScanSO,
  },
  data() {
    return {
      panelData: [
        {
          header: "Master SO",
          panel: markRaw(CreateMasterSO),
        },
        {
          header: "View Master SO",
          panel: markRaw(ShowMasterSO),
        },
        {
          header: "View Scan SO",
          panel: markRaw(ShowScanSO),
        },
      ],
    };
  },
};
</script>
