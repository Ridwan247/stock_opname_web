<template>
  <div class="card">
    <div class="mb-5 flex flex-row-reverse flex-wrap">
      <Button label="Bersihkan" icon="pi pi-eraser" @click="resetForm" />
    </div>
    <div class="flex gap-3 mt-4">
      <InputGroup>
        <FloatLabel>
          <Calendar
            v-model="tglHeadSo"
            :disabled="isDisabledTglHeadSo"
            inputId="tglHeadSO"
            :maxDate="new Date()"
          />
          <label for="tglHeadSO">Tanggal Head SO</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="w-auto">
        <Button
          label="Request"
          :disabled="isDisabledHead"
          :loading="loadingRequestHeadSo"
          @click="addHeadSo"
        />
      </InputGroup>
    </div>

    <div v-if="showDataSo" class="flex gap-3 mt-5">
      <InputGroup>
        <FloatLabel>
          <InputText placeholder="Kode SO" v-model="kodeSo" inputId="kodeSO" disabled />
          <label for="kodeSO">Kode</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup>
        <FloatLabel>
          <InputText placeholder="Kode SO" v-model="tglSo" inputId="tglSO" disabled />
          <label for="tglSO">Tanggal</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup>
        <FloatLabel>
          <InputText
            placeholder="Kode SO"
            v-model="cabangSo"
            inputId="cabangSO"
            disabled
          />
          <label for="cabangSO">Cabang</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="w-auto">
        <Button
          @click="simpanDataSo"
          :disabled="isDisabledDataSo"
          :loading="loadingSimpanDataSo"
          label="Simpan"
        />
      </InputGroup>
    </div>

    <div v-if="loadingBeforeTableShow" class="content mt-5">
      <div class="load-wrapp flex align-items-center justify-content-center">
        <div class="load-6">
          <div class="letter-holder">
            <div class="l-1 letter">L</div>
            <div class="l-2 letter">o</div>
            <div class="l-3 letter">a</div>
            <div class="l-4 letter">d</div>
            <div class="l-5 letter">i</div>
            <div class="l-6 letter">n</div>
            <div class="l-7 letter">g</div>
            <div class="l-8 letter">.</div>
            <div class="l-9 letter">.</div>
            <div class="l-10 letter">.</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTableDataSo" class="mt-5">
      <DataTable
        v-model:filters="filters"
        :value="masterSO"
        resizableColumns
        columnResizeMode="fit"
        showGridlines
        tableStyle="min-width: 50rem"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        filterDisplay="menu"
        removableSort
        stripedRows
        :loading="loadingDataSo"
      >
        <template #header>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
        </template>
        <Column field="no" sortable header="No"></Column>
        <Column field="resi" sortable header="Resi"></Column>
        <Column field="tanggalresi" sortable header="Tanggal Resi"></Column>
        <Column field="kodeidkoli" sortable header="ID Koli"></Column>
        <Column field="koli" sortable header="Koli"></Column>
        <Column field="kilo" sortable header="Kilo"></Column>
        <Column field="kodepengiriman" sortable header="Kode Pengiriman"></Column>
        <Column field="keterangan" sortable header="Keterangan"></Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.content {
  overflow: hidden;
}

.load-wrapp {
  margin: 0 10px 10px 0;
  padding: 20px 20px 20px;
  border-radius: 5px;
}

.load-wrapp p {
  padding: 0 0 20px;
}
.load-wrapp:last-child {
  margin-right: 0;
}

.letter {
  float: left;
  font-size: 24px;
  color: #777;
}

.load-6 .letter {
  animation-name: loadingF;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-direction: linear;
}

.l-1 {
  animation-delay: 0.48s;
}
.l-2 {
  animation-delay: 0.6s;
}
.l-3 {
  animation-delay: 0.72s;
}
.l-4 {
  animation-delay: 0.84s;
}
.l-5 {
  animation-delay: 0.96s;
}
.l-6 {
  animation-delay: 1.08s;
}
.l-7 {
  animation-delay: 1.2s;
}
.l-8 {
  animation-delay: 1.32s;
}
.l-9 {
  animation-delay: 1.44s;
}
.l-10 {
  animation-delay: 1.56s;
}

@keyframes loadingF {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import axios from "axios";
import { useLoginStore } from "@/stores/login";

export default {
  data() {
    return {
      loadingDataSo: false,
      loadingRequestHeadSo: false,
      loadingSimpanDataSo: false,
      loadingBeforeTableShow: false,
      filters: null,
      tglHeadSo: null,
      isDisabledHead: true,
      isDisabledDataSo: false,
      isDisabledTglHeadSo: false,
      kodeSo: "",
      tglSo: "",
      cabangSo: "",
      showDataSo: false,
      showTableDataSo: false,
      masterSO: [],
    };
  },
  methods: {
    resetForm() {
      this.loadingDataSo = false;
      this.loadingRequestHeadSo = false;
      this.loadingSimpanDataSo = false;
      this.loadingBeforeTableShow = false;
      this.filters = null;
      this.tglHeadSo = null;
      this.isDisabledHead = true;
      this.isDisabledDataSo = false;
      this.isDisabledTglHeadSo = false;
      this.kodeSo = "";
      this.tglSo = "";
      this.cabangSo = "";
      this.showDataSo = false;
      this.showTableDataSo = false;
      this.masterSO = [];
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    addHeadSo() {
      this.loadingRequestHeadSo = true;

      axios
        .post(
          "https://apipod.lariscargo.co.id/api/store-so-tsale",
          {
            tanggal: this.formatDate(this.tglHeadSo),
            kode_cabang: useLoginStore().getDecryptCabang(),
            created_by: useLoginStore().getDecryptNamaLengkap(),
          },
          {
            headers: {
              Authorization: "Bearer " + useLoginStore().getDecryptToken(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          this.$toast.add({
            severity: "success",
            summary: "Berhasil",
            detail: res.data.message,
            life: 3000,
          });

          this.showDataSo = true;
          this.loadingRequestHeadSo = false;

          this.kodeSo = res.data.data.kodeso;
          this.tglSo = res.data.data.tanggalso;
          this.cabangSo = res.data.data.cabangso;

          this.isDisabledTglHeadSo = true;

          this.isDisabledHead = true;
          this.showDataSo = true;
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message,
            life: 3000,
          });

          this.isDisabledHead = false;
          this.loadingRequestHeadSo = false;
        });
    },
    simpanDataSo() {
      this.loadingSimpanDataSo = true;

      axios
        .post(
          "https://apipod.lariscargo.co.id/api/store-so",
          {
            kodeso: this.kodeSo,
            tanggal: this.tglSo,
            kode_cabang: this.cabangSo,
            created_by: useLoginStore().getDecryptNamaLengkap(),
          },
          {
            headers: {
              Authorization: "Bearer " + useLoginStore().getDecryptToken(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          this.$toast.add({
            severity: "success",
            summary: "Berhasil",
            detail: res.data.message,
            life: 3000,
          });

          this.loadingSimpanDataSo = false;
          this.isDisabledDataSo = true;
          this.loadingBeforeTableShow = true;

          axios
            .post(
              "https://apipod.lariscargo.co.id/api/show-so",
              {
                kodeso: this.kodeSo,
                tanggal: this.tglSo,
              },
              {
                headers: {
                  Authorization: "Bearer " + useLoginStore().getDecryptToken(),
                  "Content-Type": "application/json",
                },
              }
            )
            .then((dataSo) => {
              this.showTableDataSo = true;
              this.$toast.add({
                severity: "success",
                summary: "Berhasil",
                detail: dataSo.data.message,
                life: 3000,
              });

              this.loadingBeforeTableShow = false;
              this.masterSO = dataSo.data.data
                ? dataSo.data.data.map((item, index) => {
                    return {
                      no: index + 1,
                      ...item,
                    };
                  })
                : [];
            })
            .catch((errDataSo) => {
              this.$toast.add({
                severity: "error",
                summary: "Gagal",
                detail: errDataSo.message,
                life: 3000,
              });

              this.showTableDataSo = false;
              this.masterSO = [];
            });
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message,
            life: 3000,
          });

          this.isDisabledDataSo = false;
          this.loadingSimpanDataSo = false;
        });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
        },
        "country.name": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
        },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
      };
    },
    getSeverity(status) {
      switch (status) {
        case "unqualified":
          return "danger";

        case "qualified":
          return "success";

        case "new":
          return "info";

        case "negotiation":
          return "warning";

        case "renewal":
          return null;
      }
    },
  },
  created() {
    this.initFilters();
  },
  watch: {
    tglHeadSo(value) {
      value ? (this.isDisabledHead = false) : (this.isDisabledHead = true);
    },
  },
};
</script>
