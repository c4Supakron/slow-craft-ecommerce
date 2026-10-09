# Storefront & Order Management Context

Domain model and ubiquitous language for the e-commerce storefront and store management.

## Language

**Product**:
A physical item available for purchase, containing title, description, price, category, stock count, and image URL. Each product represents a single SKU without sub-variant matrices.
_Avoid_: Item, Good, Article

**Stock**:
The current available quantity of a product that can be purchased. When stock reaches 0, the product becomes Out of Stock and cannot be added to the cart.
_Avoid_: Quantity available, Inventory level

**Cart**:
A temporary collection of products and quantities selected by a customer prior to checkout.
_Avoid_: Basket, Bag

**Order**:
A confirmed purchase record containing line items, customer shipping information, total payment amount, payment method, and status.
_Avoid_: Transaction, Purchase, Invoice

**Customer**:
A person placing an order through the storefront as a guest without requiring an account.
_Avoid_: User, Client, Buyer

**Shipping Address**:
The physical destination details (recipient name, phone number, address) provided by the customer for order delivery.
_Avoid_: Delivery location, Customer address

**Payment Method**:
The mode of settlement chosen by the customer during checkout (PromptPay QR or Cash on Delivery).
_Avoid_: Billing option, Payment channel

**Shipping Fee**:
The delivery surcharge applied to an order, calculated as a flat rate (50 THB) or waived (0 THB free shipping) when the order meets the qualifying spending threshold (500 THB).
_Avoid_: Delivery cost, Freight charge
