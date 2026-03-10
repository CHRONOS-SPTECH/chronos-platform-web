/**
 * Verifica se o usuário está logado e tem as permissões necessárias.
 * @param {string[]} permissions - Array de roles permitidas (ex: ['student', 'volunteer'])
 * @returns {Object} - { isLoggedIn: boolean, hasPermission: boolean, user: Object|null }
 */

export function checkAuth(permissions = []) {
    const storedUser = localStorage.getItem('chronos_user');

    if (!storedUser) {
        return { isLoggedIn: false, hasPermission: false, user: null };
    }

    try {
        const user = JSON.parse(storedUser);

        // Se não exigir de permissões, mas estiver logado passa na validação 
        if (permissions.length === 0) {
            return { isLoggedIn: true, hasPermission: true, user };
        }

        // Verifica se as permissões do usuário está na lista permitida
        const hasPermission = permissions.includes(user.role);

        return { isLoggedIn: true, hasPermission, user };
    } catch (error) {
        return { isLoggedIn: false, hasPermission: false, user: null };
    }
};

/**
@param {string[]} permissions - Array de permissões permitidas 
@param {string} redirectUrl - URL para redirecionar se não autorizado
 */
export function checkPageAccess(permissions = [], redirectUrl = 'login.html') {
    const auth = checkAuth(permissions);

    if (!auth.isLoggedIn) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = redirectUrl;
        return false;
    } else if (!auth.hasPermission) {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = redirectUrl;
        return false;
    }

    return true;
};
