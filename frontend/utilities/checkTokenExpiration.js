export const isTokenExpired = (tokenExp) => {
    const tokenExpirationDate = new Date(tokenExp * 1000);
    const todayDate = new Date();
    return tokenExpirationDate <= todayDate;
};