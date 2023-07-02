# 😎 API Routes

## 🔐 Auth

| Route                            | Description                 | Required Body         |
| -------------------------------- | --------------------------- | --------------------- |
| POST http://localhost:8080/login | Login a user to get a token | - email<br>- password |
| POST http://localhost:8080/auth  | Check if a token is valid   | - id<br>- token       |

## 👤 User

| Route                                        | Description                 | Required Body                                                                                                                                                                                            |
| -------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST http://localhost:8080/user/create       | Create a new user           | - firstname<br>- lastname<br>- email<br>- password<br>- profile_image_path (optional)                                                                                                                    |
| POST http://localhost:8080/user/validate     | Validate a user             | - id<br>- token                                                                                                                                                                                          |
| DEL http://localhost:8080/user/delete        | Delete a user               | - id<br>- token                                                                                                                                                                                          |
| POST http://localhost:8080/user/update       | Update a user               | - id<br>- token<br>- firstname (optional)<br>- lastname (optional)<br>- email (optional)<br>- password (optional)<br>- old_password (required if password is entered)<br>- profile_image_path (optional) |
| POST http://localhost:8080/user              | Get a user                  | - id<br>- token                                                                                                                                                                                          |
| POST http://localhost:8080/user/apply        | Post a loan application     | - id<br>- token<br>- bank_id<br>- amount<br>- tenure                                                                                                                                                     |
| POST http://localhost:8080/user/applications | Get all loan applications   | - id<br>- token                                                                                                                                                                                          |
| POST http://localhost:8080/user/isBanker     | Check if a user is a banker | - id<br>- token            |
| POST http://localhost:8080/user/offer       | Get an offer for an application            | - id<br>- token<br>- loan_application_id                                   |
| POST http://localhost:8080/user/apply/del       | Delete a loan application           | - id<br>- token<br>- loan_application_id                                   |
| POST http://localhost:8080/user/checkDocuments			 | Check if a user has all documents to apply for a bank           | - id<br>- token<br>- bank_id                                   |

## 🏦 Bank

| Route                                | Description                          | Required Body |
| ------------------------------------ | ------------------------------------ | ------------- |
| POST http://localhost:8080/bank      | Get all banks               |           |
| POST http://localhost:8080/bank      | Get 1 bank              | -bank_id    |
| POST http://localhost:8080/bank/docs | Get required documents for a banks | - bank_id     |

## 📄 Document

| Route                                    | Description                        | Required Body                                            |
| ---------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| POST http://localhost:8080/document      | Post a document for a user         | - id<br>- token<br>- document_type_id<br>- document_path |
| POST http://localhost:8080/document  | Get a specific document for a user | - id<br>- token<br>- document_type_id                         |
| POST http://localhost:8080/document      | Get all documents for a user       | - id<br>- token                                          |
| DEL http://localhost:8080/document       | Delete a document for a user       | - id<br>- token<br>- document_type_id                         |
| GET http://localhost:8080/document/types | Get all document types             |                                                          |


## 🧑‍💼 Banker

| Route                                          | Description                        | Required Body                                               |
| ---------------------------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| POST http://localhost:8080/banker/applications | Get all applications for a banker  | - id<br>- token                                             |
| POST http://localhost:8080/banker/offer        | Make an offer for an application   | - id<br>- token<br>- loan_application_id<br>- interest_rate |
| POST http://localhost:8080/banker/refuse       | Refuse an offer for an application | - id<br>- token<br>- loan_application_id                    |
| POST http://localhost:8080/banker/user       | Get the user from an application (and his documents) | - id<br>- token<br>- loan_application_id                    |
| POST http://localhost:8080/banker/bank      | Get the information from a banker | - id<br>- token<br>    |