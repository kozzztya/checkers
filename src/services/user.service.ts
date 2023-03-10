import {
  doc,
  setDoc,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Firestore,
  collection,
  DocumentData,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Auth, signInAnonymously, signOut } from 'firebase/auth';
import { UserModel, CreateUserInput, UpdateUserInput } from './types';
import { firebaseClient, FirebaseClient } from '@common/firebase';
import { ServiceError } from '@common/enums';

export class UserService {
  db: Firestore;
  auth: Auth;
  collection = 'users';

  constructor(firebaseClient: FirebaseClient) {
    this.db = firebaseClient.firestore;
    this.auth = firebaseClient.auth;
  }

  userConverter = {
    toFirestore: (doc: DocumentData) => ({
      ...doc,
      createdAt: Timestamp.fromDate(doc.createdAt),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options) as any;

      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt.toDate(),
      } as UserModel;
    },
  };

  async getCurrentUserId() {
    const id = this.auth.currentUser?.uid;
    return id || (await this.signInAnonymously());
  }

  async signInAnonymously(): Promise<string> {
    const credential = await signInAnonymously(this.auth);
    return credential.user.uid;
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  async create(input: CreateUserInput): Promise<UserModel> {
    const userId = await this.signInAnonymously();

    const usersRef = collection(this.db, this.collection);
    const docRef = doc(usersRef, userId);
    await setDoc(docRef, { ...input, createdAt: new Date() });

    const docSnap = await getDoc(docRef.withConverter(this.userConverter));
    return docSnap.data() as UserModel;
  }

  async getCurrent(): Promise<UserModel | undefined> {
    const userId = await this.signInAnonymously();
    if (!userId) return;

    return this.get(userId);
  }

  async get(userId: string) {
    const docRef = doc(this.db, this.collection, userId).withConverter(this.userConverter);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(ServiceError.NotFound);
    }

    return docSnap.data() as UserModel;
  }

  async update(input: UpdateUserInput) {
    const userId = await this.getCurrentUserId();
    if (!userId) throw new Error(ServiceError.Unauthorized);

    const docRef = doc(this.db, this.collection, userId);
    await updateDoc(docRef, input);

    const docSnap = await getDoc(docRef.withConverter(this.userConverter));
    return docSnap.data() as UserModel;
  }
}

export const userService = new UserService(firebaseClient);
