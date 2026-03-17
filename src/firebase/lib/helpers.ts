interface AxiosErrorResponse {
    data: any;
    status: number;
    headers: any;
}

interface AxiosError {
    response?: AxiosErrorResponse;
    request?: any;
    toJSON?: () => any;
    message?: string;
}

export const errorHandler = (
    error: AxiosError | any,
    name: string,
    from?: string
): void => {
    const loggerFunction: (msg: any) => void = console.log;
    loggerFunction("---START---");
    loggerFunction("Error occured in " + name);

    if (from === "axios") {
        if (error.response) {
            // The request was made and the server responded with a status
// that falls out of the range of 2xx
            loggerFunction(error.response.data);
            loggerFunction(error.response.status);
            loggerFunction(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received / 'error. request' is an instance of XMLHttpRequest in the brov
// http.ClientRequest in node. js
            loggerFunction(error.request);
        } else {
            // Something happened in setting up the request that triggered loggerFunction ("Error", error .message);
        }
        if (typeof error.toJSON === 'function') {
            loggerFunction(error.toJSON());
        }
    } else {
        loggerFunction(error);
    }
    loggerFunction("---END---");
}