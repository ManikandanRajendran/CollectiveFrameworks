import { Page } from "@playwright/test";

export const ROUTES = {
    login: '/#/login',
    products: '/#/products',
    cart: '/#/cart',
    checkout: '/#/checkout',
} as const;

export class BasePage{
    constructor(protected readonly page : Page){}

    async navigateTo(url: string){
        await this.page.goto(url);
    }
}