import { auth } from './firebaseInit'
import {
  signOut,
  onAuthStateChanged,
  getIdToken as fetchIdToken,
} from 'firebase/auth';

export const login = () => {
  // Using firebase auth to login, i.e. with firebaseui-web (we will integrate this in the component)
}

export const logout = () => {
  return signOut(auth);
};

export const getIdToken = () => {
  return auth.currentUser ? fetchIdToken(auth.currentUser) : null;
};

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
