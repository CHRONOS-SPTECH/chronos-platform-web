/**
 * Valida se uma string é um email válido (simples).
 * @param {string} email - O email a ser validado
 * @returns {boolean} - true se parece válido, false caso contrário
 */
export function isValidEmail(email) {
    return email.includes('@') && email.includes('.') && email.length > 5;
};
