const fetch_wrapper = {
    get
}

const fetchHeaders = () => {
    return {
        'accept': 'application/json'
    }
}

function handleResponse(response: Response): Promise<any> {
    return new Promise((resolve, reject) => {
        //      200-299,
        if (response.ok) {
            //     JSON
            if (response?.status !== 204) {
                response.json().then(data => resolve(data)).catch(() => resolve(response.text()));
            } else response.json().then(data => resolve(data)).catch(() => resolve(response));
        } else {
            switch (response.status) {
                case 400:
                    reject('Bad Request');
                    break;
                case 403:
                    reject('Forbidden');
                    break;
                case 404:
                    reject('Not Found');
                    break;
                case 422:
                    response.json().then(data => reject(data)).catch(() => reject('Unprocessable Entity'));
                    break;
                case 500:
                    reject('Internal Server Error');
                    break;
                default:
                    reject('An unknown error occurred.');
            }
        }
    });
}

function get(url: string) {
    const params = {
        method: "GET",
        headers: fetchHeaders(),
    };
    return fetch(`http://localhost:8080/api/v2/${url}`, params).then(handleResponse).catch(error => console.log('Error:', error))
}


export const queries = {
    list: async (): Promise<any> => {
        return await fetch_wrapper.get(`last-name`)
    },
    result: async ({name, step, from, to}: { name: string, step: string, from: string, to: string }): Promise<any> => {
        return await fetch_wrapper.get(`solve-ode?lastName=${name}&h=${step}&from=${from}&to=${to}`)
    },
}
