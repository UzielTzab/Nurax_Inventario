<template>
  <DashboardLayout>
    <div class="sales-history-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Historial de Ventas</h1>
          <p class="page-subtitle">Visualiza tus ingresos y transacciones</p>
        </div>
      </div>


      <!-- Stats Cards -->
      <div class="stats-grid">
          <StatsCard
            label="Ingresos de Hoy"
            :value="formatMoney(todayIncome) + ' MXN'"
            subtitle="Calculado hoy"
            :icon="CurrencyDollarIcon"
            icon-type="success"
          />
        
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
      <!-- Charts Grid -->
      <div class="charts-grid-section">
        <!-- Weekly Trend Chart -->
        <div class="chart-card">
          <h3>Tendencia Semanal</h3>
          <div class="chart-container">
             <Line 
               v-if="chartData" 
               :data="chartData" 
               :options="chartOptions" 
             />
          </div>
        </div>

        <!-- Top Products Chart -->
        <div class="chart-card">
          <h3>Top 3 Productos Más Vendidos</h3>
          <div class="chart-container">
             <Bar
               v-if="barChartData"
               :data="barChartData"
               :options="barChartOptions"
             />
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="transactions-section">
        <div class="transactions-header">
          <h3>Registro de ventas</h3>
          
          <div class="transactions-header-controls">
            <!-- Filtro de período (Pills y Custom Dates) -->
            <div class="period-filter-section">
              <div class="period-pills">
                <button 
                  class="period-pill" 
                  :class="{ active: selectedPeriod === 'today' }"
                  @click="selectedPeriod = 'today'">
                  Hoy
                </button>
                <button 
                  class="period-pill" 
                  :class="{ active: selectedPeriod === 'yesterday' }"
                  @click="selectedPeriod = 'yesterday'">
                  Ayer
                </button>
                <button 
                  class="period-pill" 
                  :class="{ active: selectedPeriod === 'last7days' }"
                  @click="selectedPeriod = 'last7days'">
                  Últimos 7 días
                </button>
                <button 
                  class="period-pill" 
                  :class="{ active: selectedPeriod === 'custom' }"
                  @click="selectedPeriod = 'custom'">
                  Personalizado
                  <svg xmlns="http://www.w3.org/2000/svg" class="calendar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              
              <div class="custom-dates" v-if="selectedPeriod === 'custom'">
                <div class="date-input-group">
                  <label>Desde:</label>
                  <input type="date" v-model="customStartDate" class="date-input" />
                </div>
                <span class="date-separator">-</span>
                <div class="date-input-group">
                  <label>Hasta:</label>
                  <input type="date" v-model="customEndDate" class="date-input" />
                </div>
              </div>
            </div>

            <!-- Buscador y Monto -->
            <div class="search-amount-section">
              <div class="search-wrapper shadow-sm">
                <svg class="search-icon-bar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input-bar compact"
                  placeholder="Buscar ID o producto..."
                />
                <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''" title="Limpiar búsqueda">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="amount-filter shadow-sm">
                <div class="amount-input-wrapper">
                  <span class="amount-currency">$</span>
                  <input
                    v-model.number="minAmount"
                    type="number"
                    min="0"
                    step="100"
                    class="amount-input compact"
                    placeholder="Mínimo"
                  />
                </div>
              </div>
            </div>

            <!-- Indicador de resultados globales -->
            <div class="results-info-compact" v-if="searchQuery || minAmount > 0 || selectedPeriod !== 'today'">
              <span class="results-count">{{ filteredSales.length }} resultados</span>
              <button class="clear-all-btn" @click="searchQuery = ''; minAmount = 0; selectedPeriod = 'today'; customStartDate = ''; customEndDate = ''">Restablecer</button>
            </div>
          </div>
        </div>
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
              <template v-for="sale in paginatedSales" :key="sale.id">
                <!-- Fila principal -->
                <tr class="main-row" :class="{ 'row-expanded': expandedRows.has(sale.id) }">
                  <td>{{ formatTime(sale.created_at) }}</td>
                  <td class="font-mono text-xs trx-id">{{ sale.transaction_id }}</td>

                  <!-- Columna de productos con cantidades -->
                  <td>
                    <div class="product-summary">
                      <span class="product-first">
                        <span class="qty-pill">{{ sale.items[0]?.quantity ?? 1 }}×</span>
                        {{ sale.items[0]?.product_name || 'Producto desconocido' }}
                      </span>
                      <span v-if="sale.items.length > 1" class="more-items">
                        +{{ sale.items.length - 1 }} producto{{ sale.items.length - 1 !== 1 ? 's' : '' }} más
                      </span>
                    </div>
                  </td>

                  <td class="total-cell">${{ formatMoney(Number(sale.total)) }}</td>
                  <td>
                    <span class="status-badge success">Completado</span>
                  </td>
                  <td>
                    <button
                      class="btn-icon"
                      :class="{ 'btn-icon-active': expandedRows.has(sale.id) }"
                      :title="expandedRows.has(sale.id) ? 'Ocultar detalle' : 'Ver detalle'"
                      @click="toggleDetail(sale.id)"
                    >
                      <!-- Ojo normal -->
                      <svg v-if="!expandedRows.has(sale.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <!-- Ojo cerrado (expandido) -->
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <!-- Fila de detalle expandible -->
                <Transition name="detail-row">
                  <tr v-if="expandedRows.has(sale.id)" class="detail-row">
                    <td colspan="6">
                      <div class="detail-content">
                        <div class="detail-header">
                          <p class="detail-label">Detalle de productos vendidos:</p>
                          <button class="btn-reprint" @click="printSaleTicket(sale)" title="Reimprimir ticket">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            Reimprimir Ticket
                          </button>
                        </div>
                        <div class="detail-items">
                          <div
                            v-for="(item, idx) in sale.items"
                            :key="idx"
                            class="detail-item"
                          >
                            <span class="detail-qty">{{ item.quantity ?? 1 }}×</span>
                            <span class="detail-name">{{ item.product_name }}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Transition>
              </template>
            </tbody>
          </table>
        </div>
        
        <!-- Paginación usando el componente reutilizable -->
        <Pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredSales.length"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { useSalesStore } from '@/stores/sales.store';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline';

import type { Sale } from '@/stores/sales.store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';

import { Line, Bar } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { storeToRefs } from 'pinia';
const salesStore = useSalesStore();
const selectedPeriod = ref('today');
const customStartDate = ref('');
const customEndDate = ref('');

onMounted(() => {
  salesStore.fetchSales();
});

// ── Búsqueda y filtros ──
const searchQuery = ref('');
const minAmount = ref(0);

// ── Paginación ──
const currentPage = ref(1);
const pageSize = ref(10);

// Control de filas expandidas
const expandedRows = ref(new Set<number>());
const toggleDetail = (id: number) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id);
  } else {
    expandedRows.value.add(id);
  }
  // Force reactivity on Set
  expandedRows.value = new Set(expandedRows.value);
};

// Access store state via getters or computed using storeToRefs for guaranteed reactivity
const { sales, weeklyData } = storeToRefs(salesStore);

// Format Helpers
const formatMoney = (amount: number | string) => {
  return Number(amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ── Reimprimir ticket desde historial ──
const printSaleTicket = (sale: Sale) => {
  const printWindow = window.open('', '', 'height=600,width=400');
  if (!printWindow) return;

  const ticketHtml = `
    <html>
      <head>
        <title>Ticket #${sale.id}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; font-size: 14px; max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .company { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
          .info { font-size: 12px; }
          .items { width: 100%; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .item-name { flex: 1; margin-right: 10px; }
          .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          .reprint { text-align:center; font-size:11px; color:#666; margin-top:8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">NOMBRE DE LA EMPRESA</div>
          <div class="info">
            <p>${formatDateTime(sale.created_at)}</p>
            <p>Ticket ${sale.id}</p>>
          </div>
        </div>
        <div class="items">
          ${sale.items.map(item => `
            <div class="item-row">
              <span class="item-name">${item.quantity ?? 1}x ${item.product_name}</span>
            </div>
          `).join('')}
        </div>
        <div class="total">
          <span>TOTAL</span>
          <span>$${formatMoney(Number(sale.total))}</span>
        </div>
        <div class="footer"><p>¡Gracias por su compra!</p></div>
        <div class="reprint">— REIMPRESIÓN —</div>
      </body>
    </html>
  `;

  printWindow.document.write(ticketHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
};


// ── Filtered Sales Logic ──
const filteredSales = computed(() => {
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOf7Days = new Date(startOfDay);
  startOf7Days.setDate(startOf7Days.getDate() - 6);

  const q = searchQuery.value.toLowerCase().trim();

  return sales.value.filter(sale => {
    const saleDate = new Date(sale.created_at);

    // 1. Filtro de período
    let passesPeriod = true;
    if (selectedPeriod.value === 'today') passesPeriod = isSameDay(saleDate, now);
    else if (selectedPeriod.value === 'yesterday') passesPeriod = isSameDay(saleDate, startOfYesterday);
    else if (selectedPeriod.value === 'last7days') passesPeriod = saleDate >= startOf7Days;
    else if (selectedPeriod.value === 'custom') {
      if (customStartDate.value) {
        const start = new Date(customStartDate.value + 'T00:00:00');
        if (saleDate < start) passesPeriod = false;
      }
      if (customEndDate.value) {
        const end = new Date(customEndDate.value + 'T23:59:59');
        if (saleDate > end) passesPeriod = false;
      }
    }
    if (!passesPeriod) return false;

    // 2. Filtro de búsqueda por ID o nombre de producto
    if (q) {
      const matchesId = String(sale.id).toLowerCase().includes(q) || sale.transaction_id?.toLowerCase().includes(q);
      const matchesProduct = sale.items.some(item => item.product_name?.toLowerCase().includes(q));
      if (!matchesId && !matchesProduct) return false;
    }

    // 3. Filtro de monto mínimo
    if (minAmount.value > 0 && Number(sale.total) < minAmount.value) return false;

    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

// Reiniciar a la página 1 cuando cambien los filtros
watch([searchQuery, selectedPeriod, customStartDate, customEndDate, minAmount], () => {
  currentPage.value = 1;
});

// ── Paginated Sales Logic ──
const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredSales.value.slice(start, end);
});

// Stats
const todayIncome = computed(() => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return sales.value
      .filter(s => new Date(s.created_at) >= startOfDay)
      .reduce((sum, s) => sum + Number(s.total), 0);
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
        tension: 0
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
      title: { display: true, text: 'Ventas (MXN)', color: '#9CA3AF', font: { weight: 'bold' as const } },
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
      title: { display: true, text: 'Días de la semana', color: '#9CA3AF', font: { weight: 'bold' as const } },
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

// Top Products Logic
const topProducts = computed(() => {
  const productCounts: Record<string, number> = {};
  
  filteredSales.value.forEach(sale => {
    // Check if items exists and is an array to be safe
    if (Array.isArray(sale.items)) {
      sale.items.forEach(item => {
        const qty = item.quantity || 1;
        productCounts[item.product_name] = (productCounts[item.product_name] || 0) + qty;
      });
    }
  });

  return Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
});

const barChartData = computed(() => {
  return {
    labels: topProducts.value.map(p => p.name),
    datasets: [
      {
        label: 'Unidades',
        backgroundColor: [
          '#06402b', // Forest Green (1st)
          '#22c55e', // Mint (2nd)
          '#86efac'  // Light Mint (3rd)
        ],
        borderRadius: 8,
        borderSkipped: false,
        data: topProducts.value.map(p => p.count),
        barThickness: 40
      }
    ]
  };
});

const barChartOptions: ChartOptions<'bar'> = {
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
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    y: {
      title: { display: true, text: 'Unidades vendidas', color: '#9CA3AF', font: { weight: 'bold' as const } },
      beginAtZero: true,
      grid: {
        color: '#F3F4F6'
      },
      ticks: {
        stepSize: 1,
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
      title: { display: true, text: 'Nombres de los Productos', color: '#9CA3AF', font: { weight: 'bold' as const } },
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 11,
          weight: 'bold'
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
  background: var(--color-card-stats-fill);
  padding: 1.75rem 2rem;
  max-width: 100%;
  min-height: 100vh;
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
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
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
  display: flex;
  align-items: center;
  gap: 1.25rem;
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

.charts-grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}



.chart-container {
  flex: 1;
  width: 100%;
  position: relative;
  min-height: 250px;
}

.transactions-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
}

.transactions-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.transactions-header-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.search-amount-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .transactions-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .transactions-header-controls {
    align-items: flex-end;
  }
  
  .search-amount-section {
    justify-content: flex-end;
  }
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.transactions-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  padding-top: 0.5rem;
}

/* ── Filtros de Píldoras (Pills) ── */
.period-filter-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.period-pills {
  display: inline-flex;
  background-color: #F8FAFC;
  border-radius: 9999px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.period-pill {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.period-pill:hover {
  color: #0F172A;
}

.period-pill.active {
  background-color: #004D40; /* Verde oscuro basado en la imagen */
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-icon {
  width: 16px;
  height: 16px;
}

/* ── Inputs Fechas Personalizadas ── */
.custom-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.date-input-group label {
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 500;
}

.date-input {
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  cursor: pointer;
}

.date-separator {
  color: #CBD5E1;
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

/* ── Columna de productos ── */
.product-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-first {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #374151;
}

.qty-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #EFF6FF;
  color: #2563EB;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 99px;
  flex-shrink: 0;
}

.more-items {
  font-size: 0.72rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Total ── */
.total-cell {
  font-weight: 700;
  color: #111827;
}

/* ── TRX ID ── */
.trx-id {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: #6B7280;
  letter-spacing: 0.02em;
}

/* ── Fila principal ── */
.main-row {
  transition: background 0.15s ease;
}
.main-row.row-expanded {
  background: #F8FAFF;
}
.main-row.row-expanded td {
  border-bottom: none;
}

/* ── Botón ojo ── */
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.35rem;
  border-radius: 8px;
  transition: all 0.15s ease;
  display: flex;
}

.btn-icon:hover {
  background: #EFF6FF;
  color: #2563EB;
}

.btn-icon-active {
  background: #EFF6FF;
  color: #2563EB;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

/* ── Fila de detalle ── */
.detail-row td {
  padding: 0;
  background: #F8FAFF;
  border-bottom: 2px solid #E0E8FF;
}

.detail-content {
  padding: 0.875rem 1.25rem 1rem 1.5rem;
  border-left: 3px solid #3B82F6;
  margin-left: 0.5rem;
}

.detail-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.5rem 0;
}

.detail-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #374151;
}

.detail-qty {
  font-weight: 700;
  color: #2563EB;
  font-size: 0.8rem;
}

.detail-name {
  color: #1F2937;
}

/* ── Animación fila detalle ── */
.detail-row-enter-active,
.detail-row-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.detail-row-enter-from,
.detail-row-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}


.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── Buscador y Monto Compacto ── */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.search-icon-bar {
  position: absolute;
  left: 0.75rem;
  width: 16px;
  height: 16px;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input-bar.compact {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.25rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;
  background-color: white;
}

.search-input-bar.compact:focus {
  border-color: #004D40;
  box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.1);
}

.search-input-bar::placeholder {
  color: #94A3B8;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.clear-search:hover {
  color: #64748B;
}

.clear-search svg {
  width: 14px;
  height: 14px;
}

.amount-filter {
  display: flex;
  align-items: center;
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-currency {
  position: absolute;
  left: 0.75rem;
  color: #64748B;
  font-size: 0.875rem;
  pointer-events: none;
}

.amount-input.compact {
  width: 110px;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.amount-input.compact:focus {
  border-color: #004D40;
  box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.1);
}

.results-info-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.results-count {
  color: #64748B;
  font-weight: 500;
}

.clear-all-btn {
  color: #EF4444;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
}

.clear-all-btn:hover {
  text-decoration: underline;
  color: #DC2626;
}

/* ── Detalle Header y Botón Reimprimir ── */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.btn-reprint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: #ffffff;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.btn-reprint:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
  color: #111827;
}

.btn-reprint svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .sales-history-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .date-filter, .form-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid, .charts-grid-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-card {
    min-width: 100%;
    padding: 1rem;
  }
  
  .transactions-table {
    font-size: 0.75rem;
  }
  
  .transactions-table th, .transactions-table td {
    padding: 0.75rem 0.5rem;
    white-space: nowrap;
  }
}
</style>
