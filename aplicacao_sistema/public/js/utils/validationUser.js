/**
 * Verifica se o usuário está logado e tem as permissões necessárias.
 * @param {string[]} permissions - Array de roles permitidas (ex: ['student', 'volunteer'])
 * @returns {Object} - { isLoggedIn: boolean, hasPermission: boolean, user: Object|null }
 */

export function checkAuth(permissions = []) {
    permissions = permissions.map(perm => perm.toLowerCase());

    const storedUser = localStorage.getItem('chronos_user');

    if (!storedUser) {
        return { isLoggedIn: false, hasPermission: false, user: null };
    }
    try {
        const user = JSON.parse(storedUser);

        // Se não exigir permissões, apenas estar logado já basta
        if (permissions.length === 0) {
            return { isLoggedIn: true, hasPermission: true, user };
        }

        // Verifica se o tipo do usuário está entre as permissões
        const hasPermission = permissions.includes(user.tipo?.toLowerCase());

        return { isLoggedIn: true, hasPermission, user };

    } catch (error) {
        return { isLoggedIn: false, hasPermission: false, user: null };
    }
}

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
