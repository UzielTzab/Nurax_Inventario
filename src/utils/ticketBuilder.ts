/**
 * buildTicketHtml — Shared ticket HTML generator
 *
 * Produces a self-contained HTML string ready for window.open() + print().
 * The design matches the SaleSuccessModal preview exactly.
 *
 * @param opts.store   Store settings (name, logo, address, phone, ticket_message, currency_symbol)
 * @param opts.items   Array of { name, quantity, price }
 * @param opts.total   Total amount (number)
 * @param opts.ticketId  Sale / ticket identifier
 * @param opts.date    Formatted date string
 * @param opts.paperWidth  '58mm' | '80mm' | 'A4' (default '80mm')
 * @param opts.isReprint  Show "REIMPRESIÓN" footer badge
 */

export interface TicketItem {
  name: string;
  quantity: number;
  price: number | string;
}

export interface TicketStoreData {
  store_name: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  ticket_message?: string;
  currency_symbol?: string;
}

export type PaperWidth = '58mm' | '80mm' | 'A4';

export interface BuildTicketOptions {
  store: TicketStoreData;
  items: TicketItem[];
  total: number;
  ticketId: string | number;
  date: string;
  paperWidth?: PaperWidth;
  isReprint?: boolean;
  /** localStorage key to persist paper width preference */
}

// ─────────────────────────────────────────────────────────────────────────────
const PAPER_WIDTHS: Record<PaperWidth, string> = {
  '58mm': '58mm',
  '80mm': '80mm',
  'A4': '210mm',
};

export function buildTicketHtml(opts: BuildTicketOptions): string {
  const {
    store,
    items,
    total,
    ticketId,
    date,
    paperWidth = '80mm',
    isReprint = false,
  } = opts;

  const currency  = store.currency_symbol?.trim() || '$';
  const storeName = store.store_name || 'NOMBRE DEL NEGOCIO';
  const address   = store.address || '';
  const phone     = store.phone || '';
  const ticketMsg = store.ticket_message || '¡Gracias por su preferencia!';
  const logoUrl   = store.logo_url || '';
  const pageWidth = PAPER_WIDTHS[paperWidth] ?? '80mm';

  // ── Format barcode-like decoration (CSS only, no library needed) ──────────
  const barcodeHtml = `
    <div class="barcode">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 40" width="190" height="40">
        ${generateBarcodeSvg()}
      </svg>
    </div>
  `;

  // ── Items rows ─────────────────────────────────────────────────────────────
  const itemsHtml = items.map(item => {
    const lineTotal = (Number(item.price) * item.quantity).toFixed(2);
    return `
      <div class="item-row">
        <span class="item-qty-name">
          <span class="qty">${item.quantity}x</span>
          ${item.name}
        </span>
        <span class="item-price">${currency}${lineTotal}</span>
      </div>
    `;
  }).join('');

  // ── Ticket number formatted ───────────────────────────────────────────────
  const ticketNumFormatted = `NO. TICKET #${String(ticketId).padStart(6, '0')}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Ticket de Venta</title>
  <style>
    /* ── Paper size ── */
    @page {
      size: ${pageWidth} auto;
      margin: 4mm 6mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
      width: ${pageWidth === '210mm' ? '190mm' : pageWidth};
      max-width: ${pageWidth === '210mm' ? '190mm' : pageWidth};
      margin: 0 auto;
      background: #fff;
      color: #1a1a1a;
      font-size: ${paperWidth === '58mm' ? '11px' : '13px'};
    }

    /* ── Header ── */
    .header {
      text-align: center;
      padding: 16px 8px 12px;
      border-bottom: 1.5px dashed #d1d5db;
      margin-bottom: 12px;
    }

    .logo {
      margin-bottom: 10px;
    }

    .logo img {
      max-width: ${paperWidth === '58mm' ? '60px' : '80px'};
      max-height: ${paperWidth === '58mm' ? '40px' : '55px'};
      object-fit: contain;
    }

    .store-name {
      font-size: ${paperWidth === '58mm' ? '14px' : '17px'};
      font-weight: 700;
      color: #111;
      margin-bottom: 3px;
      letter-spacing: -0.3px;
    }

    .store-detail {
      font-size: ${paperWidth === '58mm' ? '10px' : '11.5px'};
      color: #6b7280;
      margin-top: 2px;
    }

    /* ── Items section ── */
    .items-section {
      padding: 0 4px;
      margin-bottom: 10px;
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      font-size: ${paperWidth === '58mm' ? '9px' : '10px'};
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #6b7280;
      text-transform: uppercase;
      padding: 5px 0;
      border-bottom: 1px dashed #e5e7eb;
      margin-bottom: 8px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 4px 0;
      gap: 8px;
    }

    .item-qty-name {
      flex: 1;
      font-size: ${paperWidth === '58mm' ? '11px' : '13px'};
    }

    .qty {
      color: #6b7280;
      margin-right: 4px;
      font-weight: 600;
    }

    .item-price {
      font-size: ${paperWidth === '58mm' ? '11px' : '13px'};
      font-weight: 500;
      white-space: nowrap;
    }

    /* ── Divider ── */
    .divider {
      border: none;
      border-top: 1.5px dashed #d1d5db;
      margin: 10px 0;
    }

    /* ── Total ── */
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 4px;
    }

    .total-label {
      font-size: ${paperWidth === '58mm' ? '15px' : '18px'};
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .total-amount {
      font-size: ${paperWidth === '58mm' ? '18px' : '22px'};
      font-weight: 800;
      color: #111;
    }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 12px 8px 6px;
      margin-top: 4px;
    }

    .thank-you {
      font-size: ${paperWidth === '58mm' ? '11px' : '13px'};
      font-style: italic;
      color: #374151;
      margin-bottom: 10px;
      padding: 0 8px;
    }

    .ticket-num {
      font-size: ${paperWidth === '58mm' ? '9px' : '10px'};
      letter-spacing: 0.1em;
      color: #9ca3af;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .barcode {
      margin-top: 4px;
      opacity: 0.6;
    }

    /* ── Reprint badge ── */
    .reprint-badge {
      text-align: center;
      margin-top: 8px;
      font-size: 9px;
      letter-spacing: 0.12em;
      color: #9ca3af;
      text-transform: uppercase;
      border-top: 1px dashed #e5e7eb;
      padding-top: 6px;
    }

    /* Date/time info line */
    .ticket-meta {
      font-size: ${paperWidth === '58mm' ? '10px' : '11px'};
      color: #9ca3af;
      margin-top: 6px;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    ${logoUrl ? `<div class="logo"><img src="${logoUrl}" alt="Logo" /></div>` : ''}
    <div class="store-name">${storeName}</div>
    ${address ? `<div class="store-detail">${address}</div>` : ''}
    ${phone   ? `<div class="store-detail">Tel: ${phone}</div>` : ''}
    <div class="ticket-meta">${date}</div>
  </div>

  <!-- Items -->
  <div class="items-section">
    <div class="items-header">
      <span>Cant. Artículo</span>
      <span>Total</span>
    </div>
    ${itemsHtml}
  </div>

  <hr class="divider" />

  <!-- Total -->
  <div class="total-row">
    <span class="total-label">TOTAL</span>
    <span class="total-amount">${currency}${total.toFixed(2)}</span>
  </div>

  <hr class="divider" />

  <!-- Footer -->
  <div class="footer">
    <div class="thank-you">"${ticketMsg}"</div>
    <div class="ticket-num">${ticketNumFormatted}</div>
    ${barcodeHtml}
    ${isReprint ? '<div class="reprint-badge">— Reimpresión —</div>' : ''}
  </div>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative barcode SVG (visual only, not scannable)
function generateBarcodeSvg(): string {
  const bars = [
    { x: 5, w: 3 }, { x: 11, w: 1 }, { x: 15, w: 2 }, { x: 20, w: 3 },
    { x: 26, w: 1 }, { x: 30, w: 2 }, { x: 35, w: 3 }, { x: 41, w: 1 },
    { x: 45, w: 2 }, { x: 50, w: 3 }, { x: 56, w: 1 }, { x: 60, w: 2 },
    { x: 65, w: 3 }, { x: 71, w: 1 }, { x: 75, w: 2 }, { x: 80, w: 3 },
    { x: 86, w: 1 }, { x: 90, w: 2 }, { x: 95, w: 3 }, { x: 101, w: 1 },
    { x: 105, w: 2 }, { x: 110, w: 3 }, { x: 116, w: 1 }, { x: 120, w: 2 },
    { x: 125, w: 3 }, { x: 131, w: 1 }, { x: 135, w: 2 }, { x: 140, w: 3 },
    { x: 146, w: 1 }, { x: 150, w: 2 }, { x: 155, w: 3 }, { x: 161, w: 1 },
    { x: 165, w: 2 }, { x: 170, w: 3 }, { x: 176, w: 1 }, { x: 180, w: 2 },
    { x: 185, w: 3 },
  ];
  return bars.map(b => `<rect x="${b.x}" y="2" width="${b.w}" height="36" fill="#1a1a1a" rx="0.5"/>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistence helpers for paper width preference (localStorage)
const PAPER_WIDTH_KEY = 'ticket_paper_width';

export function getStoredPaperWidth(): PaperWidth {
  const stored = localStorage.getItem(PAPER_WIDTH_KEY);
  if (stored === '58mm' || stored === '80mm' || stored === 'A4') return stored;
  return '80mm'; // default
}

export function savePaperWidth(width: PaperWidth): void {
  localStorage.setItem(PAPER_WIDTH_KEY, width);
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick print helper
export function openTicketPrint(html: string): void {
  const win = window.open('', '_blank', 'height=750,width=520');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}
