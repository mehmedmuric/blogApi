export const genUsername = (): string => {
    const usernamePrefix = 'user';
    const randomChars = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters

    const username = usernamePrefix + randomChars;

    return username
};




export const genSlug = (title: string): string => {
    const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .replace(/-{2,}/g, '-'); // Replace multiple hyphens with a single hyphen
    

    const randomChars = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters
    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug;
}