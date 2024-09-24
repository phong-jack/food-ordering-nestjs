
# Food Ordering System with NestJS 🍔🍕🛵

This project is an online food ordering system built with NestJS, providing a platform to connect users, shop, and delivery drivers.

## Key Features:

### User Module:
- User registration, login, and account verification.
- Personal information management.
- Placing food orders from shop.
- Tracking order status.
- Rating and reviewing shop/dishes (not yet implemented).

### Restaurant Module:
- Restaurant information management.
- Adding, editing, and deleting dishes.
- Accepting orders from customers.
- Updating order status.
- Tracking sales statistics (not yet implemented).

### Driver Module:
- Receiving new orders.
- Accepting and updating delivery status.

### Order Module:
- Managing order information.
- Tracking order status (Created, Confirmed, Shipping, Completed, Canceled).
- Canceling orders (if no driver is found).

### Other Modules:
- **Auth Module**: Handles authentication using JWT.
- **Product Module**: Manages dish information.
- **Category Module**: Manages dish categories.
- **Setting Module**: Configures system settings.
- **Notification Module**: Sends notifications to users.

## Technologies Used:
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT (JSON Web Token)
- Firebase Cloud Messaging (FCM) (or any another notification solution)
- Socket.IO (for real-time features)

## Installation and Running:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/food-ordering-nestjs.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure database and other necessary information in the `.env` file.

4. Run migrations (if needed):
    ```bash
    npm run migration:run
    ```

5. Start the server:
    ```bash
    npm run start:dev
    ```

## API Documentation:

(Provide detailed API documentation here, for example, using Swagger)
```
http:/localhost:[PORT]//document
```
## Author:
phong-jack 




