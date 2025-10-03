E-commerce Hybrid App (React Native + Node + MongoDB)

Getting Started

Backend (Node/Express)

1. Open a terminal:
   - cd backend
   - copy .env.example to .env and set values
   - npm install
   - npm run dev (starts on http://localhost:4000)
   - npm run seed (optional) to insert sample products

API Endpoints

- GET /health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (auth)
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)
- GET /api/cart (auth)
- POST /api/cart/add (auth)
- POST /api/cart/remove (auth)
- POST /api/cart/clear (auth)
- GET /api/orders (auth)
- POST /api/orders (auth)

Mobile App (Expo React Native)

1. Open a new terminal:
   - cd app
   - npm install
   - npm run android (requires Android SDK) or npm run web

Tech

- React Native (Expo)
- Tailwind (NativeWind)
- Node/Express
- MongoDB (Mongoose)


