// export interface ApiRequestOptions{
//     method: "GET" | "POST" | "PUT" | "DELETE";
//     url: string;
//     body?: object;
//     headers?: object;
// }

export function ApiClient(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body?: object, headers?: object) {
    return cy.request({
        method: method,
        url: url,
        body: body,
        headers: headers,
    })
}