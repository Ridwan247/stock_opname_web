<template>
  <Card>
    <template #title>Rekon Data</template>
    <template #content>
      <div class="field mt-4">
        <FloatLabel>
          <Calendar v-model="tglSO" showButtonBar inputId="dateSO" dateFormat="yy/mm/dd" :maxDate="new Date()" />
          <label for="dateSO">Tanggal SO</label>
        </FloatLabel>
      </div>
      <div class="field mt-5">
        <FloatLabel>
          <AutoComplete dropdown v-model="kodeSO" inputId="ac" :suggestions="cariDataSO" :disabled="isDisabledCariSO"
            @complete="search" :loading="loadingCariDataSO" />
          <label for="ac">Cari Kode SO</label>
        </FloatLabel>
      </div>
      <div class="grid">
        <div class="col-4">
          <Button label="Cari" :disabled="isDisabledCariData" icon="pi pi-search" :loading="loadingCariRecon"
            @click="cariReconDataSO" severity="info" />
        </div>
        <div class="col-8 flex justify-content-end flex-wrap">
          <ConfirmPopup></ConfirmPopup>
          <Button v-if="validateConfirmData" label="Konfirmasi Data" icon="pi pi-check-square"
            @click="confirmRecon($event)" severity="warning" class="mr-3" />
          <Button label="Print Data" icon="pi pi-print" :disabled="isDisabledActionData" :loading="loadingPrintRecon"
            @click="printReconDataSO" severity="help" />
          <!-- tambahkan element select untuk memilih jumlah data yang di print agar tidak timeout jika di print keseluruahn -->
          <Dropdown v-model="printRows" :options="printOptions" optionLabel="name" optionValue="value" class="ml-3" />
          <div class="grid align-items-center">
            <!-- Tombol kiri -->
            <div class="col-12 md:col-4">
              <Button label="Cari" :disabled="isDisabledCariData" icon="pi pi-search" :loading="loadingCariRecon"
                @click="cariReconDataSO" severity="info" />
            </div>
            <!-- Tombol kanan -->
            <div class="col-12 md:col-8 flex justify-content-end gap-2 flex-wrap">
              <ConfirmPopup />
              <Button v-if="validateConfirmData" label="Konfirmasi Data" icon="pi pi-check-square"
                @click="confirmRecon($event)" severity="warning" />
              <Button label="Print Data" icon="pi pi-print" :disabled="isDisabledActionData"
                :loading="loadingPrintRecon" @click="printReconDataSO" severity="help" />
              <Button icon="pi pi-file-excel" label="Export Excel" severity="success" @click="exportExcel" />
            </div>
          </div>

          <div v-if="showDataRecon" class="card">
            <DataTable v-model:filters="filters" :value="dataRecon" stripedRows tableStyle="min-width: 50rem"
              :loading="loadingTable" paginator :rows="10" removableSort :rowsPerPageOptions="[10, 20, 50]">
              <template #header>
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Search" />
                </IconField>
              </template>
              <Column sortable field="no" header="No"></Column>
              <Column sortable field="resi" header="Resi"></Column>
              <Column sortable field="tanggalresi" header="Tanggal Resi"></Column>
              <Column sortable field="kodeidkoli" header="ID Koli"></Column>
              <Column sortable field="koli" header="Koli"></Column>
              <Column sortable field="kilo" header="Kilo"></Column>
              <Column sortable field="kodepengiriman" header="Kode Pengiriman"></Column>
              <Column sortable field="kodeso" header="Kode SO"></Column>
              <Column sortable field="tanggalso" header="Tanggal SO"></Column>
              <Column sortable field="master_data" header="Master Data">
                <template #body="slotProps">
                  <span>
                    {{ slotProps.data.master_data == "Y" ? "Yes" : "No" }}
                  </span>
                </template>
              </Column>
              <Column sortable field="tanggal_scan" header="Tanggal Scan"></Column>
              <Column sortable field="hasil_scan" header="Hasil Scan">
                <template #body="slotProps">
                  <span>
                    {{ slotProps.data.hasil_scan == "Y" ? "Yes" : "No" }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </div>
    </template>
  </Card>
</template>

<script>
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useLoginStore } from "@/stores/login";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      printRows: 1000,
      printOptions: [
        { name: "1-1000", value: "1-1000" },
        { name: "1001-2000", value: "1001-2000" },
        { name: "2001-3000", value: "2001-3000" },
        { name: "3001-4000", value: "3001-4000" },
        { name: "4001-5000", value: "4001-5000" },
        { name: "5001-6000", value: "5001-6000" },
      ],
      kodeSO: "",
      tglSO: "",
      itemsRecon: [],
      cariDataSO: [],
      isDisabledCariSO: true,
      isDisabledActionData: true,
      dataRecon: null,
      loadingTable: false,
      loadingPrintRecon: false,
      loadingCariDataSO: false,
      filters: null,
      showDataRecon: false,
      loadingCariRecon: false,
      validateConfirmData: false,
    };
  },
  created() {
    this.initFilters();
  },
  methods: {
    exportExcel() {
      if (!this.dataRecon || this.dataRecon.length === 0) {
        this.$toast.add({
          severity: "warn",
          summary: "Warning",
          detail: "Tidak ada data untuk di export",
          life: 3000,
        });

        return;
      }

      // ambil semua column dari DataTable
      const columns = this.$refs.dt.columns;

      // ambil field & header otomatis
      const columnData = columns.map((col) => ({
        field: col.props.field,
        header: col.props.header,
      }));

      // ambil data sesuai column table
      const exportData = this.dataRecon.map((item) => {
        const row = {};

        columnData.forEach((col) => {
          row[col.header] = item[col.field];
        });

        return row;
      });

      // buat worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // auto width column
      worksheet["!cols"] = columnData.map((col) => ({
        wch: col.header.length + 10,
      }));

      // border semua cell
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({
            r: R,
            c: C,
          });

          if (!worksheet[cellAddress]) continue;

          worksheet[cellAddress].s = {
            border: {
              top: {
                style: "thin",
                color: { rgb: "000000" },
              },
              bottom: {
                style: "thin",
                color: { rgb: "000000" },
              },
              left: {
                style: "thin",
                color: { rgb: "000000" },
              },
              right: {
                style: "thin",
                color: { rgb: "000000" },
              },
            },
          };

          // header bold
          if (R === 0) {
            worksheet[cellAddress].s.font = {
              bold: true,
            };
          }
        }
      }

      // workbook
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Data recon"
      );

      // generate excel
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(
        fileData,
        `DATA_SO_${this.formatDate(new Date())}.xlsx`
      );

      this.$toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: "Excel berhasil di export",
        life: 3000,
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
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    search(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.cariDataSO = [...this.itemsRecon];
        } else {
          this.cariDataSO = this.itemsRecon.filter((item) => {
            return item.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },
    checkConfirmData() {
      axios
        .post(
          "https://apipod.lariscargo.co.id/api/show-so-tsale",
          {
            kode_cabang: useLoginStore().getDecryptCabang(),
            tanggal: this.formatDate(this.tglSO),
          },
          {
            headers: {
              Authorization: "Bearer " + useLoginStore().getDecryptToken(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          let dataForConfirm = res.data.data
            ? res.data.data.map((item) => item.status)
            : [];

          if (dataForConfirm.includes(null)) {
            this.validateConfirmData = true;
          } else {
            this.validateConfirmData = false;
          }
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message
              ? err.response?.data?.message
              : err.message,
            life: 3000,
          });

          this.validateConfirmData = false;
        });
    },
    confirmRecon(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: "Anda Yakin Ingin Konfirmasi Data ?",
        icon: "pi pi-exclamation-triangle",
        rejectClass: "p-button-secondary p-button-outlined p-button-sm",
        acceptClass: "p-button-sm",
        rejectLabel: "Cancel",
        acceptLabel: "Confirm",
        accept: () => {
          this.konfirmasiDataSO();
        },
        reject: () => { },
      });
    },
    konfirmasiDataSO() {
      axios
        .post(
          "https://apipod.lariscargo.co.id/api/konfirm-so",
          {
            tanggal: this.formatDate(this.tglSO),
            kode_cabang: useLoginStore().getDecryptCabang(),
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

          this.checkConfirmData();
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message
              ? err.response?.data?.message
              : err.message,
            life: 3000,
          });
        });
    },
    cariReconDataSO() {
      this.loadingTable = true;
      this.loadingCariRecon = true;

      axios
        .post(
          "https://apipod.lariscargo.co.id/api/show-recon-so",
          {
            kodeso: this.kodeSO,
            tanggal: this.formatDate(this.tglSO),
            kode_cabang: useLoginStore().getDecryptCabang(),
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

          this.checkConfirmData();
          this.isDisabledActionData = false;
          this.isDisabledCariSO = false;
          this.showDataRecon = true;
          this.loadingCariRecon = false;

          this.dataRecon = res.data.data
            ? res.data.data.map((item, index) => {
              return {
                no: index + 1,
                ...item,
              };
            })
            : [];
          this.loadingTable = false;
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message
              ? err.response?.data?.message
              : err.message,
            life: 3000,
          });

          this.isDisabledActionData = true;
          this.loadingTable = false;
          this.showDataRecon = false;
          this.loadingCariRecon = false;
        });
    },
    printReconDataSO() {
      this.loadingPrintRecon = true;
      axios
        .post(
          "https://apipod.lariscargo.co.id/api/print-recon-so",
          {
            kodeso: this.kodeSO,
            tanggal: this.formatDate(this.tglSO),
            kode_cabang: useLoginStore().getDecryptCabang(),
            print_rows: this.printRows,
          },
          {
            responseType: "blob",
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
          this.loadingPrintRecon = false;
          const blob = new Blob([res.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message
              ? err.response?.data?.message
              : err.message,
            life: 3000,
          });
          this.loadingPrintRecon = false;
        });
    },
  },
  watch: {
    tglSO(val) {
      this.loadingCariDataSO = true;
      this.kodeSO = "";

      axios
        .post(
          "https://apipod.lariscargo.co.id/api/show-so-tsale",
          {
            kode_cabang: useLoginStore().getDecryptCabang(),
            tanggal: this.formatDate(val),
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

          this.itemsRecon = res.data.data ? res.data.data.map((item) => item.kodeso) : [];
          this.isDisabledCariSO = false;
          this.loadingCariDataSO = false;
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message
              ? err.response?.data?.message
              : err.message,
            life: 3000,
          });
          this.isDisabledCariSO = true;
          this.loadingCariDataSO = false;
        });
    },
  },
  computed: {
    isDisabledCariData() {
      return this.kodeSO ? false : true;
    },
  },
};
</script>
