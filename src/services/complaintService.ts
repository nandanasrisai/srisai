import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Complaint {
  id: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  title: string;
  description: string;
  category: 'Academics' | 'Hostel Facilities' | 'Transportation' | 'IT Services' | 'General Feedback';
  isAnonymous: boolean;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: any;
  updatedAt: any;
  authorityComment?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'student' | 'authority';
  createdAt: any;
}

export const ComplaintService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  async createProfile(profile: Partial<UserProfile>) {
    try {
      const docRef = doc(db, 'users', profile.uid!);
      await setDoc(docRef, {
        ...profile,
        role: profile.role || 'student',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${profile.uid}`);
    }
  },

  async raiseComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    try {
      const colRef = collection(db, 'complaints');
      await addDoc(colRef, {
        ...complaint,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'complaints');
    }
  },

  async updateComplaintStatus(complaintId: string, status: 'pending' | 'in-progress' | 'resolved', comment?: string) {
    try {
      const docRef = doc(db, 'complaints', complaintId);
      await updateDoc(docRef, {
        status,
        authorityComment: comment || '',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${complaintId}`);
    }
  },

  subscribeToStudentComplaints(studentId: string, callback: (complaints: Complaint[]) => void) {
    const q = query(
      collection(db, 'complaints'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      callback(complaints);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'complaints');
    });
  },

  subscribeToAllComplaints(callback: (complaints: Complaint[]) => void) {
    const q = query(
      collection(db, 'complaints'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      callback(complaints);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'complaints');
    });
  }
};
