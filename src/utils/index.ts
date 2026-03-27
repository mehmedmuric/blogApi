export const genUsername = (): string => {
    const usernamePrefix = 'user';
    const randomChars = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters

    const username = usernamePrefix + randomChars;

    return username
}