import { APIRequestContext, expect } from "@playwright/test";

export class AuthApi {
    constructor(private request: APIRequestContext) {}

    async login(username: string, password: string) {
        return this.request.post("/api/auth/login",{
            data:{
                username: username, 
                password: password, 
                rememberMe: false
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}