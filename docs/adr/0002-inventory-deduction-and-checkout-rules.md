# Immediate Inventory Deduction on Order Placement

All products are modeled as single-SKU records. When a customer confirms an order via the checkout flow, product stock is decremented immediately within the LocalStorage database to ensure consistent inventory counts. Items with zero available stock cannot be added to active shopping carts.
