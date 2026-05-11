export const formatSaleFolio = (
  id?: string | number | null,
  transactionId?: string | number | null
) => {
  const rawId = id == null ? '' : String(id).trim();
  const rawTransactionId = transactionId == null ? '' : String(transactionId).trim();
  const source = rawId || rawTransactionId;

  if (!source) return '#NX-UNK';
  if (source.toUpperCase().startsWith('#NX-')) return source.toUpperCase();

  const uuidLike = source.includes('-') ? source : rawTransactionId;
  if (uuidLike && uuidLike.includes('-')) {
    const parts = uuidLike.split('-');
    const lastPart = parts[parts.length - 1] || '';
    return `#NX-${lastPart.slice(0, 6).toUpperCase()}`;
  }

  return `#NX-${source.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;
};
