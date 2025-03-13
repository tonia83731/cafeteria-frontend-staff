# CAFETERIA (NEXTJS + NODEJS + MYSQL)

## Background / Purpose

The era of delivery has arrived due to the changing lifestyles of modern people. According to MIC's research on delivery services, usage stands at around 80%. To keep up with the times, The Cafe has decided to create its website with an ordering service to offer more choices for its clients.

The project is an optimized version of [AC Cafe](https://tonia83731.github.io/ACcafe-vite/), with the following imporvement:

- **Backend refactoring**: Replaced with a personally developed backend and database, enhancing stability and scalability
- **Role-Based Platform Split**: Provided separate frontend and backend stage for users based on their roles (public, user(members), staff), ensuring clear functionality and smooth operation
- **Data Storage Optimization**: Migrated Wishlist and Cartlist from LocalStorage to MySQL database, improving data access efficiency and consistency
- **Focused Purchase Process**: Removed the News page, simplifying content to allow users to focus more on ordering and shopping experiences
- **Multilingual Support**: Users can freely switch between Chinese and English interfaces based on their preferences
- **Coupon System**: Added a Coupon page and functionality, allowing users to apply discounts during checkout, enhancing purchase motivation
- **Enhanced Order Management**: Frontend and backend stage can now manage Order Status, allowing users to view order details and instantly update order statuses
- **Customization Options**: Added size, sweetness, and ice options for drink products, providing a more personalized ordering experience

## TARGET USER

- Long-term customers who are accustomed to online ordering, especially those with a strong passion for coffee

- Busy office workers, freelancers or individuals who enjoy relaxing at home with a cup of coffee (tea)

## USER STORIES

- **View, Add, Edit, and Delete Products:**
  - Can browse products based on categories: Coffee, Tea, Ice Products, Desserts.
  - When adding or editing products, both Chinese and English versions should be considered.
  - Once a product is completed, clicking "Publish" will make it public → Products in a public status cannot be deleted.
- **View and Update Orders:**
  - **Order Cancellation:** Orders with the status "Completed" or "Cancelled" cannot be canceled.
- **View, Add, Edit, and Delete Coupons:**
  - Coupons can only be used after clicking "Publish."
  - Once a coupon is published, it cannot be modified or deleted.

## DEMO

- [THE CAFE | STAFF](https://cafeteria-staff-frontend.vercel.app)
- [THE CAFE](https://cafeteria-frontend-chi.vercel.app)

  - For project development, please visit [cafeteria-frontend](https://github.com/tonia83731/cafeteria-frontend)

- For STAGE 1 (AC Cafe), please visit [ACcafe-vite](https://github.com/tonia83731/ACcafe-vite)

## PROJECT ROLES

- **Fullstack developer**: Provide API based on the requirements and visualized the result by developing an app

## TOOLS

- next @15.0.3
- react @18.3.1
- react-dom @18.3.1
- cookies-next @5.0.2
- tailwindcss @3.4.1
- typescript @5
- react-datepicker @7.5.0
- react-select @5.8.3
- react-toastify @10.0.6
- react-icons @5.3.0
- dayjs @1.11.13

## FURTHER DEVELOPMENT

- Consider adding a filtering feature to the order data to allow users to filter by order status (pending, processing, delviery/pickup, completed, canceled)
- Consider adding a order notification feature
- Consider adding the NEWS page for showcasing promotions, store updates, or special notifications

## PROJECT SETUP

```sh
git clone https://github.com/tonia83731/cafeteria-frontend-staff.git
```

```sh
npm install
```

```sh
npm run dev
```
