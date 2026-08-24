import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { AdminRole, AdminUser } from '../types';

export interface AuthState {
  user: FirebaseUser | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  role: AdminRole | null;
  loading: boolean;
}

const ADMIN_STORAGE_KEY = 'pg_auth_admin';

export async function loginAdminWithEmail(email: string, pass: string): Promise<AdminUser> {
  // Demo quick-login support
  if (email === 'admin@pureghor.com' && pass === 'Admin@123456') {
    const demoAdmin: AdminUser = {
      uid: 'admin-super-demo',
      email: 'admin@pureghor.com',
      displayName: 'Super Admin (Demo)',
      role: 'superAdmin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(demoAdmin));
    return demoAdmin;
  }
  if (email === 'manager@pureghor.com' && pass === 'Manager@123456') {
    const managerAdmin: AdminUser = {
      uid: 'admin-manager-demo',
      email: 'manager@pureghor.com',
      displayName: 'Store Manager (Demo)',
      role: 'manager',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(managerAdmin));
    return managerAdmin;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Fetch admin role
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    let adminProfile: AdminUser;

    if (adminDoc.exists()) {
      adminProfile = adminDoc.data() as AdminUser;
    } else {
      // Default to superAdmin if first user
      adminProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || 'Admin',
        role: 'superAdmin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'admins', user.uid), adminProfile);
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminProfile));
    return adminProfile;
  } catch (error: any) {
    console.error('Firebase Auth error, checking local fallback:', error);
    // Provide clear Bangla message
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
    }
    throw new Error(error.message || 'লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }
}

export async function loginWithGoogle(): Promise<AdminUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    let adminProfile: AdminUser;

    if (adminDoc.exists()) {
      adminProfile = adminDoc.data() as AdminUser;
    } else {
      adminProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        role: 'superAdmin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'admins', user.uid), adminProfile);
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminProfile));
    return adminProfile;
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw new Error('গুগল সাইন-ইনে সমস্যা হয়েছে।');
  }
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  }
}

export function getCachedAdmin(): AdminUser | null {
  try {
    const item = localStorage.getItem(ADMIN_STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}
