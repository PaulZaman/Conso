# Conso App


## Description

This is an application to manage your loan applications. It is composed of a backend and a frontend. The backend is made with Expressjs and sequelize, and the frontend with ReactJS and Vite. It puts in contact bankers and users to get the most attractive loan offers. It is a school project.

## Installation and Usage

### Backend

Naviguate to the backend

```bash
cd conso-back
```

You first need to create the database. To do so, you need to have mysql installed on your computer. Then, you need to create a database named "Conso_DB".You can do so by running the following commands:

```bash
mysql -u root -p
```
You then enter your password and run the following commands:

```bash
CREATE DATABASE Conso_DB;
exit;
```

Now that your database is created, you can initialize the backend. To do so, run the following commands (in the same directory /conso-back):


```bash
npm install
node syncdb.js
node app.js
```

Now the backend is running. You can test it by going to http://localhost:3000/. You should see a "Hello World!" message

### Frontend

Now you can open a new terminal, to launch the frontend, from the main directory, run the following commands:

```bash
cd conso-front
```
This allows you to navigate to the frontend directory. Then, run the following commands:

```bash
yarn install
yarn dev
```

