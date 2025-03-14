"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const filterContainer = document.createElement("div");
    const communeSelect = document.createElement("select");
    const yearSelect = document.createElement("select");
    const collisionSelect = document.createElement("select");
    
    const resultContainer = document.createElement("div");
    resultContainer.id = "resultContainer";
    
    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = "accidentChart";
    
    let accidentChart = null; // Initialisation propre du graphique
    let data = [];

    filterContainer.append(communeSelect, yearSelect, collisionSelect);
    document.body.append(filterContainer, resultContainer, chartCanvas);

    fetch("assets/data/OPENDATA_MAP_2020-2022_Bruxelles.json")
        .then((response) => response.json())
        .then((jsonData) => {
            data = jsonData;
            console.log("Données chargées :", data);
            populateFilters();
        })
        .catch((error) => console.error("Erreur lors du chargement des données :", error));

    function populateFilters() {
        populateSelect(communeSelect, new Set(data.map((item) => item.TX_MUNTY_COLLISION_FR).filter(Boolean)), "Sélectionner une commune");
        populateSelect(yearSelect, new Set(data.map((item) => item.DT_YEAR_COLLISION).filter(Boolean)), "Sélectionner une année");
        populateSelect(collisionSelect, new Set(data.map((item) => item.TX_COLLISON_TYPE_FR).filter(Boolean)), "Sélectionner un type de collision");
    }

    function populateSelect(selectElement, values, defaultOption) {
        selectElement.innerHTML = `<option value=''>${defaultOption}</option>`;
        values.forEach((value) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    function applyFilters() {
        const selectedCommune = communeSelect.value;
        const selectedYear = yearSelect.value;
        const selectedCollision = collisionSelect.value;
        
        if (!resultContainer) return;
        resultContainer.innerHTML = "";

        const filteredData = data.filter(
            (item) => (selectedCommune === "" || item.TX_MUNTY_COLLISION_FR === selectedCommune) &&
                (selectedYear === "" || item.DT_YEAR_COLLISION == selectedYear) &&
                (selectedCollision === "" || item.TX_COLLISON_TYPE_FR === selectedCollision)
        );

        if (filteredData.length === 0) {
            resultContainer.innerHTML = "<p>Aucun accident trouvé avec ces critères</p>";
            if (accidentChart) {
                accidentChart.destroy();
                accidentChart = null;
            }
            return;
        }

        const ul = document.createElement("ul");
        filteredData.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = `${item.DT_YEAR_COLLISION} - ${item.TX_MUNTY_COLLISION_FR} : ${item.TX_COLLISON_TYPE_FR}`;
            ul.appendChild(li);
        });
        resultContainer.appendChild(ul);
        
        updateChart(filteredData);
    }

    function updateChart(filteredData) {
        if (filteredData.length === 0) {
            if (accidentChart) {
                accidentChart.destroy();
                accidentChart = null;
            }
            return;
        }

        const accidentByYear = {};
        
        filteredData.forEach((item) => {
            const year = item.DT_YEAR_COLLISION;
            accidentByYear[year] = (accidentByYear[year] || 0) + 1;
        });
        
        const years = Object.keys(accidentByYear);
        const accidentCounts = Object.values(accidentByYear);
        
        if (accidentChart) {
            accidentChart.destroy();
        }
        
        const ctx = document.getElementById("accidentChart").getContext("2d");
        accidentChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: years,
                datasets: [{
                    label: "Nombre d'accidents",
                    data: accidentCounts,
                    backgroundColor: "rgba(48, 65, 148, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    communeSelect.addEventListener("change", applyFilters);
    yearSelect.addEventListener("change", applyFilters);
    collisionSelect.addEventListener("change", applyFilters);
});


