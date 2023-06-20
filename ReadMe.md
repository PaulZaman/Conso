# Conso App


## Description

BLa BLA BLA BLA

## How to run

### backend

Naviguate to the backend

```bash
cd conso-back
```

You first need to create the database. To do so, you need to have mysql installed on your computer. Then, you need to create a database named "Conso_DB".You can do so by running the following commands:

```bash
mysql -u root -p
```
You then enter you password and run the following commands:

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

then exit this folder to go back to the main directory

```bash
cd ..
```

then launch the frontend, from the main directory, run the following commands:

```bash
cd conso-front
yarn install
yarn dev
```

