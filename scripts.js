HOST = "http://181.236.87.123:5000"

document.addEventListener('DOMContentLoaded', function() {
    
    /*ESTILO MAPA AL DAR CLICK */
    const elements = document.getElementsByClassName('delimPath')
    // Define una función para restaurar el color original de todos los elementos
    function restaurarColorOriginal() {
      for (const element of elements) {
        element.style.fill = ''; // Restaura el color original (azul en este caso)
      }
    }
    
    // Agrega un evento de clic a cada elemento
    for (const element of elements) {
      element.addEventListener('click', function() {
        // Restaura el color original de todos los elementos    element.style.fill = '#005c53'; // Cambia a tu color deseado
      });
    }
});

//SABER11

//color del mapa
document.addEventListener('DOMContentLoaded', () => {
    const dataUrl = HOST + '/saber11/promedios_departamento_year';
    const paths = document.querySelectorAll('.delimPath11');
    const sliderMin = document.getElementById('range-slider-min-saber11');
    const sliderMax = document.getElementById('range-slider-max-saber11');
    const minYearDisplay = document.getElementById('min-year-saber11');
    const maxYearDisplay = document.getElementById('max-year-saber11');

    function getColor(value) {
        const colors = ['#E60202', '#E66F00', '#E69D00', '#E6CB00', '#58E600'];
        if (value < 200) return colors[0];
        if (value < 240) return colors[1];
        if (value < 275) return colors[2];
        if (value < 300) return colors[3];
        return colors[4];
    }

    function updateColors(minYear, maxYear, data) {
        console.log(`Updating colors for range ${minYear} - ${maxYear}`);
        paths.forEach(path => {
            const departmentName = path.parentNode.getAttribute('xlink:title');
            const departmentData = data.filter(d => d.departamento === departmentName && d.year >= minYear && d.year <= maxYear);
            console.log(`Department: ${departmentName}, Data:`, departmentData);

            if (departmentData.length > 0) {
                const totalValue = departmentData.reduce((sum, d) => sum + parseFloat(d.promedio_global), 0);
                const averageValue = totalValue / departmentData.length;
                console.log(`Average value for ${departmentName}: ${averageValue}`);
                path.style.fill = getColor(averageValue);
            } else {
                path.style.fill = '#ccc';
            }
        });
    }

    function update() {
        let minYear = parseInt(sliderMin.value);
        let maxYear = parseInt(sliderMax.value);

        if (minYear > maxYear) {
            sliderMax.value = minYear;
            maxYear = minYear;
        }

        if (maxYear < minYear) {
            sliderMin.value = maxYear;
            minYear = maxYear;
        }

        minYearDisplay.textContent = minYear;
        maxYearDisplay.textContent = maxYear;
        updateColors(minYear, maxYear, window.data);
    }

    fetch(dataUrl)
        .then(response => response.text())
        .then(dataText => {
            try {
                const data = JSON.parse(dataText);
                console.log('Data loaded:', data);
                window.data = data; // Store data globally for access in update function

                sliderMin.addEventListener('input', update);
                sliderMax.addEventListener('input', update);

                update();
            } catch (error) {
                console.error('Error parsing data:', error);
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
});


//graficos del slider
document.addEventListener('DOMContentLoaded', () => {
    const chartDataUrl = HOST + '/saber11/promedios_colombia_year';
    const sliderMin = document.getElementById('range-slider-min-saber11');
    const sliderMax = document.getElementById('range-slider-max-saber11');
    const minYearDisplay = document.getElementById('min-year-saber11');
    const maxYearDisplay = document.getElementById('max-year-saber11');
    const lineChartCtx = document.getElementById('lineChart-saber11').getContext('2d');
    const polarAreaChartCtx = document.getElementById('polarAreaChart-saber11').getContext('2d');

    let lineChart, polarAreaChart;

    function updateCharts(minYear, maxYear, data) {
        const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);
        const labels = Array.from(new Set(filteredData.map(d => d.year))).sort((a, b) => a - b);

        const getScores = (year, subject) => {
            const yearData = filteredData.filter(d => d.year == year);
            return yearData.reduce((sum, d) => sum + d[subject], 0) / yearData.length;
        };

        const globalScores = labels.map(year => getScores(year, 'promedio_global'));
        const englishScores = labels.map(year => getScores(year, 'promedio_ingles'));
        const mathScores = labels.map(year => getScores(year, 'promedio_matematicas'));
        const scienceScores = labels.map(year => getScores(year, 'promedio_c_naturales'));
        const historyScores = labels.map(year => getScores(year, 'promedio_sociales_ciudadanas'));
        const languageScores = labels.map(year => getScores(year, 'promedio_lectura_critica'));

        const datasets = [
            {
                label: 'Puntaje Global',
                data: globalScores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Inglés',
                data: englishScores,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Matemáticas',
                data: mathScores,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Ciencias Naturales',
                data: scienceScores,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Sociales y Ciudadanas',
                data: historyScores,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Lectura Crítica',
                data: languageScores,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }
        ];

        if (minYear === maxYear) {
            // Show polar area chart if minYear equals maxYear
            document.getElementById('polarAreaChart-saber11').style.display = 'block';
            document.getElementById('lineChart-saber11').style.display = 'none';

            const polarAreaLabels = datasets.map(dataset => dataset.label);
            const polarAreaData = datasets.map(dataset => dataset.data[0]);

            if (polarAreaChart) {
                polarAreaChart.data.labels = polarAreaLabels;
                polarAreaChart.data.datasets[0].data = polarAreaData;
                polarAreaChart.update();
            } else {
                polarAreaChart = new Chart(polarAreaChartCtx, {
                    type: 'polarArea',
                    data: {
                        labels: polarAreaLabels,
                        datasets: [{
                            data: polarAreaData,
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });
            }
        } else {
            // Show line chart
            document.getElementById('lineChart-saber11').style.display = 'block';
            document.getElementById('polarAreaChart-saber11').style.display = 'none';

            if (lineChart) {
                lineChart.data.labels = labels;
                lineChart.data.datasets = datasets;
                lineChart.update();
            } else {
                lineChart = new Chart(lineChartCtx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    }

    fetch(chartDataUrl)
        .then(response => response.json())
        .then(chartData => {
            const update = () => {
                let minYear = parseInt(sliderMin.value);
                let maxYear = parseInt(sliderMax.value);

                if (minYear > maxYear) {
                    sliderMax.value = minYear;
                    maxYear = minYear;
                }

                if (maxYear < minYear) {
                    sliderMin.value = maxYear;
                    minYear = maxYear;
                }

                minYearDisplay.textContent = minYear;
                maxYearDisplay.textContent = maxYear;
                updateCharts(minYear, maxYear, chartData);
            };

            sliderMin.addEventListener('input', (event) => {
                let minValue = parseInt(event.target.value);
                if (minValue > parseInt(sliderMax.value)) {
                    sliderMax.value = minValue;
                }
                update();
            });

            sliderMax.addEventListener('input', (event) => {
                let maxValue = parseInt(event.target.value);
                if (maxValue < parseInt(sliderMin.value)) {
                    sliderMin.value = maxValue;
                }
                update();
            });

            // Initialize chart with default year range
            update();
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
        });
});

let myChart11;

// Mostrar/ocultar secciones
document.addEventListener('DOMContentLoaded', () => {
    const saber11Button = document.getElementById('saber11-button');
    const saberProButton = document.getElementById('saberPro-button');
    const saber11Section = document.getElementById('saber11-section');
    const saberProSection = document.getElementById('saberPro-section');

    saber11Button.addEventListener('click', () => {
        saber11Section.style.display = 'block';
        saberProSection.style.display = 'none';
    });

    saberProButton.addEventListener('click', () => {
        saber11Section.style.display = 'none';
        saberProSection.style.display = 'block';
    });
});

// seleccionar departamento y consultar municipios
document.addEventListener('DOMContentLoaded', () => {
    const sliderMinPro = document.getElementById('range-slider-min-saber11');
    const sliderMaxPro = document.getElementById('range-slider-max-saber11');
    const consultarButton = document.getElementById('consultar-button11');
    const txtDepartamento11 = document.getElementById('txtDepartamento11');
    const filtros = document.querySelector('.filtros11');
    const grafico = document.querySelector('.grafico');
    let selectedDepartment = null;

    const carga = document.querySelector('.carga');

    // Ensure required elements are present in the DOM
    if (!sliderMinPro || !sliderMaxPro || !consultarButton || !txtDepartamento11 || !filtros) {
        console.error('Missing required elements in the DOM');
        return;
    }

    // Add click event listener to the consultar button
    consultarButton.addEventListener('click', fetchData);

    // Start grafica


    // Add click event listeners to map paths
    const paths11 = document.querySelectorAll('.delimPath11');
    
    paths11.forEach(path => {
        path.addEventListener('click', (event) => {
            const parentNode = event.target.parentNode;
            if (parentNode && parentNode.hasAttribute('xlink:title')) {
                const name = parentNode.getAttribute('xlink:title');
                selectedDepartment = name; // Update selectedDepartment when a department is clicked

                // Update the text and style of the department display element
                const texto = name;
                const estilo = "color: #0e3bcf; font-size: 30px; font-weight: bold; text-align: center;";
                txtDepartamento11.textContent = texto;
                txtDepartamento11.style = estilo;

                localStorage.setItem("Departamento", texto); // Store the selected department in localStorage
            } else {
                console.error('Parent node does not have xlink:title attribute');
            }
        });
    });

    function crearGrafica(data) {
        const canvas = document.getElementById('grafico');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            console.error('No se pudo obtener el contexto 2D del elemento <canvas>.');
            return;
        }
    
        const labels = data.map(d => d.year);
        const datasets = [
            {
                label: 'Puntaje Global',
                data: data.map(d => d.promedio_global),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Inglés',
                data: data.map(d => d.promedio_ingles),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Matemáticas',
                data: data.map(d => d.promedio_matematicas),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Ciencias Naturales',
                data: data.map(d => d.promedio_c_naturales),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Sociales y Ciudadanas',
                data: data.map(d => d.promedio_sociales_ciudadanas),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Lectura Crítica',
                data: data.map(d => d.promedio_lectura_critica),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }
        ];
    
        if (myChart11) {
            myChart11.destroy();
        }
    
        myChart11 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Año'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Puntaje'
                        }
                    }
                }
            }
        });
    }   


    // Function to manually parse the text data
    
    function fetchData() {
        // Ensure a department is selected before making the fetch request
        if (!selectedDepartment) {
            alert("Por favor, seleccione un departamento.");
            return;
        }
    
        const minYear = parseInt(sliderMinPro.value);
        const maxYear = parseInt(sliderMaxPro.value);
        const url_consulta = HOST + `/saber11/consulta_inicial?departamento=${selectedDepartment}&start=${minYear}&end=${maxYear}`;
    
        const municipiosList = document.getElementById('municipios-list');
        var municipioDefault = 0;
        const url_municipio = HOST + `/saber11/consulta_inicial/municipios`;
        
        municipiosList.style.display = 'block';
        
        const selectMcipios = document.getElementById('municipio');

        
        const visualizacionSelect = document.getElementById('filtros');
        visualizacionSelect.value = 'historico'
        
        carga.classList.remove('hidden')

        // Fetch data from the specified URL
        fetch(url_consulta, {mode: 'no-cors'})
            .then(response => response.text()) // Get response as text
            .then(textData => {
                console.log('Fetched text data:', textData);
                // Attempt to parse text data as JSON-like structure
                let data = textData;
                console.log('Parsed data:', data);
                filtros.classList.remove('hidden');
                grafico.classList.remove('hidden'); // Show the filters section
                // Update the charts or data here based on the parsed data
            })
            .catch(error => console.error('Error fetching data:', error))
            .then(() => {
                return fetch(url_municipio); // Fetch the municipalities data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching municipios');
                }
                return response.json();
            })
            .then(municipios => {
                console.log('Fetched municipios:', municipios);
                selectMcipios.innerHTML = ''; // Clear existing options
                
                // Add a default empty option
                const defaultOption = document.createElement('option');
                defaultOption.value = 'DEPARTAMENTO';
                defaultOption.text = 'DEPARTAMENTO';
                selectMcipios.appendChild(defaultOption);
                
                // Add the fetched municipios options
                for (var i = 0; i < municipios.length; i++) {
                    const nuevoElemento = municipios[i];
                    const newOption = document.createElement('option');
                    newOption.value = nuevoElemento; // Assuming municipio name or id is the value
                    newOption.text = nuevoElemento; // Assuming municipio name is the text
                    selectMcipios.appendChild(newOption); 
                }
                municipioDefault = municipios[0];
                console.log('Municipio default:', municipioDefault);
            })
            .then(() => {
                return fetch(HOST + `/saber11/consultas/${visualizacionSelect.value}?municipio=`); 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching datos default');
                }
                return response.json();
            })
            .then(textData => {
                console.log('Fetched text data:', textData);
                // Attempt to parse text data as JSON-like structure
                let data = textData;
                console.log('Parsed data:', data);
                crearGrafica(data);
                carga.classList.add('hidden');
            })
            .catch(error => console.error('Error:', error));
    }
});


// consulta por municipio y obtencion de datos

document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos
    const municipioSelect = document.getElementById('municipio');
    const visualizacionSelect = document.getElementById('filtros');
    const grafico = document.getElementById('grafico').getContext('2d');
    

    // Función para obtener datos de la API
    function fetchData(url, callback, json) {
        if (json) {
            fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching data:', error));
        } else {
            fetch(url)
            .then(response => response.text())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching data:', error));
        }
    }

    // Función para manejar cambios en el selector de municipios
    function handleMunicipioChange() {
        const municipio = municipioSelect.value;

        // Realizar consulta de municipios
        const urlMunicipio = HOST + `/saber11/consulta_municipio?municipio=${municipio}`;

        fetchData(urlMunicipio, function(data) {
            console.log('Datos de municipios:', data);
            // Procesar los datos de municipios si es necesario

            // Luego realizar la consulta según la visualización seleccionada
            handleSelectionChange();
        }, json=false);
    }

    // Función para manejar cambios en el selector de visualización
    function handleSelectionChange() {
        const municipio = municipioSelect.value;
        const visualizacion = visualizacionSelect.value;

        // Construir la URL de la API con los valores seleccionados
        const url = HOST + `/saber11/consultas/${visualizacion}?municipio=${municipio}`;

        fetchData(url, function(data) {
            console.log(`Datos de ${visualizacion} para ${municipio}:`, data);
            // Procesar los datos y actualizar la interfaz de usuario según sea necesario
            actualizarGrafica(data); 
        }, json=true);
    }

    // Adjuntar manejadores de eventos a los selectores y botón
    municipioSelect.addEventListener('change', handleMunicipioChange);
    visualizacionSelect.addEventListener('change', handleSelectionChange);

    // Obtener datos iniciales para llenar el selector de municipios
    // fetchData(HOST + `/saber11/consulta_municipio?municipio=${municipio}`, function(data) {
    //     data.forEach(municipio => {
    //         const option = document.createElement('option');
    //         option.value = municipio;
    //         option.textContent = municipio;
    //         municipioSelect.appendChild(option);
    //     });

    
    // });

        
    function actualizarGrafica(data) {
        const tipoVisualizacion = visualizacionSelect.value;
        let labels;
        let datasets;

        if (tipoVisualizacion === 'historico') {
            labels = data.map(d => d.year);
            datasets = [
                {
                    label: 'Puntaje Global',
                    data: data.map(d => d.promedio_global),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Inglés',
                    data: data.map(d => d.promedio_ingles),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Matemáticas',
                    data: data.map(d => d.promedio_matematicas),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Ciencias Naturales',
                    data: data.map(d => d.promedio_c_naturales),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Sociales y Ciudadanas',
                    data: data.map(d => d.promedio_sociales_ciudadanas),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Lectura Crítica',
                    data: data.map(d => d.promedio_lectura_critica),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ];
        } else if (tipoVisualizacion === 'estrato') {
            const estratos = data.map(d => d.Estrato);
            labels = estratos;
            datasets = [
                {
                    label: 'Puntaje Global',
                    data: data.map(d => d.promedio_global),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Inglés',
                    data: data.map(d => d.promedio_ingles),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Matemáticas',
                    data: data.map(d => d.promedio_matematicas),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Ciencias Naturales',
                    data: data.map(d => d.promedio_c_naturales),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Sociales y Ciudadanas',
                    data: data.map(d => d.promedio_sociales_ciudadanas),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Lectura Crítica',
                    data: data.map(d => d.promedio_lectura_critica),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ];
        }

        if (myChart11) {
            myChart11.destroy()
        }

        const chartType = tipoVisualizacion === 'historico' ? 'line' : 'bar';

        myChart11 = new Chart(grafico, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: tipoVisualizacion === 'historico' ? 'Año' : 'Estrato'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Promedio Global'
                        }
                    }
                }
            }
        });
    };
});


//SABERPRO

//color del mapa
document.addEventListener('DOMContentLoaded', () => {
    const dataUrlPro = HOST + '/saberpro/promedios_departamento_year';
    const paths11 = document.querySelectorAll('.delimPathPro');
    const sliderMinPro = document.getElementById('range-slider-min-saberpro');
    const sliderMaxPro = document.getElementById('range-slider-max-saberpro');
    const minYearDisplayPro = document.getElementById('min-year-saberpro');
    const maxYearDisplayPro = document.getElementById('max-year-saberpro');
    const popupPro = document.getElementById('txtDepartamentoPro');
    let selectedPrueba = 'promedio_c_ciudadana';

    function getColorPro(value) {
        const colors = ['#E60202', '#E66F00', '#E69D00', '#E6CB00', '#58E600'];
        if (value < 110) return colors[0];
        if (value < 135) return colors[1];
        if (value < 150) return colors[2];
        if (value < 185) return colors[3];
        return colors[4];
    }

    function updateColorsPro(minYear, maxYear, data) {
        paths11.forEach(path => {
            const departmentName = path.parentNode.getAttribute('xlink:title');
            if (!departmentName) return;
            const departmentData = data.filter(d => d.departamento === departmentName && parseInt(d.year) >= minYear && parseInt(d.year) <= maxYear);
            if (departmentData.length > 0) {
                const totalValue = departmentData.reduce((sum, d) => sum + parseFloat(d[selectedPrueba]), 0);
                const averageValue = totalValue / departmentData.length;
                path.style.fill = getColorPro(averageValue);
            } else {
                path.style.fill = '#ccc';
            }
        });
    }

    function updateChartPro(minYear, maxYear, data) {
            const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);
            const labels = Array.from(new Set(filteredData.map(d => d.year))).sort((a, b) => a - b);
            const getScores = (year, subject) => {
                const yearData = filteredData.filter(d => d.year == year);
                return yearData.reduce((sum, d) => sum + d[subject], 0) / yearData.length;
            
            };
    }

    fetch(dataUrlPro)
        .then(response => response.json())
        .then(dataPro => {
            const updatePro = () => {
                let minYear = parseInt(sliderMinPro.value);
                let maxYear = parseInt(sliderMaxPro.value);

                if (minYear > maxYear) {
                    sliderMaxPro.value = minYear;
                    maxYear = minYear;
                }

                if (maxYear < minYear) {
                    sliderMinPro.value = maxYear;
                    minYear = maxYear;
                }

                minYearDisplayPro.textContent = minYear;
                maxYearDisplayPro.textContent = maxYear;
                updateColorsPro(minYear, maxYear, dataPro);
                updateChartPro(minYear, maxYear, dataPro);
            };

            sliderMinPro.addEventListener('input', (event) => {
                let minValue = parseInt(event.target.value);
                if (minValue > parseInt(sliderMaxPro.value)) {
                    sliderMaxPro.value = minValue;
                }
                updatePro();
            });

            sliderMaxPro.addEventListener('input', (event) => {
                let maxValue = parseInt(event.target.value);
                if (maxValue < parseInt(sliderMinPro.value)) {
                    sliderMinPro.value = maxValue;
                }
                updatePro();
            });

            

            updatePro();

            document.querySelectorAll('.button-pro').forEach(button => {
                button.addEventListener('click', (event) => {
                    selectedPrueba = event.target.value;
                    updatePro();
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            popupPro.innerHTML = `<p>Error al cargar los datos: ${error.message}</p>`;
        });
});


//graficos del slider
document.addEventListener('DOMContentLoaded', () => {
    const chartDataUrlPro = HOST + '/saberpro/promedios_colombia_year';
    const sliderMinPro = document.getElementById('range-slider-min-saberpro');
    const sliderMaxPro = document.getElementById('range-slider-max-saberpro');
    const minYearDisplayPro = document.getElementById('min-year-saberpro');
    const maxYearDisplayPro = document.getElementById('max-year-saberpro');
    const lineChartCtxPro = document.getElementById('lineChart-saberpro').getContext('2d');
    const polarAreaChartCtxPro = document.getElementById('polarAreaChart-saberpro').getContext('2d');

    let lineChartPro, polarAreaChartPro;

    function updateChartsPro(minYear, maxYear, data) {
        const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);
        const labels = Array.from(new Set(filteredData.map(d => d.year))).sort((a, b) => a - b);

        const getScoresPro = (year, subject) => {
            const yearData = filteredData.filter(d => d.year == year);
            return yearData.reduce((sum, d) => sum + parseFloat(d[subject]), 0) / yearData.length;
        };

        const promedio_c_ciudadana = labels.map(year => getScoresPro(year, 'promedio_c_ciudadana'));
        const promedio_comuni_escrita = labels.map(year => getScoresPro(year, 'promedio_comuni_escrita'));
        const promedio_ingles = labels.map(year => getScoresPro(year, 'promedio_ingles'));
        const promedio_lectura_critica = labels.map(year => getScoresPro(year, 'promedio_lectura_critica'));
        const promedio_razona_cuantitativo = labels.map(year => getScoresPro(year, 'promedio_razona_cuantitativo'));

        const datasetsPro = [
            {
                label: 'Puntaje Ciencias Ciudadanas',
                data: promedio_c_ciudadana,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Comunicacion Escrita',
                data: promedio_comuni_escrita,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Ingles',
                data: promedio_ingles,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Lectura Critica',
                data: promedio_lectura_critica,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Razonamiento Cuantitativo',
                data: promedio_razona_cuantitativo,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1
            },
        ];

        if (minYear === maxYear) {
            // Hide line chart and show polar area chart
            document.getElementById('lineChart-saberpro').style.display = 'none';
            document.getElementById('polarAreaChart-saberpro').style.display = 'block';

            const polarAreaLabelsPro = datasetsPro.map(dataset => dataset.label);
            const polarAreaDataPro = datasetsPro.map(dataset => dataset.data[0]);

            if (polarAreaChartPro) {
                polarAreaChartPro.data.labels = polarAreaLabelsPro;
                polarAreaChartPro.data.datasets[0].data = polarAreaDataPro;
                polarAreaChartPro.update();
            } else {
                polarAreaChartPro = new Chart(polarAreaChartCtxPro, {
                    type: 'polarArea',
                    data: {
                        labels: polarAreaLabelsPro,
                        datasets: [{
                            data: polarAreaDataPro,
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });
            }
        } else {
            // Hide polar area chart and show line chart
            document.getElementById('lineChart-saberpro').style.display = 'block';
            document.getElementById('polarAreaChart-saberpro').style.display = 'none';

            if (lineChartPro) {
                lineChartPro.data.labels = labels;
                lineChartPro.data.datasets = datasetsPro;
                lineChartPro.update();
            } else {
                lineChartPro = new Chart(lineChartCtxPro, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: datasetsPro
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    }

    fetch(chartDataUrlPro)
        .then(response => response.json())
        .then(chartDataPro => {
            const updatePro = () => {
                let minYear = parseInt(sliderMinPro.value);
                let maxYear = parseInt(sliderMaxPro.value);

                if (minYear > maxYear) {
                    sliderMaxPro.value = minYear;
                    maxYear = minYear;
                }

                if (maxYear < minYear) {
                    sliderMinPro.value = maxYear;
                    minYear = maxYear;
                }

                minYearDisplayPro.textContent = minYear;
                maxYearDisplayPro.textContent = maxYear;
                updateChartsPro(minYear, maxYear, chartDataPro);
            };

            sliderMinPro.addEventListener('input', (event) => {
                let minValue = parseInt(event.target.value);
                if (minValue > parseInt(sliderMaxPro.value)) {
                    sliderMaxPro.value = minValue;
                }
                updatePro();
            });

            sliderMaxPro.addEventListener('input', (event) => {
                let maxValue = parseInt(event.target.value);
                if (maxValue < parseInt(sliderMinPro.value)) {
                    sliderMinPro.value = maxValue;
                }
                updatePro();
            });

            // Initialize chart with default year range
            updatePro();
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
        });
});

// seleccionar departamento y consultar municipios
let myChartPro;
document.addEventListener('DOMContentLoaded', () => {
    const sliderMinPro = document.getElementById('range-slider-min-saberpro');
    const sliderMaxPro = document.getElementById('range-slider-max-saberpro');
    const consultarButtonPro = document.getElementById('consultar-buttonPro');
    const txtDepartamentoPro = document.getElementById('txtDepartamentoPro');
    const filtrosPro = document.querySelector('.filtrosPro');
    const graficoPro = document.querySelector('.graficoPro');
    let selectedDepartment = null;

    const carga = document.querySelector('.carga');

    // Ensure required elements are present in the DOM
    if (!sliderMinPro || !sliderMaxPro || !consultarButtonPro || !txtDepartamentoPro || !filtrosPro) {
        console.error('Missing required elements in the DOM');
        return;
    }

    // Add click event listener to the consultar button
    consultarButtonPro.addEventListener('click', fetchDataPro);

    // Add click event listeners to map paths
    const pathsPro = document.querySelectorAll('.delimPathPro');
    
    pathsPro.forEach(path => {
        path.addEventListener('click', (event) => {
            const parentNode = event.target.parentNode;
            if (parentNode && parentNode.hasAttribute('xlink:title')) {
                const name = parentNode.getAttribute('xlink:title');
                selectedDepartment = name; // Update selectedDepartment when a department is clicked

                // Update the text and style of the department display element
                const texto = name;
                const estilo = "color: #0e3bcf; font-size: 30px; font-weight: bold; text-align: center;";
                txtDepartamentoPro.textContent = texto;
                txtDepartamentoPro.style = estilo;

                localStorage.setItem("Departamento", texto); // Store the selected department in localStorage
            } else {
                console.error('Parent node does not have xlink:title attribute');
            }
        });
    });

    function crearGraficaPro(data) {
        const canvas = document.getElementById('graficoPro');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            console.error('No se pudo obtener el contexto 2D del elemento <canvas>.');
            return;
        }
    
        const labels = data.map(d => d.year);
        const datasets = [
            {
                label: 'Puntaje Ciencias Ciudadanas',
                data: data.map(d => d.promedio_c_ciudadana),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Comunicacion Escrita',
                data: data.map(d => d.promedio_comuni_escrita),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Ingles',
                data: data.map(d => d.promedio_ingles),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Lectura Critica',
                data: data.map(d => d.promedio_lectura_critica),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Razonamiento Cuantitativo',
                data: data.map(d => d.promedio_razona_cuantitativo),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }
        ];
    
        if (myChartPro) {
            myChartPro.destroy();
        }
    
        myChartPro = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Año'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Puntaje'
                        }
                    }
                }
            }
        });
    }   

    function fetchDataPro() {
        // Ensure a department is selected before making the fetch request
        if (!selectedDepartment) {
            alert("Por favor, seleccione un departamento.");
            return;
        }
    
        const minYear = parseInt(sliderMinPro.value);
        const maxYear = parseInt(sliderMaxPro.value);
        const url_consulta = HOST + `/saberpro/consulta_inicial?departamento=${selectedDepartment}&start=${minYear}&end=${maxYear}`;
    
        const municipiosList = document.getElementById('municipios-list');
        var municipioDefault = 0;
        const url_municipio = HOST + `/saberpro/consulta_inicial/municipios`;
        
        municipiosList.style.display = 'block';
        
        const selectMcipios = document.getElementById('municipioP');
        const visualizacionSelect = document.getElementById('filtrosP');
        visualizacionSelect.value = 'historico';
    
        carga.classList.remove('hidden');
        
        fetch(url_consulta, {mode: 'no-cors'})
            .then(response => response.text())
            .then(textData => {
                console.log('Fetched text data:', textData);
                console.log('Parsed data:', data);
                filtrosPro.classList.remove('hidden');
                graficoPro.classList.remove('hidden');
                // crearGraficaPro(data);
            })
            .catch(error => console.error('Error fetching data:', error))
            .then(() => {
                return fetch(url_municipio);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching municipios');
                }
                return response.json();
            })
            .then(municipios => {
                console.log('Fetched municipios:', municipios);
                selectMcipios.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.value = 'DEPARTAMENTO';
                defaultOption.text = 'DEPARTAMENTO';
                selectMcipios.appendChild(defaultOption);
                
                municipios.forEach(municipio => {
                    const newOption = document.createElement('option');
                    newOption.value = municipio;
                    newOption.text = municipio;
                    selectMcipios.appendChild(newOption); 
                });
                municipioDefault = municipios[0];
                console.log('Municipio default:', municipioDefault);
            })
            .then(() => {
                return fetch(HOST + `/saberpro/consultas/${visualizacionSelect.value}?municipio=`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching datos default');
                }
                return response.json();
            })
            .then(textData => {
                console.log('Fetched text data:', textData);
                let data = textData;
                console.log('Parsed data:', data);
                crearGraficaPro(data);
                carga.classList.add('hidden');
            })
            .catch(error => console.error('Error:', error));
    }
});

// consulta por municipio y obtencion de datos
document.addEventListener('DOMContentLoaded', function() {
    const municipioSelect = document.getElementById('municipioP');
    const visualizacionSelect = document.getElementById('filtrosP');
    const graficoPro = document.getElementById('graficoPro').getContext('2d');

    function fetchData(url, callback, json) {
        if (json) {
            fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching data:', error));
        } else {
            fetch(url)
            .then(response => response.text())
            .then(data => callback(data))
            .catch(error => console.error('Error fetching data:', error));
        }
    }

    function handleMunicipioChange() {
        const municipio = municipioSelect.value;
        const urlMunicipio = HOST + `/saberpro/consulta_municipio?municipio=${municipio}`;

        fetchData(urlMunicipio, function(data) {
            console.log('Datos de municipios:', data);
            handleSelectionChange();
        }, json=false);
    }

    function handleSelectionChange() {
        const municipio = municipioSelect.value;
        const visualizacion = visualizacionSelect.value;
        const url = HOST + `/saberpro/consultas/${visualizacion}?municipio=${municipio}`;

        fetchData(url, function(data) {
            console.log(`Datos de ${visualizacion} para ${municipio}:`, data);
            actualizarGraficaPro(data);
        }, json=true);
    }

    municipioSelect.addEventListener('change', handleMunicipioChange);
    visualizacionSelect.addEventListener('change', handleSelectionChange);

    function actualizarGraficaPro(data) {
        const tipoVisualizacion = visualizacionSelect.value;
        let labels;
        let datasets;

        if (tipoVisualizacion === 'historico') {
            labels = data.map(d => d.year);
            datasets = [
                {
                    label: 'Puntaje Ciencias Ciudadanas',
                    data: data.map(d => d.promedio_c_ciudadana),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Comunicacion Escrita',
                    data: data.map(d => d.promedio_comuni_escrita),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Ingles',
                    data: data.map(d => d.promedio_ingles),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Lectura Critica',
                    data: data.map(d => d.promedio_lectura_critica),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Razonamiento Cuantitativo',
                    data: data.map(d => d.promedio_razona_cuantitativo),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ];
        } else if (tipoVisualizacion === 'estrato') {
            const estratos = data.map(d => d.Estrato);
            labels = estratos;
            datasets = [
                {
                    label: 'Puntaje Ciencias Ciudadanas',
                    data: data.map(d => d.promedio_c_ciudadana),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Comunicacion Escrita',
                    data: data.map(d => d.promedio_comuni_escrita),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Ingles',
                    data: data.map(d => d.promedio_ingles),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Lectura Critica',
                    data: data.map(d => d.promedio_lectura_critica),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Puntaje Razonamiento Cuantitativo',
                    data: data.map(d => d.promedio_razona_cuantitativo),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ];
        }

        if (myChartPro) {
            myChartPro.destroy();
        }

        const chartType = tipoVisualizacion === 'historico' ? 'line' : 'bar';

        myChartPro = new Chart(graficoPro, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: tipoVisualizacion === 'historico' ? 'Año' : 'Estrato'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Puntaje'
                        }
                    }
                }
            }
        });
    }
});




var colegiosData = [];

function updateMunicipios() {
    var depto = document.getElementById("COLE_DEPTO_UBICACION").value;
    fetch(`http://181.236.87.123:5000/predict/get_municipios/${depto}`)
        .then(response => response.json())
        .then(data => {
            var municipioSelect = document.getElementById("COLE_MCIO_UBICACION");
            municipioSelect.innerHTML = "";
            if (Array.isArray(data)) {
                data.forEach(function(municipio) {
                    var option = document.createElement("option");
                    option.value = municipio.cole_mcpio_ubicacion;
                    option.text = municipio.cole_mcpio_ubicacion;
                    municipioSelect.add(option);
                });
                updateEstuMpios();
                updateColegios();
            } else {
                var option = document.createElement("option");
                option.value = "";
                option.text = "No hay municipios disponibles";
                municipioSelect.add(option);
            }
        });
        updateEstuDeptos(); 
}

function updateColegios() {
    var depto = document.getElementById("COLE_DEPTO_UBICACION").value;
    var municipio = document.getElementById("COLE_MCIO_UBICACION").value;
    fetch(`http://181.236.87.123:5000/predict/get_colegio/${depto}/${municipio}`)
        .then(response => response.json())
        .then(data => {
            colegiosData = data;  // Guardar la data para usarla después
            var colegioSelect = document.getElementById("COLE_NOMBRE_ESTABLECIMIENTO");
            colegioSelect.innerHTML = "";
            if (Array.isArray(data)) {
                data.forEach(function(colegio) {
                    var option = document.createElement("option");
                    option.value = colegio.COLE_NOMBRE_ESTABLECIMIENTO;
                    option.text = colegio.COLE_NOMBRE_ESTABLECIMIENTO;
                    colegioSelect.add(option);
                });
            } else {
                var option = document.createElement("option");
                option.value = "";
                option.text = "No hay colegios disponibles";
                colegioSelect.add(option);
            }
        });
}

function updateCodigoDane() {
    var colegioSelect = document.getElementById("COLE_NOMBRE_ESTABLECIMIENTO");
    var selectedColegio = colegioSelect.value;
    var codDaneSelect = document.getElementById("COLE_COD_DANE_ESTABLECIMIENTO");
    

    var colegio = colegiosData.find(function(c) {
        return c.COLE_NOMBRE_ESTABLECIMIENTO === selectedColegio;
    });

    if (colegio) {
        codDaneSelect.innerHTML = `<option value="${colegio.COLE_COD_DANE_ESTABLECIMIENTO}">${colegio.COLE_COD_DANE_ESTABLECIMIENTO}</option>`;
    } else {
        codDaneSelect.innerHTML = `<option value="">Selecciona un colegio primero</option>`;
    }
}

function updateEstuDeptos() {
    var deptoSelect = document.getElementById("COLE_DEPTO_UBICACION");
    var estuDeptoSelect = document.getElementById("ESTU_DEPTO_PRESENTACION");
    estuDeptoSelect.innerHTML = deptoSelect.innerHTML;
    estuDeptoSelect.value = deptoSelect.value;
}

function updateEstuMpios() {
    var mpioSelect = document.getElementById("COLE_MCIO_UBICACION");
    var estuMpioSelect = document.getElementById("ESTU_MCIO_PRESENTACION");
    estuMpioSelect.innerHTML = mpioSelect.innerHTML;
    estuMpioSelect.value = mpioSelect.value;
}

function hacerPrediccion() {
    
    var carga = document.querySelector(".carga");

    carga.classList.remove('hidden')

    var texto_pred = document.getElementById('prediccion-texto')

    var modal = document.getElementById("myPrediction");

    var span = document.getElementsByClassName("close_predict")[0];



    var data = {
        PERIODO: document.getElementById("PERIODO").value,
        COLE_AREA_UBICACION: document.getElementById("COLE_AREA_UBICACION").value,
        COLE_NATURALEZA: document.getElementById("COLE_NATURALEZA").value,
        COLE_COD_DANE_ESTABLECIMIENTO: document.getElementById("COLE_COD_DANE_ESTABLECIMIENTO").value,
        COLE_DEPTO_UBICACION: document.getElementById("COLE_DEPTO_UBICACION").value,
        COLE_MCIO_UBICACION: document.getElementById("COLE_MCIO_UBICACION").value,
        COLE_NOMBRE_ESTABLECIMIENTO: document.getElementById("COLE_NOMBRE_ESTABLECIMIENTO").value,
        ESTU_DEPTO_PRESENTACION: document.getElementById("ESTU_DEPTO_PRESENTACION").value,
        ESTU_MCIO_PRESENTACION: document.getElementById("ESTU_MCIO_PRESENTACION").value,
        ESTU_FECHANACIMIENTO: document.getElementById("ESTU_FECHANACIMIENTO").value,
        ESTU_GENERO: document.getElementById("ESTU_GENERO").value,
        FAMI_ESTRATOVIVIENDA: document.getElementById("FAMI_ESTRATOVIVIENDA").value
    };

    fetch('http://181.236.87.123:5001/makepredict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // alert('Predicción realizada: ' + JSON.stringify(result));
        modal.style.display = "block";
        texto = 'Puntaje Predicho: ' + JSON.stringify(result['data'])
        texto_pred.textContent = texto

        carga.classList.add('hidden')
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error realizando la predicción');
    });

    // Cuando el usuario hace clic en <span> (x), cierra el modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Cuando el usuario hace clic en cualquier parte fuera del modal, cierra el modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el modal
    var modal = document.getElementById("myModal");

    // Obtener el <span> que cierra el modal
    var span = document.getElementsByClassName("close")[0];

    // Mostrar el modal automáticamente al cargar la página
    modal.style.display = "block";

    // Cuando el usuario hace clic en <span> (x), cierra el modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Cuando el usuario hace clic en cualquier parte fuera del modal, cierra el modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});


