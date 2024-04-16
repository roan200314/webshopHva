/**
 * Handles token related functionality
 */
export class TokenService {
    /**
     * Store the current JWT token in local storage
     * 
     * @param token The current JWT token
     */
    public setToken(token: string): void {
        localStorage.setItem("token", token);
    }

    /**
     * Retrieve the stored JWT token from local storage
     * 
     * @returns JWT token when successful, otherwise `undefined`.
     */
    public getToken(): string | undefined {
        return localStorage.getItem("token") || undefined;
    }

    /**
     * Remove the JWT token from local storage
     */
    public removeToken(): void {
        return localStorage.removeItem("token");
    }
}