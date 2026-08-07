import { Page } from "@playwright/test";

export async function mockLoginFailure(page: Page, message: string) {
    await page.route("**/api/auth/login", async (route) => {
        await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
                success: false,
                message,
            }),
        })
    })
}