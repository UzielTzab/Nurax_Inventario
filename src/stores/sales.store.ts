import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Sale {
  id: string;
  date: Date;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([
    {
      id: 'TRX-9821',
      date: new Date(),
      items: [{ name: 'Audífonos Inalámbricos', quantity: 1 }],
      total: 199.00,
      status: 'completed'
    },
    {
      id: 'TRX-9822',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // Ayer
      items: [{ name: 'Smartwatch Fit 2', quantity: 1 }],
      total: 429.98,
      status: 'completed'
    },
    {
      id: 'TRX-9823',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // Hace 3 dias
      items: [{ name: 'Laptop Pro 15"', quantity: 1 }],
      total: 1299.99,
      status: 'completed'
    }
  ]);

  const addSale = (saleData: { items: Array<{ name: string; quantity: number }>; total: number }) => {
    const newSale: Sale = {
      id: `TRX-${Math.floor(Math.random() * 10000)}`,
      date: new Date(),
      status: 'completed',
      ...saleData
    };
    sales.value.unshift(newSale); // Agregar al principio
  };

  const weeklyData = computed(() => {
    // Array para Lunes-Domingo
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const data = days.map(day => ({ day, amount: 0 }));

    // Obtener inicio de semana (Lunes)
    const now = new Date();
    const currentDay = now.getDay() || 7; // 1 (Lun) a 7 (Dom)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    sales.value.forEach(sale => {
      const date = new Date(sale.date);
      // Solo contar ventas de esta semana (o posteriores, aunque futuras no debería haber)
      if (date >= startOfWeek) {
        // Encontrar índice correcto para Lunes=0 ... Domingo=6
        // getDay(): Dom=0, Lun=1 ... Sab=6
        // Queremos Lun=0 ... Dom=6.
        // (day + 6) % 7 funciona:
        // Lun(1) -> 7 % 7 = 0
        // Dom(0) -> 6 % 7 = 6
        const dayIndex = (date.getDay() + 6) % 7; 
        if (dayIndex >= 0 && dayIndex < 7 && data[dayIndex]) {
            data[dayIndex]!.amount += sale.total;
        }
      }
    });

    return data;
  });

  // Modal State
  const isModalOpen = ref(false);

  const openModal = () => {
    console.log('SalesStore: Opening modal');
    isModalOpen.value = true;
  };

  const closeModal = () => {
    console.log('SalesStore: Closing modal');
    isModalOpen.value = false;
  };

  return { sales, addSale, weeklyData, isModalOpen, openModal, closeModal };
});
