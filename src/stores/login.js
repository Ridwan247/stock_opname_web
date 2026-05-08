import axios from 'axios';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
    state: () => ({
        intervalId: null
    }),
    actions: {
        getDecryptToken() {
            const encryptedGet = localStorage.getItem('DataA');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyToken').toString(Utf8) : '';
        },
        getDecryptUsername() {
            const encryptedGet = localStorage.getItem('DataB');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyUsername').toString(Utf8) : '';
        },
        getDecryptNama() {
            const encryptedGet = localStorage.getItem('DataC');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyNama').toString(Utf8) : '';
        },
        getDecryptNamaLengkap() {
            const encryptedGet = localStorage.getItem('DataD');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyNamaLengkap').toString(Utf8) : '';
        },
        getDecryptStatus() {
            const encryptedGet = localStorage.getItem('DataE');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyStatus').toString(Utf8) : '';
        },
        getDecryptIdUser() {
            const encryptedGet = localStorage.getItem('DataF');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyIdK').toString(Utf8) : '';
        },
        getDecryptCabang() {
            const encryptedGet = localStorage.getItem('DataG');
            return encryptedGet ? AES.decrypt(atob(encryptedGet), 'keyCbg').toString(Utf8) : '';
        },
        async setLogin(user, pass) {
            if (!user || !pass) {
                throw new Error('Username atau Password Tidak Boleh Kosong !!');
            }
            try {
                const response = await axios.post(
                    'https://apipod.lariscargo.co.id/api/login-so',
                    {
                        username: user,
                        password: pass
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const {
                    token,
                    admin: { kode, nama, namalengkap, status, idk, kodecabang }
                } = response.data;

                localStorage.setItem('DataA', btoa(AES.encrypt(token, 'keyToken').toString()));
                localStorage.setItem('DataB', btoa(AES.encrypt(kode, 'keyUsername').toString()));
                localStorage.setItem('DataC', btoa(AES.encrypt(nama, 'keyNama').toString()));
                localStorage.setItem('DataD', btoa(AES.encrypt(namalengkap, 'keyNamaLengkap').toString()));
                localStorage.setItem('DataE', btoa(AES.encrypt(status, 'keyStatus').toString()));
                localStorage.setItem('DataF', btoa(AES.encrypt(idk.toString(), 'keyIdK').toString()));
                localStorage.setItem('DataG', btoa(AES.encrypt(kodecabang, 'keyCbg').toString()));
                return response.data;
            } catch (err) {
                return err;
            }
        },
        startIntervalSession() {
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                this.removeIntervalSession();
                window.location.reload();
            }, 4 * 60 * 60 * 1000); // Remove item every 4 hours
        },
        removeIntervalSession() {
            clearInterval(this.intervalId);
            localStorage.removeItem('DataA');
            localStorage.removeItem('DataB');
            localStorage.removeItem('DataC');
            localStorage.removeItem('DataD');
            localStorage.removeItem('DataE');
            localStorage.removeItem('DataF');
            localStorage.removeItem('DataG');
        }
    }
});
