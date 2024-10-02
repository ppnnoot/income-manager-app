
# Expend Manager App

## Technologies Used
- **Language**: Typescript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: UUID Token-based authentication
- **Libraries**: Multer (for file uploads), bcrypt, uuid, 

## Concept
This system is designed to enable users to:

-   **Create user accounts**: Users can register and log in securely to access the system.
-   **Hash passwords and authenticate using UUID Token**: User passwords are securely hashed, and UUID tokens are used for authentication to ensure secure access.

-   **Summarize expenses**: Users can filter and summarize expenses by day, month, and year for better financial tracking.
-   **Profanity filtering**: The system implements profanity filtering for any notes attached to expense records, ensuring appropriate content.
 
-   **Pagination**: Pagination is implemented to efficiently handle large datasets, allowing users to navigate through data page by page.

-   **Manage accounts and expense categories**: Users can manage their accounts and associated expense categories within the system.

-   **Record and view transactions**: Users can log financial transactions and easily retrieve past transaction records.

-   **File upload and management**: The system supports secure file uploads, such as images of receipts, and stores them within the system.


## Future Development
-   **Enhanced Security**: Implementing additional layers of security, such as multi-factor authentication (MFA) and encryption of sensitive data, to protect user information and ensure secure access.
    
-   **File Upload Enhancements**: Extending the file upload functionality to save images and documents in the database using **GridFS**. This allows for efficient storage and retrieval of large files, improving file management and organization within the system.
    
-   **User Interface (UI) Improvements**: Developing a more intuitive and user-friendly UI that enhances the overall user experience. This includes responsive design elements and better navigation to facilitate easier access to features.

- **Profanity Filtering**: Integrating a comprehensive library like **bad-words** to enhance the detection and filtering of inappropriate language in user inputs, ensuring a safer environment for all users.

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
  
	 `POST /login` 		// Authenticates a user and returns an access token.
	 `POST /register` 	// Registers a new user.

__
### Account Routes

	`GET /accounts` 		// Retrieves all accounts associated with the authenticated
	`GET /accounts/:id 		// Retrieves the details of a specific account by ID.
	`POST /accounts`		// Creates a new account for the authenticated user.
	`DELETE /accounts/:id` 		// Deletes an account by ID authenticated user.
 
___
### Category Routes

	`GET /category` 		// Retrieves all category
	`GET /category/:id 		// Retrieves the details of a specific category by ID.
	`POST /category`		// Creates a new category
	`DELETE /category/:id` 		// Deletes an category by ID
___
### Transaction Routes

	`GET  /transactions`			// Retrieves all transactions
	`GET  /transactions/summary`		// Retrieves a summary, with support for pagination.
	`POST /transactions` 			// Create new Transactions



- **POST Request Body /transactions**:
```json
{
	"accountId": "accountId",
	"categoryId": "categoryId",	
	"amount": 100,
	"note": "Dinner"
}
```

- **Query Parameters:** `/transaction?`
	- `page=`: Page number (optional).
	- `limit=`: Number of transactions per page (optional).

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

- **Query Parameters**: `/transactions/summary?`



	- `group=`: `day`, `month`, or `year`, `categoryId`, `accountId`: Optional filters. (Set default to month)

 ___
### File Upload Route

	`POST /upload`	// Uploads a file (e.g., a transaction slip).

  
___
### Authentication

All routes except for `/login` and `/register` require a valid **Bearer Token** in the `Authorization` header:
