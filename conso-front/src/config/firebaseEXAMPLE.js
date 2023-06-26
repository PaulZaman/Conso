import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxxxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref };
