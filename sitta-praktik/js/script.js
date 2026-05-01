document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. LOGIKA GREETING (DASHBOARD) ---
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const jam = new Date().getHours();
        let salam;
        if (jam >= 5 && jam < 11) {
            salam = "Selamat Pagi";
        } else if (jam >= 11 && jam < 15) {
            salam = "Selamat Siang";
        } else if (jam >= 15 && jam < 18) {
            salam = "Selamat Sore";
        } else {
            salam = "Selamat Malam";
        }
        greetingElement.innerText = salam;
    }

    // --- 2. LOGIKA LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email').value.trim();
            const passInput = document.getElementById('password').value.trim();

            if (typeof dataPengguna === 'undefined') {
                alert("Data pengguna tidak ditemukan!");
                return;
            }

            const user = dataPengguna.find(u => u.email === emailInput && u.password === passInput);

            if (user) {
                alert("Login Berhasil! Selamat Datang " + user.nama);
                window.location.href = "dashboard.html";
            } else {
                alert("email/password yang anda masukkan salah");
            }
        });
    }

    // --- 3. TAMPILKAN STOK (HANYA NAMA BARANG) ---
    const tabelBody = document.getElementById('tabelStok');
    if (tabelBody && typeof dataBahanAjar !== 'undefined') {
        tabelBody.innerHTML = ""; 
        dataBahanAjar.forEach((item, index) => {
            const row = tabelBody.insertRow();
            row.innerHTML = `
                <td>
                    <a href="javascript:void(0)" 
                       onclick="tampilkanDetail(${index})" 
                       style="color: #003366; font-weight: bold; text-decoration: none;">
                       ${item.namaBarang}
                    </a>
                </td>
            `;
        });
    }
});

// --- 4. LOGIKA TRACKING ---
function lacakPaket() {
    const inputNomor = document.getElementById('inputDO').value.trim();
    const areaHasil = document.getElementById('hasilTracking');
    const listLog = document.getElementById('listPerjalanan');

    if (typeof dataTracking === 'undefined') {
        alert("Data tracking tidak tersedia!");
        return;
    }

    const detail = dataTracking[inputNomor];

    if (detail) {
        areaHasil.style.display = "block";
        document.getElementById('infoPenerima').innerText = "Penerima: " + detail.nama;
        document.getElementById('infoStatus').innerText = detail.status;
        document.getElementById('infoEkspedisi').innerText = detail.ekspedisi;
        document.getElementById('infoTanggal').innerText = detail.tanggalKirim;
        document.getElementById('infoTotal').innerText = detail.total;

        listLog.innerHTML = "";
        detail.perjalanan.forEach((p, index) => {
            const li = document.createElement('li');
            if (index === 0) li.className = "latest"; 
            li.innerHTML = `<span class="time-label">${p.waktu}</span><span class="desc-label">${p.keterangan}</span>`;
            listLog.appendChild(li);
        });
    } else {
        alert("Nomor DO tidak ditemukan!");
        areaHasil.style.display = "none";
    }
}

// --- 5. LOGIKA MODAL DETAIL (Dua Kolom & Tanpa Scroll) ---
function tampilkanDetail(index) {
    const item = dataBahanAjar[index];
    if (item) {
        let fileName = "";
        const nama = item.namaBarang.toLowerCase();

        // Pemetaan nama file gambar di assets/img/
        if (nama.includes("komunikasi")) {
            fileName = "pengantar_komunikasi.jpg";
        } else if (nama.includes("keuangan")) {
            fileName = "manajemen_keuangan.jpg";
        } else if (nama.includes("kepemimpinan")) {
            fileName = "kepemimpinan.jpg";
        } else if (nama.includes("mikrobiologi")) {
            fileName = "mikrobiologi.jpg";
        } else if (nama.includes("paud") || nama.includes("perkembangan")) {
            fileName = "paud_perkembangan.jpeg";
        } else {
            fileName = "default_cover.jpg"; 
        }

        const imagePath = "assets/img/" + fileName;

        // Update elemen Gambar
        const imgElement = document.getElementById('detCover');
        if (imgElement) {
            imgElement.src = imagePath;
            imgElement.alt = item.namaBarang;
            
            // Fallback jika file gambar tidak ditemukan di folder
            imgElement.onerror = function() {
                this.src = "https://via.placeholder.com/300x400?text=Cover+Tidak+Ditemukan";
            };
        }

        // Update elemen Teks Detail
        document.getElementById('detNama').innerText = item.namaBarang;
        document.getElementById('detKode').innerText = item.kodeBarang;
        document.getElementById('detLokasi').innerText = item.kodeLokasi;
        document.getElementById('detJenis').innerText = item.jenisBarang || "Buku Materi Pokok";
        document.getElementById('detEdisi').innerText = item.edisi;
        document.getElementById('detStok').innerText = item.stok;
        
        // Membuka modal dengan display flex agar layout kiri-kanan aktif
        const modal = document.getElementById('modalDetail');
        if (modal) {
            modal.style.display = "flex";
        }
    }
}

// --- 6. FUNGSI DASAR MODAL ---
function tutupModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = "none";
}

// Menutup modal jika user klik di area hitam (luar modal-content)
window.onclick = function(event) {
    const modal = document.getElementById('modalDetail');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}