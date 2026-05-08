<template>
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-left">
                <h2 class="page-title">Dashboard</h2>
                <span class="branch-badge">
                    <i class="pi pi-building"></i>
                    Cabang: <strong>{{ kodeCabang }}</strong>
                </span>
            </div>
            <div class="header-right">
                <Calendar v-model="tanggal" dateFormat="yy-mm-dd" placeholder="Pilih Tanggal" :showIcon="true"
                    class="date-picker" />
                <Dropdown v-model="selectedSO" :options="listSO" optionLabel="kodeso" optionValue="kodeso"
                    placeholder="Pilih Kode SO" class="so-dropdown" />
                <Button label="Cari" icon="pi pi-search" @click="fetchDashboard" :loading="loading"
                    class="p-button-info search-btn" />
            </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="skeleton-grid">
            <div v-for="n in 6" :key="n" class="skeleton-card">
                <Skeleton height="120px" />
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="empty-state">
            <i class="pi pi-exclamation-circle empty-icon" style="color: #ef4444;"></i>
            <p>{{ error }}</p>
            <Button label="Coba Lagi" icon="pi pi-refresh" @click="fetchDashboard"
                class="p-button-outlined p-button-sm" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!data" class="empty-state">
            <i class="pi pi-chart-bar empty-icon"></i>
            <p>Pilih tanggal untuk melihat data dashboard</p>
        </div>

        <!-- Dashboard Data -->
        <div v-else class="dashboard-content">
            <div class="flex justify-content-end mb-3">
                <Button label="Export Excel" icon="pi pi-file-excel" severity="success" @click="exportExcel"
                    :disabled="!data" />
            </div>
            <!-- Info SO -->
            <div class="section-title">
                <i class="pi pi-info-circle"></i> Informasi Stock Opname
            </div>
            <div class="info-card">
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">Kode SO</span>
                        <span class="info-value code-value">{{ data.info_so.kodeso }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tanggal SO</span>
                        <span class="info-value">{{ formatDate(data.info_so.tanggalso) }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Cabang</span>
                        <span class="info-value">{{ data.info_so.cabangso }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Dibuat Oleh</span>
                        <span class="info-value">{{ data.info_so.created_by }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <Tag :value="data.info_so.status"
                            :severity="data.info_so.status === 'DONE' ? 'success' : 'warning'" />
                    </div>
                </div>
            </div>

            <!-- Progress Scan -->
            <div class="section-title mt-4">
                <i class="pi pi-chart-line"></i> Progress Scan
            </div>
            <div class="progress-card">
                <div class="progress-header">
                    <span>Progress Keseluruhan</span>
                    <span class="progress-pct">{{ data.progres_scan }}</span>
                </div>
                <ProgressBar :value="parseFloat(data.progres_scan)" :showValue="false" class="custom-progress" />
            </div>

            <!-- Stats Cards -->
            <div class="section-title mt-4">
                <i class="pi pi-box"></i> Ringkasan Data
            </div>
            <div class="stats-grid">
                <!-- Master SO -->
                <div class="stat-card master">
                    <div class="stat-icon">
                        <i class="pi pi-database"></i>
                    </div>
                    <div class="stat-body">
                        <span class="stat-label">Master SO</span>
                        <div class="stat-numbers">
                            <div class="stat-number-item">
                                <span class="stat-number">{{ formatNumber(data.master_so.total_koli) }}</span>
                                <span class="stat-unit">Koli</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-number-item">
                                <span class="stat-number">{{ formatNumber(data.master_so.total_kilo) }}</span>
                                <span class="stat-unit">Kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hasil Scan -->
                <div class="stat-card scanned">
                    <div class="stat-icon">
                        <i class="pi pi-qrcode"></i>
                    </div>
                    <div class="stat-body">
                        <span class="stat-label">Hasil Scan</span>
                        <div class="stat-numbers">
                            <div class="stat-number-item">
                                <span class="stat-number">{{ formatNumber(data.hasil_scan.total_koli) }}</span>
                                <span class="stat-unit">Koli</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-number-item">
                                <span class="stat-number">{{ formatNumber(data.hasil_scan.total_kilo) }}</span>
                                <span class="stat-unit">Kg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rekonsiliasi -->
            <div class="section-title mt-4">
                <i class="pi pi-sync"></i> Rekonsiliasi
            </div>
            <div class="rekon-grid">
                <!-- Match -->
                <div class="rekon-card match">
                    <div class="rekon-header">
                        <i class="pi pi-check-circle"></i>
                        <span>Match</span>
                    </div>
                    <div class="rekon-numbers">
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.match.total_koli) }}</span>
                            <span class="rekon-lbl">Koli</span>
                        </div>
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.match.total_kilo) }}</span>
                            <span class="rekon-lbl">Kg</span>
                        </div>
                    </div>
                </div>

                <!-- Belum Scan -->
                <div class="rekon-card belum">
                    <div class="rekon-header">
                        <i class="pi pi-clock"></i>
                        <span>Belum Scan</span>
                    </div>
                    <div class="rekon-numbers">
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.belum_scan.total_koli) }}</span>
                            <span class="rekon-lbl">Koli</span>
                        </div>
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.belum_scan.total_kilo) }}</span>
                            <span class="rekon-lbl">Kg</span>
                        </div>
                    </div>
                </div>

                <!-- Lebih -->
                <div class="rekon-card lebih">
                    <div class="rekon-header">
                        <i class="pi pi-exclamation-triangle"></i>
                        <span>Lebih</span>
                    </div>
                    <div class="rekon-numbers">
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.lebih.total_koli) }}</span>
                            <span class="rekon-lbl">Koli</span>
                        </div>
                        <div class="rekon-item">
                            <span class="rekon-val">{{ formatNumber(data.rekonsiliasi.lebih.total_kilo) }}</span>
                            <span class="rekon-lbl">Kg</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import Skeleton from 'primevue/skeleton';
import Dropdown from 'primevue/dropdown';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

export default {
    name: 'Dashboard',
    components: { Button, Calendar, Tag, ProgressBar, Skeleton, Dropdown },
    setup() {
        const tanggal = ref(null);
        const data = ref(null);
        const loading = ref(false);
        const error = ref(null);
        // const selectedSO = ref(null);#############################################################################################################
        // const listSO = ref([]);

        // Ambil kode cabang dari localStorage (sama persis dengan loginStore)
        const getDecryptCabang = () => {
            const encryptedGet = localStorage.getItem('DataG');
            return encryptedGet
                ? AES.decrypt(atob(encryptedGet), 'keyCbg').toString(Utf8)
                : '';
        };

        const kodeCabang = ref(getDecryptCabang());

        const getToken = () => {
            const encryptedGet = localStorage.getItem('DataA');
            return encryptedGet
                ? AES.decrypt(atob(encryptedGet), 'keyToken').toString(Utf8)
                : '';
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        };

        const formatNumber = (val) => {
            return Number(val).toLocaleString('id-ID');
        };

        const formatTanggal = (date) => {
            if (!date) return '';
            const d = new Date(date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        // const fetchKodeSO = async () => {);#############################################################################################################
        //     if (!tanggal.value) return;

        //     try {
        //         const token = getToken();

        //         const response = await axios.post(
        //             'https://apipod.lariscargo.co.id/api/so/list',
        //             {
        //                 kode_cabang: kodeCabang.value,
        //                 tanggal: formatTanggal(tanggal.value)
        //             },
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                     'Content-Type': 'application/json'
        //                 }
        //             }
        //         );

        //         if (response.data.status) {
        //             listSO.value = response.data.data;
        //         } else {
        //             listSO.value = [];
        //         }
        //     } catch (err) {
        //         listSO.value = [];
        //     }
        // };
        const exportExcel = () => {
            if (!data.value) return;

            const exportData = [
                {
                    "Kode SO": data.value.info_so.kodeso,
                    "Tanggal SO": formatDate(data.value.info_so.tanggalso),
                    "Cabang": data.value.info_so.cabangso,
                    "Dibuat Oleh": data.value.info_so.created_by,
                    "Status": data.value.info_so.status,

                    "Progress Scan": data.value.progres_scan,

                    "Master SO Koli": data.value.master_so.total_koli,
                    "Master SO Kilo": data.value.master_so.total_kilo,

                    "Hasil Scan Koli": data.value.hasil_scan.total_koli,
                    "Hasil Scan Kilo": data.value.hasil_scan.total_kilo,

                    "Match Koli": data.value.rekonsiliasi.match.total_koli,
                    "Match Kilo": data.value.rekonsiliasi.match.total_kilo,

                    "Belum Scan Koli": data.value.rekonsiliasi.belum_scan.total_koli,
                    "Belum Scan Kilo": data.value.rekonsiliasi.belum_scan.total_kilo,

                    "Lebih Koli": data.value.rekonsiliasi.lebih.total_koli,
                    "Lebih Kilo": data.value.rekonsiliasi.lebih.total_kilo,
                }
            ];

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // auto width
            worksheet["!cols"] = Object.keys(exportData[0]).map((key) => ({
                wch: key.length + 10
            }));

            // border
            const range = XLSX.utils.decode_range(worksheet["!ref"]);

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {

                    const cellAddress = XLSX.utils.encode_cell({
                        r: R,
                        c: C
                    });

                    if (!worksheet[cellAddress]) continue;

                    worksheet[cellAddress].s = {
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        }
                    };

                    // header bold
                    if (R === 0) {
                        worksheet[cellAddress].s.font = {
                            bold: true
                        };
                    }
                }
            }

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Dashboard"
            );

            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });

            const fileData = new Blob([excelBuffer], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
            });

            saveAs(
                fileData,
                `DASHBOARD_SO_${formatTanggal(tanggal.value)}.xlsx`
            );
        };
        const fetchDashboard = async () => {
            if (!tanggal.value) {
                error.value = 'Pilih tanggal terlebih dahulu.';
                return;
            }

            loading.value = true;
            error.value = null;
            data.value = null;

            try {
                const token = getToken();
                const response = await axios.post(
                    'https://apipod.lariscargo.co.id/api/so/dashboard',
                    {
                        kode_cabang: kodeCabang.value,
                        tanggal: formatTanggal(tanggal.value)
                        // kode_so: selectedSO.value);#############################################################################################################
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.status) {
                    data.value = response.data.data;
                } else {
                    error.value = response.data.message || 'Data tidak ditemukan.';
                }
            } catch (err) {
                error.value =
                    err?.response?.data?.message ||
                    'Gagal mengambil data. Periksa koneksi Anda.';
            } finally {
                loading.value = false;
            }
        };

        // Auto-load hari ini saat komponen mount
        onMounted(() => {
            tanggal.value = new Date();
            fetchDashboard();
            // fetchKodeSO();#############################################################################################################
        });

        return {
            tanggal,
            data,
            loading,
            error,
            kodeCabang,
            // selectedSO,);#############################################################################################################
            // listSO,
            // fetchKodeSO,
            exportExcel,
            fetchDashboard,
            formatDate,
            formatNumber
        };
    }
};
</script>

<style scoped>
.dashboard-container {
    padding: 1.5rem;
    max-width: 1200px;
}

/* Header */
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.page-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.branch-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.85rem;
    border: 1px solid #bae6fd;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.date-picker {
    width: 180px;
}

/* Section Title */
.section-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.mt-4 {
    margin-top: 1.5rem;
}

/* Info Card */
.info-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 120px;
}

.info-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
}

.code-value {
    font-family: monospace;
    color: #0369a1;
}

/* Progress */
.progress-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #475569;
}

.progress-pct {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0ea5e9;
}

:deep(.custom-progress .p-progressbar-value) {
    background: linear-gradient(90deg, #38bdf8, #0ea5e9);
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.15s, box-shadow 0.15s;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
}

.stat-card.master .stat-icon {
    background: #eff6ff;
    color: #3b82f6;
}

.stat-card.scanned .stat-icon {
    background: #f0fdf4;
    color: #22c55e;
}

.stat-body {
    flex: 1;
}

.stat-label {
    font-size: 0.8rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.5rem;
}

.stat-numbers {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-number-item {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
}

.stat-unit {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 2px;
}

.stat-divider {
    width: 1px;
    height: 36px;
    background: #e2e8f0;
}

/* Rekon Grid */
.rekon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.rekon-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.15s, box-shadow 0.15s;
}

.rekon-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rekon-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
}

.rekon-card.match .rekon-header {
    color: #16a34a;
}

.rekon-card.belum .rekon-header {
    color: #d97706;
}

.rekon-card.lebih .rekon-header {
    color: #dc2626;
}

.rekon-numbers {
    display: flex;
    gap: 1.5rem;
}

.rekon-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.rekon-val {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e293b;
}

.rekon-lbl {
    font-size: 0.75rem;
    color: #94a3b8;
}

/* Empty & Error State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
    color: #94a3b8;
}

.empty-icon {
    font-size: 3rem;
    color: #cbd5e1;
}

/* Skeleton */
.skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
}

.skeleton-card {
    border-radius: 12px;
    overflow: hidden;
}

/* Responsive */
@media (max-width: 640px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-right {
        width: 100%;
    }

    .date-picker {
        flex: 1;
    }
}
</style>