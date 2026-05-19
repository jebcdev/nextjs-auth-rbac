export const consoleLogger = (error: unknown) => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
        console.info(error);
    }
};
