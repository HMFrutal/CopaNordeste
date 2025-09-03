/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * sem problemas de fuso horário
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  
  // Se a data já está no formato DD/MM/YYYY, retorna como está
  if (dateString.includes('/')) {
    return dateString;
  }
  
  // Para formato YYYY-MM-DD, converte manualmente para evitar problemas de timezone
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Converte uma data do formato DD/MM/YYYY para YYYY-MM-DD
 * para uso em inputs do tipo date
 */
export function formatDateInput(dateString: string): string {
  if (!dateString) return '';
  
  // Se já está no formato YYYY-MM-DD, retorna como está
  if (dateString.includes('-') && dateString.length === 10) {
    return dateString;
  }
  
  // Para formato DD/MM/YYYY, converte para YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}