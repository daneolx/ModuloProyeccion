/**
 * Datos de tasas de interés (TREA) de la SBS Perú
 * Basado en información de: https://www.sbs.gob.pe/app/retasas/paginas/retasasInicio.aspx?p=D
 * 
 * NOTA: Estos datos son de ejemplo. En producción, deberían obtenerse de una API
 * o actualizarse periódicamente desde la fuente oficial de la SBS.
 */

export const accountTypes = {
  'caja_ahorro': {
    id: 'caja_ahorro',
    name: 'Caja de Ahorro',
    description: 'Cuenta de ahorro tradicional'
  },
  'cuenta_ahorro': {
    id: 'cuenta_ahorro',
    name: 'Cuenta de Ahorro',
    description: 'Cuenta de ahorro estándar'
  },
  'deposito_plazo': {
    id: 'deposito_plazo',
    name: 'Depósito a Plazo Fijo',
    description: 'Depósito con plazo determinado'
  }
};

export const financialInstitutions = {
  bancos: [
    { id: 'bcp', name: 'Banco de Crédito del Perú (BCP)', code: 'BCP' },
    { id: 'bbva', name: 'BBVA Perú', code: 'BBVA' },
    { id: 'interbank', name: 'Interbank', code: 'INTERBANK' },
    { id: 'scotiabank', name: 'Scotiabank Perú', code: 'SCOTIABANK' },
    { id: 'banco_nacion', name: 'Banco de la Nación', code: 'BN' },
    { id: 'banco_pichincha', name: 'Banco Pichincha', code: 'PICHINCHA' },
    { id: 'banco_ripley', name: 'Banco Ripley', code: 'RIPLEY' },
    { id: 'banco_santander', name: 'Banco Santander', code: 'SANTANDER' }
  ],
  financieras: [
    { id: 'financiera_credinka', name: 'Financiera Credinka', code: 'CREDINKA' },
    { id: 'financiera_edpyme', name: 'EDPYME Alternativa', code: 'EDPYME' },
    { id: 'financiera_mibanco', name: 'MiBanco', code: 'MIBANCO' }
  ]
};

/**
 * Tasas TREA por tipo de cuenta y entidad financiera
 * Valores en porcentaje anual (ej: 2.5 = 2.5%)
 * 
 * NOTA: Estos son valores de ejemplo. Los valores reales deben obtenerse
 * de la SBS o actualizarse periódicamente.
 */
export const treaRates = {
  caja_ahorro: {
    bcp: 2.5,
    bbva: 2.3,
    interbank: 2.4,
    scotiabank: 2.2,
    banco_nacion: 2.0,
    banco_pichincha: 2.6,
    banco_ripley: 2.1,
    banco_santander: 2.3,
    financiera_credinka: 3.0,
    financiera_edpyme: 3.2,
    financiera_mibanco: 2.8
  },
  cuenta_ahorro: {
    bcp: 2.8,
    bbva: 2.6,
    interbank: 2.7,
    scotiabank: 2.5,
    banco_nacion: 2.3,
    banco_pichincha: 2.9,
    banco_ripley: 2.4,
    banco_santander: 2.6,
    financiera_credinka: 3.3,
    financiera_edpyme: 3.5,
    financiera_mibanco: 3.1
  },
  deposito_plazo: {
    bcp: 4.5,
    bbva: 4.3,
    interbank: 4.4,
    scotiabank: 4.2,
    banco_nacion: 4.0,
    banco_pichincha: 4.6,
    banco_ripley: 4.1,
    banco_santander: 4.3,
    financiera_credinka: 5.0,
    financiera_edpyme: 5.2,
    financiera_mibanco: 4.8
  }
};

/**
 * Obtiene la TREA para un tipo de cuenta y entidad financiera
 * @param {string} accountType - Tipo de cuenta (caja_ahorro, cuenta_ahorro, deposito_plazo)
 * @param {string} institutionId - ID de la entidad financiera
 * @returns {number|null} TREA en porcentaje o null si no existe
 */
export function getTREA(accountType, institutionId) {
  if (!treaRates[accountType]) {
    return null;
  }
  return treaRates[accountType][institutionId] || null;
}

/**
 * Obtiene todas las entidades financieras disponibles
 * @returns {Array} Array con todas las entidades
 */
export function getAllInstitutions() {
  return [
    ...financialInstitutions.bancos,
    ...financialInstitutions.financieras
  ];
}

/**
 * Obtiene las entidades financieras filtradas por tipo
 * @param {string} type - 'bancos' o 'financieras'
 * @returns {Array} Array de entidades
 */
export function getInstitutionsByType(type) {
  return financialInstitutions[type] || [];
}

/**
 * Obtiene información completa de una entidad
 * @param {string} institutionId - ID de la entidad
 * @returns {Object|null} Información de la entidad o null
 */
export function getInstitutionInfo(institutionId) {
  const allInstitutions = getAllInstitutions();
  return allInstitutions.find(inst => inst.id === institutionId) || null;
}

/**
 * Obtiene información completa de un tipo de cuenta
 * @param {string} accountTypeId - ID del tipo de cuenta
 * @returns {Object|null} Información del tipo de cuenta o null
 */
export function getAccountTypeInfo(accountTypeId) {
  return accountTypes[accountTypeId] || null;
}

