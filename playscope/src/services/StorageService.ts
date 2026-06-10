/**
 * StorageService — upload de arquivos do usuário para Firebase Storage.
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.config';

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) StorageService.instance = new StorageService();
    return StorageService.instance;
  }

  /**
   * Faz upload da foto de perfil e retorna a URL pública.
   * @param userId  UID do usuário
   * @param uri     URI local da imagem (ex: de ImagePicker)
   * @param mimeType ex: 'image/jpeg'
   */
  async uploadProfilePhoto(userId: string, uri: string, mimeType = 'image/jpeg'): Promise<string> {
    try {
      // Converte URI local para Blob
      const response = await fetch(uri);
      const blob     = await response.blob();

      const path     = `users/${userId}/profile.jpg`;
      const fileRef  = ref(storage, path);

      await uploadBytes(fileRef, blob, { contentType: mimeType });
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error: any) {
      throw new Error(`Erro ao enviar foto: ${error?.message ?? 'desconhecido'}`);
    }
  }

  /**
   * Remove a foto de perfil do usuário do Storage.
   */
  async deleteProfilePhoto(userId: string): Promise<void> {
    try {
      const path    = `users/${userId}/profile.jpg`;
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch {
      // Ignora se o arquivo não existir
    }
  }

  /**
   * Retorna a URL pública de qualquer arquivo no Storage.
   */
  async getURL(path: string): Promise<string> {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  }
}
