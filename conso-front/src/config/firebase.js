import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAql6X6bTepOoGE6axHeEERvU5Hd6UZSss",
  authDomain: "solution-factory1.firebaseapp.com",
  projectId: "solution-factory1",
  storageBucket: "solution-factory1.appspot.com",
  messagingSenderId: "1001481429446",
  appId: "1:1001481429446:web:fdcaaaccc704832c1652c7",
  measurementId: "G-50EVLW8KP1"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref };