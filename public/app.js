/**
 * Aplicación frontend para el Módulo de Efecto de la Inflación sobre el Ahorro
 * Maneja la interfaz de usuario y comunicación con la API
 */

class InflationCalculator {
    constructor() {
        this.form = document.getElementById('inflationForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.errorSection = document.getElementById('errorSection');
        
        this.initializeEventListeners();
        this.loadExampleData();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        // Remover clases de error previas
        input.classList.remove('error');
        
        if (input.value && (value < min || value > max)) {
            input.classList.add('error');
            this.showInputError(input, `El valor debe estar entre ${min} y ${max}`);
        } else {
            this.hideInputError(input);
        }
    }

    showInputError(input, message) {
        let errorElement = input.parentNode.querySelector('.input-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            errorElement.style.color = 'var(--danger-color)';
            errorElement.style.fontSize = '0.75rem';
            errorElement.style.marginTop = '0.25rem';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    hideInputError(input) {
        const errorElement = input.parentNode.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            this.hideError();
            
            const formData = new FormData(this.form);
            const data = {
                amount_nominal: parseFloat(formData.get('amount_nominal')),
                inflation_rate: parseFloat(formData.get('inflation_rate')),
                years: parseFloat(formData.get('years')),
                granularity: formData.get('granularity') || 'none'
            };
            
            // Validación básica del frontend
            this.validateFormData(data);
            
            const response = await fetch('/api/v1/inflation/effect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error en el servidor');
            }
            
            this.displayResults(result.data);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    validateFormData(data) {
        if (!data.amount_nominal || data.amount_nominal <= 0) {
            throw new Error('El monto nominal debe ser mayor a cero');
        }
        if (!data.inflation_rate || data.inflation_rate < 0 || data.inflation_rate > 100) {
            throw new Error('La tasa de inflación debe estar entre 0 y 100%');
        }
        if (!data.years || data.years <= 0) {
            throw new Error('El número de años debe ser mayor a cero');
        }
    }

    displayResults(data) {
        // Actualizar valores principales
        document.getElementById('realValue').textContent = this.formatCurrency(data.real_value);
        document.getElementById('absoluteLoss').textContent = this.formatCurrency(data.absolute_loss);
        document.getElementById('lossPercent').textContent = `${data.loss_percent.toFixed(2)}%`;
        
        // Generar resumen
        this.generateSummary(data);
        
        // Mostrar serie temporal si existe
        if (data.series && data.series.length > 0) {
            this.displayTimeSeries(data.series);
            this.createChart(data.series, data.amount_nominal);
        } else {
            this.hideTimeSeries();
        }
        
        this.showResults();
    }

    generateSummary(data) {
        const summaryElement = document.getElementById('summaryContent');
        const lossPercent = data.loss_percent;
        const realValue = data.real_value;
        const nominalAmount = data.amount_nominal;
        
        let summaryText = `
            <p><strong>Análisis realizado:</strong></p>
            <p>Con una tasa de inflación del <strong>${data.inflation_rate}%</strong> anual durante <strong>${data.years}</strong> años, 
            tu ahorro de <strong>${this.formatCurrency(nominalAmount)}</strong> tendrá un valor real de 
            <strong>${this.formatCurrency(realValue)}</strong>.</p>
        `;
        
        if (lossPercent > 0) {
            summaryText += `
                <p>Esto representa una <strong>pérdida de poder adquisitivo del ${lossPercent.toFixed(2)}%</strong>, 
                equivalente a <strong>${this.formatCurrency(data.absolute_loss)}</strong> en términos reales.</p>
            `;
        } else {
            summaryText += `<p>No hay pérdida de poder adquisitivo en este período.</p>`;
        }
        
        summaryText += `
            <p><em>Nota: Este cálculo asume una tasa de inflación constante durante todo el período.</em></p>
        `;
        
        summaryElement.innerHTML = summaryText;
    }

    displayTimeSeries(series) {
        const tableBody = document.getElementById('seriesTableBody');
        tableBody.innerHTML = '';
        
        series.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.t}</td>
                <td>${item.years.toFixed(2)}</td>
                <td>${this.formatCurrency(item.real_value)}</td>
                <td>${item.loss_percent.toFixed(2)}%</td>
            `;
            tableBody.appendChild(row);
        });
        
        document.getElementById('seriesSection').style.display = 'block';
    }

    hideTimeSeries() {
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('chartSection').style.display = 'none';
    }

    createChart(series, nominalAmount) {
        const canvas = document.getElementById('evolutionChart');
        const ctx = canvas.getContext('2d');
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configuración del gráfico
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Encontrar valores máximos y mínimos
        const maxValue = Math.max(nominalAmount, ...series.map(s => s.real_value));
        const minValue = Math.min(0, ...series.map(s => s.real_value));
        const valueRange = maxValue - minValue;
        
        // Función para convertir valor a coordenada Y
        const valueToY = (value) => {
            return padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        };
        
        // Función para convertir índice a coordenada X
        const indexToX = (index) => {
            return padding + (index / (series.length - 1)) * chartWidth;
        };
        
        // Dibujar ejes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Eje Y
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // Eje X
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Dibujar línea de valor nominal
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, valueToY(nominalAmount));
        ctx.lineTo(padding + chartWidth, valueToY(nominalAmount));
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Dibujar línea de valor real
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        series.forEach((item, index) => {
            const x = indexToX(index);
            const y = valueToY(item.real_value);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Dibujar puntos
        ctx.fillStyle = '#2563eb';
        series.forEach((item, index) => {
            const x = indexToX(index);
            const y = valueToY(item.real_value);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Dibujar etiquetas
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        // Etiquetas del eje X
        series.forEach((item, index) => {
            const x = indexToX(index);
            ctx.fillText(`Año ${item.t}`, x, padding + chartHeight + 20);
        });
        
        // Etiquetas del eje Y
        ctx.textAlign = 'right';
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const value = minValue + (i / ySteps) * valueRange;
            const y = valueToY(value);
            ctx.fillText(this.formatCurrency(value), padding - 10, y + 4);
        }
        
        // Leyenda
        ctx.textAlign = 'left';
        ctx.font = '14px Inter';
        
        // Valor nominal
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padding + chartWidth - 200, padding + 20, 15, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Valor Nominal', padding + chartWidth - 180, padding + 25);
        
        // Valor real
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(padding + chartWidth - 200, padding + 40, 15, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Valor Real', padding + chartWidth - 180, padding + 45);
        
        document.getElementById('chartSection').style.display = 'block';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    showLoading() {
        this.loadingSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
    }

    showResults() {
        this.resultsSection.style.display = 'block';
        this.errorSection.style.display = 'none';
        
        // Scroll suave a los resultados
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.errorSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        // Scroll suave al error
        this.errorSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    hideError() {
        this.errorSection.style.display = 'none';
    }

    loadExampleData() {
        // Cargar datos de ejemplo del informe
        document.getElementById('amount_nominal').value = '10000';
        document.getElementById('inflation_rate').value = '6.5';
        document.getElementById('years').value = '3';
        document.getElementById('granularity').value = 'yearly';
    }
}

// Funciones globales para uso en HTML
function hideError() {
    window.inflationCalculator.hideError();
}

function showExample() {
    window.inflationCalculator.loadExampleData();
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.inflationCalculator = new InflationCalculator();
    
    // Mostrar información de la API en consola
    console.log('💰 Módulo de Efecto de la Inflación sobre el Ahorro');
    console.log('📖 API disponible en: /api/v1/info');
    console.log('🚀 Desarrollado por: Anibal Huaman, Karen Medrano, David Cantorín, Sulmairy Garcia, Diego Arrieta');
});

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
});
