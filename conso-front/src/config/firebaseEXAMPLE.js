import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref };