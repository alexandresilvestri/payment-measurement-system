export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDocument = (document: string): string => {
  if (!document) return ''

  // Remove all non-digit characters
  const digitsOnly = document.replace(/\D/g, '')

  // CPF format: 000.000.000-00 (11 digits)
  if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // CNPJ format: 00.000.000/0000-00 (14 digits)
  if (digitsOnly.length === 14) {
    return digitsOnly.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    )
  }

  // Return original if not CPF or CNPJ
  return document
}
