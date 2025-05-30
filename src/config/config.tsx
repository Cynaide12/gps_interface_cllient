interface Config{
    api: string;
}

export const config: Config = {
    api: import.meta.env.VITE_API_BASE_URL
}