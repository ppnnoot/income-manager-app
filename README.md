
# Expend Manager App

## Technologies Used
- **Language**: Typescript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: UUID Token-based authentication
- **Libraries**: Multer (for file uploads)

## Concept
This system is designed to enable users to:
1. Create user accounts.
2. Record expenses, including attaching image files.
3. Summarize expenses with filters for month and year
4. Implement profanity filtering for notes in expense records.

## Future Development


## Installation
1. Clone this repository:
`https://github.com/ppnnoot/income-manager-app.git`
2. Install dependencies:
`cd income-manager-app`
`npm install`
3. Set up environment variables in the `.env` file based on the `.env` file.
4. Run the server:
`npm start`

## API Usage

  

Below are the available API routes for managing users, accounts, categories, transactions, and file uploads.

### User Route
  
#### POST Request
	 `POST /login`
	 `POST /register`


- POST /login: Authenticates a user and returns an access token.

- **Request Body**:

```json
{
"email": "user@example.com",
"password": "password"
}

```

- **Response**:

```json
{
"message": "Login successful",
"token": "Bearer <access_token>"
}
```

  

- **POST /register**: Registers a new user.

- **Request Body**:

```json

{
"email": "user@example.com",
"password": "password"
}

```

- **Response**:

```json
{
"message": "Registered successfully"
}
```

  

### Account Routes

- **GET /accounts**: Retrieves all accounts associated with the authenticated user.

- **POST /accounts**: Creates a new account for the authenticated user.

- **Request Body**:

```json
{
"nameAccount": "Savings Account",
"balance": 5000
}
```

  

- **GET /accounts/:id**: Retrieves the details of a specific account by ID.

- **DELETE /accounts/:id**: Deletes an account by ID.

  

### Category Routes

- **GET Request**
	-  `/category/:id`: Retrieves the details of a specific category by ID.
	-  `/category` : Retrieves all categories associated with the authenticated user.




- **POST Request**
	- `/category`: Creates a new expense category. Requu
	- **Request Body**:
```json
{
"nameCategory": "Food"
}
```




- **DELETE /category/:id**: Deletes a category by ID.

### Transaction Routes

- **POST /transactions**: Records a new transaction.

- **Request Body**:
```json
{
	"accountId": "accountId",
	"categoryId": "categoryId",	
	"amount": 100,
	"note": "Dinner"
}
```

- **GET /transactions**: Retrieves all transactions associated with the authenticated user, with support for pagination.

- **Query Parameters**:
	- `page`: Page number (optional).
	- `limit`: Number of transactions per page (optional).

- **Response**:

```json
{
	"transactions": [
		{ 
			"id": "1", 
			"amount": 500, "date": "2024-05-01",
			"categoryId": "Food", 
			"accountId": "Main" 
		}
	],
	"currentPage": 1,
	"totalPages": 10,
	"totalTransactions": 100
}
```

  

- **GET /transactions/summary**: Retrieves a summary of transactions, grouped by day, month, or year.

- **Query Parameters**:

	- `group`: `day`, `month`, or `year`.

	- `month`, `year`, `categoryId`, `accountId`: Optional filters.

  

### File Upload Route

- **POST /upload**: Uploads a file (e.g., a transaction slip).

- **Form Data**: `slip`: The file to upload (image format).

- **Response**:

```json
{
	"message": "File uploaded successfully",
	"file": { "filename": "slip-123456.png" }
}
```

  

### Authentication

All routes except for `/login` and `/register` require a valid **Bearer Token** in the `Authorization` header:
