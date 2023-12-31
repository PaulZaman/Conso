# Conso App ✨


This is an application to manage your loan applications. It is composed of a backend and a frontend. The backend is made with Express.js and Sequelize, and the frontend with ReactJS and Vite. It puts in contact bankers and users to get the most attractive loan offers. It is a school project. 🏦💼💻

## Installation and Usage 🚀

Before running the application, there are a few steps you need to follow.

### Prerequisites 📋
- Node.js
- Yarn
- MySQL 

### Backend ⚙️

Navigate to the backend 📍

```bash
cd conso-back

```

You first need to create the database 🗄️ To do so, you need to have mysql installed on your computer. Then, you need to create a database named "Conso_DB".You can do so by running the following commands:

```bash
mysql -u root -p
```
You then enter your password and run the following commands:

```bash
CREATE DATABASE Conso_DB;
exit;
```

Now you have to create the connection to the database 🔗 To do so, you need to rename the file **conso-back/database/connectionEXAMPLE** to **connection.js**. 
In this file, you should find this:


```javascript
// database/connection.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Conso_DB', 'USER', 'PASSWORD', {
	host: 'localhost',
	dialect: 'mysql',
});

module.exports = sequelize; 
```
Do not forget to replace the "USER" and "PASSWORD" with your own mysql user and password. (USER is generally "root" and PASSWORD is the password you chose when you installed mysql) 🔒🔑

Now that your database is created, and that your connection is established, you can initialize the backend. To do so, run the following commands (in the same directory **/conso-back**):


```bash
npm install
node syncdb.js
node app.js
```
Wait a few seconds, the second command takes a bit of time.
Now the backend is running. You can test it by going to http://localhost:8080/. You should see a "Hello World!" message 👋🌍

### Frontend 🎨

Now you can open a new terminal, to launch the frontend, from the main directory, run the following commands:

```bash
cd conso-front
```
This allows you to navigate to the frontend directory. Then, run the following commands:

```bash
yarn install
yarn dev
```

##### Firebase 🔥

Last step ! You need to allow the project to access our firebase database. To do so, you need to rename the file **conso-front/src/config/firebaseEXAMPLE.js** to **firebase.js**. Inside you should find this:

```javascript
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref };
```
Replace the "xxx" with your own firebase credentials. If you are our professors, you can find the entirety of this file in the end of our report. 

Now you are all set ! You can access the website on the url displayed in the terminal. 🌐✨

## Login credentials 🔐

The default user is a client, you can log in with the following credentials:

```bash
📧 Email: admin@gmail.com
🔒 Password: admin
```

```bash
📧 Email: admin-banker@gmail.com
🔒 Password: admin
```
