// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCGop4qaMqHxVikHhTgRKxbi4jqPoLh9lo',
  authDomain: 'jobsearch-d4e74.firebaseapp.com',
  projectId: 'jobsearch-d4e74',
  storageBucket: 'jobsearch-d4e74.appspot.com',
  messagingSenderId: '49454727023',
  appId: '1:49454727023:web:3f0c94fdd610b25728729a',
  measurementId: 'G-CHDT385D07',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export { auth, analytics };
