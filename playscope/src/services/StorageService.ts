import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.config';
import { UserRepository } from '../repositories/UserRepository';

export class StorageService {
  private static instance: StorageService;
  private userRepo = new UserRepository();

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadProfilePhoto(userId: string, uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `avatars/${userId}/profile.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    await this.userRepo.updateProfile(userId, {
      photoURL: downloadURL,
      avatarId: null,
    });

    return downloadURL;
  }
}