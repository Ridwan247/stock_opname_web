<template>
  <div class="card">
    <div class="flex gap-3 mt-4">
      <InputGroup>
        <FloatLabel>
          <Calendar inputId="tglScanSO" v-model="tglScanSO" :maxDate="new Date()" />
          <label for="tglScanSO">Tanggal Scan SO</label>
        </FloatLabel>
      </InputGroup>

      <InputGroup class="w-auto">
        <Button :disabled="isDisabledLihatData" icon="pi pi-search" label="Cari" @click="cariDataSO"
          :loading="loadingCariDataSO" />
      </InputGroup>
    </div>
    <div v-if="showTableScanSO" class="card">
      <DataTable ref="dt" v-model:filters="filters" :value="dataSO" showGridlines tableStyle="min-width: 50rem"
        paginator :rows="10" removableSort :rowsPerPageOptions="[10, 20, 50]" :loading="loadingScanSO">
        <div class="flex justify-content-end mb-3">
          <div class="flex justify-content-end mb-3">
            <Button icon="pi pi-file-excel" label="Export Excel" severity="success" @click="exportExcel" />
          </div>
        </div>
        <template #header>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
        </template>
        <template #empty> No data found. </template>
        <Column sortable field="no" header="No"> </Column>
        <Column sortable field="tanggal_scan" header="Tanggal Scan"> </Column>
        <Column sortable field="kodeso" header="Kode SO"> </Column>
        <Column sortable field="tanggalso" header="Tanggal SO"> </Column>
        <Column sortable field="cabangso" header="Cabang SO"> </Column>
        <Column sortable field="resi" header="Resi"> </Column>
        <Column sortable field="tanggalresi" header="Tanggal Resi"> </Column>
        <Column sortable field="kodeidkoli" header="ID Koli"> </Column>
        <Column sortable field="koli" header="Koli"> </Column>
        <Column sortable field="kilo" header="Kilo"> </Column>
        <Column sortable field="kodepengiriman" header="Kode Pengiriman"> </Column>
        <Column sortable field="keterangan" header="Keterangan"> </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useLoginStore } from "@/stores/login";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      tglScanSO: null,
      isDisabledLihatData: true,
      dataSO: null,
      filters: null,
      loadingCariDataSO: false,
      loadingScanSO: false,
      showTableScanSO: false,
    };
  },
  methods: {
    exportExcel() {
      if (!this.dataSO || this.dataSO.length === 0) {
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
      const exportData = this.dataSO.map((item) => {
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
        "SCAN_SO"
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
        `SCAN_SO_${this.formatDate(new Date())}.xlsx`
      );

      this.$toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: "Excel berhasil di export",
        life: 3000,
      });
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    cariDataSO() {
      this.loadingCariDataSO = true;
      this.loadingScanSO = true;
      this.showTableScanSO = true;

      axios
        .post(
          "https://apipod.lariscargo.co.id/api/show-scan-so",
          {
            tanggal: this.formatDate(this.tglScanSO),
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

          this.loadingCariDataSO = false;
          this.loadingScanSO = false;
          this.dataSO = res.data.data
            ? res.data.data.map((item, index) => {
              return {
                no: index + 1,
                ...item,
              };
            })
            : [];
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: "Gagal",
            detail: err.response?.data?.message,
            life: 3000,
          });

          this.dataSO = [];
          this.loadingCariDataSO = false;
          this.loadingScanSO = false;
        });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
  watch: {
    tglScanSO(val) {
      val ? (this.isDisabledLihatData = false) : (this.isDisabledLihatData = true);
    },
  },
  created() {
    this.initFilters();
  },
};
</script>
