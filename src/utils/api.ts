export const url = 'http://localhost:3000/api/';

export const fetchData = async (path: string, method: string): Promise<any> => {
    return await fetch(url + path, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
}

export const postData = async (path: string, body: any): Promise<any> => {
    setTimeout(() => {
        return null;
    }, );
    return await fetch(url + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body),
    });
}