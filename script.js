let records = [];

// Load CSV data
fetch("data.csv")
    .then(response => response.text())
    .then(text => {
        const rows = text.trim().split("\n");

        for (let i = 1; i < rows.length; i++) {
            const [id, label] = rows[i].split(",");

            records.push({
                id: id.trim(),
                label: label.trim()
            });
        }
    })
    .catch(error => {
        console.error("Error loading CSV:", error);
    });

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

    const result = document.getElementById("result");

    const match = records.find(
        row => row.id === inputId
    );

    if (match) {

        result.innerHTML = `
            <div class="result-card">
                <h3>Assignment Found</h3>

                <p>
                    <strong>Hi Student ${match.id}</strong>
                </p>

                <p>
                    Your assignment topic is:
                </p>

                <p>
                    <strong>"${match.label}"</strong>
                </p>
            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="not-found">
                Sorry, we can't find your Student ID.
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