/**
 * @description Clears session storage and local storage for user session.
 */
export function removeSession(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('userSession');
    }
}
