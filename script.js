let records = [];
let subjects = [];

const subjectSelect = document.getElementById("subjectSelect");

function parseCSV(text) {
    return text.trim().split(/\r?\n/).map(row => {
        const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        return cols.map(c => c.replace(/^"|"$/g, "").replace(/""/g, '"').trim());
    });
}

function loadDatac() {
    fetch("datac.csv")
        .then(response => response.text())
        .then(text => {
            const rows = parseCSV(text);
            rows.shift();

            for (const clean of rows) {
                const id = clean[0] || '';
                const nama = clean[1] || '';
                const topik = clean[2] || '';
                const subtopik = clean[3] || '';

                records.push({ id, nama, topik, subtopik });
            }
        })
        .catch(error => {
            console.error("Error loading datac.csv:", error);
        });
}

function loadSubjects() {
    fetch("subject.csv")
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split(/\r?\n/);
            rows.shift();

            subjects = rows
                .map(row => row.split(","))
                .filter(cols => cols.length >= 2)
                .map(cols => ({
                    kodemk: cols[0].trim(),
                    namaMK: cols[1].trim()
                }));

            subjectSelect.innerHTML = `
                <option value="">Pilih Mata Kuliah</option>
                ${subjects
                    .map(subject => `
                        <option value="${subject.kodemk}">${subject.namaMK}</option>
                    `)
                    .join("")}
            `;
        })
        .catch(error => {
            console.error("Error loading subject.csv:", error);
        });
}

loadDatac();
loadSubjects();

// Handle form submission (button click OR Enter key)
document
    .getElementById("searchForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        searchId();
    });

function searchId() {

    const inputId = document
        .getElementById("idInput")
        .value
        .trim();

    const selectedCode = subjectSelect.value;
    const selectedSubject = subjects.find(subject => subject.kodemk === selectedCode);
    const result = document.getElementById("result");

    if (!selectedCode) {
        result.innerHTML = `
            <div class="not-found">
                Silakan pilih mata kuliah terlebih dahulu.
            </div>
        `;
        return;
    }

    const match = records.find(row => row.id === inputId);

    if (match) {
        result.innerHTML = `
            <div class="result-card">
                <h3>Tugas Untuk Mahasiswa</h3>
                <p><strong>${match.nama} (${match.id})</strong></p>
                <p><strong>Kode MK:</strong> ${selectedSubject?.kodemk || selectedCode}</p>
                <p><strong>Nama MK:</strong> ${selectedSubject?.namaMK || 'Tidak tersedia'}</p>
                <p><strong>Topik:</strong> ${match.topik}</p>
                <p><strong>Subtopik:</strong></p>
                <p class="subtopik">${match.subtopik}</p>
            </div>
        `;
    } else {
        result.innerHTML = `
            <div class="not-found">
                Maaf, kami tidak dapat menemukan NPM Anda.
            </div>
        `;
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service worker registered:', registration.scope);
            })
            .catch(error => {
                console.warn('Service worker registration failed:', error);
            });
    });
}