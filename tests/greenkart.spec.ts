import { test, expect } from '@playwright/test';

test.describe('GreenKart E2E Tests', () => {
  test('should search for a product and add it to the cart', async ({ page }) => {
    // Navigate to the site
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

    // Search for "Cucumber"
    const searchInput = page.locator('input.search-keyword');
    await searchInput.fill('Cucumber');
    
    // Wait for the filtered results to appear
    // The product card should be visible
    const product = page.locator('.products .product').filter({ hasText: 'Cucumber' });
    await expect(product).toBeVisible();
    await expect(product.locator('h4.product-name')).toContainText('Cucumber');

    // Add to Cart
    await product.getByRole('button', { name: 'ADD TO CART' }).click();

    // Verify button text changes to "ADDED"
    await expect(product.getByRole('button')).toHaveText('✔ ADDED');

    // Open Cart and Proceed
    await page.locator('a.cart-icon').click();
    
    // Check if the item is in the cart preview
    const cartPreview = page.locator('.cart-preview.active');
    await expect(cartPreview.locator('.product-name')).toContainText('Cucumber');
    
    await cartPreview.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();

    // Verify Checkout Page
    await expect(page).toHaveURL(/.*cart/);
    await expect(page.locator('td p.product-name')).toContainText('Cucumber');

    // Place Order
    await page.getByRole('button', { name: 'Place Order' }).click();
    
    // Select Country and Agree to Terms
    await page.locator('select').selectOption('India');
    await page.locator('input.chkAgree').check();
    await page.getByRole('button', { name: 'Proceed' }).click();

    // Final Confirmation
    await expect(page.locator('text=Order has been placed successfully')).toBeVisible();
  });

  test('should handle multiple products and verify total', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

    // Search for "ca" to get multiple results (e.g., Cauliflower, Carrot, Cashews)
    await page.locator('input.search-keyword').fill('ca');
    
    // Scoped to `.products .product` because the cart price-summary widget
    // (`.showPriceWrapper`) also carries the `.product` class outside that container.
    const products = page.locator('.products .product');
    await expect(products).toHaveCount(4); // Cauliflower, Carrot, Capsicum, Cashews

    // Add first two items
    await products.nth(0).getByRole('button', { name: 'ADD TO CART' }).click();
    await products.nth(1).getByRole('button', { name: 'ADD TO CART' }).click();

    // Verify cart count
    const cartCount = page.locator('.cart-info table tr:nth-child(1) td:nth-child(3) strong');
    await expect(cartCount).toHaveText('2');

    // Go to checkout and verify items
    await page.locator('a.cart-icon').click();
    await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    
    await expect(page.locator('tbody tr')).toHaveCount(2);
  });
});
