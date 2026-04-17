export const getErrorMessage =
    (err, fallback) =>
        err.response?.data?.detail
        ?? err.response?.data?.message
        ?? fallback;