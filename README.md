# Description about project: Digital Cow Hut

## Live Link: https://api-digital-cow-hut.vercel.app

### User

- api/v1/auth/signup (POST)
- api/v1/users (GET) Get all user by hit this api
- api/v1/users/:id (GET) Get specific user by id
- api/v1/users/:id (PATCH) Update specific user by id
- api/v1/users/:id (DELETE) Delete specific user by id

### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- api/v1/cows/6177a5b87d32123f08d2f5d4 (PATCH)
- api/v1/cows/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

### Pagination and Filtering routes of Cows

- api/v1/cows?page=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Chattogram
- api/v1/cows?searchTerm=Cha

### Orders

- api/v1/orders (POST)
- api/v1/orders (GET)
