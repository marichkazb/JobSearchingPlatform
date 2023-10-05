import { auth } from './firebaseInit'
import {
  signOut,
  onAuthStateChanged,
  getIdToken as fetchIdToken,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.setItem('isUserLoggedIn', false);
  localStorage.clear();
  sessionStorage.clear();
  location.reload(true);
  return signOut(auth);
};

export const getIdToken = async () => {
  const user = auth.currentUser;
  console.log('user in getIdToken: ' + user);
  if (user) {
    const token = await fetchIdToken(auth.currentUser);
    console.log('token in getIdToken: ' + token);
    return token;
  } else {
    return null;
  }
};

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const refreshToken = () => {
  getIdToken(auth.currentUser, true)
    .then((idToken) => {
      console.log('new idToken' + idToken);
    })
    .catch((error) => {
      console.error('Error refreshing token:', error);
    });
}
export const getFirebaseUID = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Firebase User ID:', user.uid);
        resolve(user.uid);
      } else {
        console.warn('No authenticated Firebase user found.');
        reject(new Error('No authenticated Firebase user found.'));
      }
    });
  }).catch((error) => {
    console.error('Error fetching Firebase UID:', error);
    return null;
  });
};

export const getFirebaseMail = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        console.log('Firebase User Email:', user.email);
        resolve(user.email);
      } else {
        console.warn('No authenticated Firebase user or email found.');
        reject(new Error('No authenticated Firebase user or email found.'));
      }
    });
  }).catch((error) => {
    console.error('Error fetching Firebase email:', error);
    return null;
  });
};

export const getFirebaseName = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        console.log('Firebase User Name:', user.displayName);
        resolve(user.displayName);
      } else {
        console.warn('No authenticated Firebase user or display name found.');
        reject(new Error('No authenticated Firebase user or display name found.'));
      }
    });
  }).catch((error) => {
    console.error('Error fetching Firebase display name:', error);
    return null;
  });
};
