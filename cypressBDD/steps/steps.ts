import { AuthApi } from "../api/AuthApi";
import { PurchaseAPI } from "../api/purchaseAPI";
import { LoginPage } from "../pages/web/LoginPage";
import { PurchasePage } from "../pages/web/PurchasePage";

export const loginPage = new LoginPage();
export const purchasePage = new PurchasePage();
export const authApi = new AuthApi();
export const purchaseApi = new PurchaseAPI(authApi);

export const steps = {
    loginPage,
    purchasePage,
    authApi,
    purchaseApi,
};
