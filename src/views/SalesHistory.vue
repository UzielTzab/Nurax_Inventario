<template>
  <DashboardLayout>
    <div class="sales-history-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Historial de Ventas</h1>
          <p class="page-subtitle">Visualiza tus ingresos y transacciones</p>
        </div>
        <div class="date-filter">
          <select v-model="selectedPeriod" class="form-select">
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon income-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3>Ingresos de Hoy</h3>
            <p class="stat-value">${{ formatMoney(todayIncome) }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon sales-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div class="stat-content">
            <h3>Ventas Totales</h3>
            <p class="stat-value">{{ salesCount }}</p>
            <p class="stat-subtitle">Transacciones realizadas</p>
          </div>
        </div>
      </div>

      <!-- Weekly Trend Chart -->
      <div class="chart-section">
        <h3>Tendencia Semanal</h3>
        <div class="chart-container">
           <Line 
             v-if="chartData" 
             :data="chartData" 
             :options="chartOptions" 
           />
        </div>
      </div>

      <!-- Sales Table -->
      <div class="transactions-section">
        <h3>Transacciones Recientes</h3>
        <div class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>ID Transacción</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredSales" :key="sale.id">
                <td>{{ formatTime(sale.date) }}</td>
                <td class="font-mono text-xs">{{ sale.id }}</td>
                <td>
                  <div class="product-preview">
                    {{ sale.items[0]?.name || 'Producto desconocido' }}
                    <span v-if="sale.items.length > 1" class="more-items">+{{ sale.items.length - 1 }} más</span>
                  </div>
                </td>
                <td class="font-bold text-gray-900">${{ formatMoney(sale.total) }}</td>
                <td>
                  <span class="status-badge success">Completado</span>
                </td>
                <td>
                   <button class="btn-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                       <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                     </svg>
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useSalesStore } from '@/stores/sales.store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { storeToRefs } from 'pinia';
const salesStore = useSalesStore();
const selectedPeriod = ref('today');

// Access store state via getters or computed using storeToRefs for guaranteed reactivity
const { sales, weeklyData } = storeToRefs(salesStore);

// Format Helpers
const formatMoney = (amount: number) => {
  return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

// Filtered Sales Logic
// Filtered Sales Logic
const filteredSales = computed(() => {
  const now = new Date();
  
  // Helper to compare dates ignoring time
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  
  const startOfWeek = new Date(now);
  const day = now.getDay() || 7;
  if(day !== 1) startOfWeek.setHours(-24 * (day - 1)); else startOfWeek.setHours(0,0,0,0);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return sales.value.filter(sale => {
    const saleDate = new Date(sale.date);
    
    if (selectedPeriod.value === 'today') {
      return isSameDay(saleDate, now);
    } else if (selectedPeriod.value === 'yesterday') {
      // Check if it is yesterday (same day as startOfYesterday)
      return isSameDay(saleDate, startOfYesterday);
    } else if (selectedPeriod.value === 'week') {
      return saleDate >= startOfWeek;
    } else if (selectedPeriod.value === 'month') {
      return saleDate >= startOfMonth;
    }
    return true;
  });
});

// Stats
const todayIncome = computed(() => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return sales.value
      .filter(s => new Date(s.date) >= startOfDay)
      .reduce((sum, s) => sum + s.total, 0);
});

const salesCount = computed(() => filteredSales.value.length);

// Chart Configuration
const chartData = computed(() => {
  return {
    labels: weeklyData.value.map(d => d.day),
    datasets: [
      {
        label: 'Ventas ($)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue 500
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        borderColor: '#3B82F6',
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: weeklyData.value.map(d => d.amount),
        fill: true,
        tension: 0.4
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#F9FAFB',
      bodyColor: '#F9FAFB',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#F3F4F6'
      },
      ticks: {
        callback: function(value: any) {
          return '$' + value;
        },
        color: '#9CA3AF',
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 11
        }
      },
      border: {
        display: false
      }
    }
  }
};
</script>

<style scoped>
.sales-history-container {
  padding: 1rem;
  max-width: 100%;
  margin: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  color: #6B7280;
  margin-top: 0.25rem;
}

.form-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 1px solid #E5E7EB;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.income-icon {
  background: #ECFDF5;
  color: #10B981;
}

.sales-icon {
  background: #EFF6FF;
  color: #3B82F6;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E7EB;
  margin-bottom: 2rem;
}

.chart-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.chart-container {
  height: 320px;
  width: 100%;
  position: relative;
}

.transactions-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E7EB;
}

.transactions-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.transactions-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.transactions-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  border-bottom: 1px solid #E5E7EB;
}

.transactions-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #F3F4F6;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.success {
  background: #ECFDF5;
  color: #10B981;
}

.product-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.more-items {
  font-size: 0.75rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.25rem;
}

.btn-icon:hover {
  color: #3B82F6;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .sales-history-container {
    padding: 1rem;
  }
}
</style>
