/**
 * BaseRepository — classe abstrata com operações Firestore genéricas.
 * Subclasses especializam para cada coleção.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type WhereFilterOp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../services/firebase.config';

export abstract class BaseRepository<T> {
  protected abstract collectionName: string;

  /** Referência à coleção no Firestore */
  protected col() {
    return collection(db, this.collectionName);
  }

  /** Referência a um documento específico */
  protected docRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  /** Converte snapshot Firestore → instância do modelo */
  protected abstract toModel(data: Record<string, any>): T;

  /** Busca por ID */
  async findById(id: string): Promise<T | null> {
    const snap = await getDoc(this.docRef(id));
    if (!snap.exists()) return null;
    return this.toModel({ id: snap.id, ...snap.data() });
  }

  /** Salva (cria ou sobrescreve) um documento */
  async save(id: string, data: Record<string, unknown>): Promise<void> {
    await setDoc(this.docRef(id), data, { merge: true });
  }

  /** Atualização parcial */
  async update(id: string, data: Partial<Record<string, unknown>>): Promise<void> {
    await updateDoc(this.docRef(id), data as any);
  }

  /** Remove documento */
  async delete(id: string): Promise<void> {
    await deleteDoc(this.docRef(id));
  }

  /** Busca todos os documentos da coleção */
  async findAll(): Promise<T[]> {
    const snap = await getDocs(this.col());
    return snap.docs.map(d => this.toModel({ id: d.id, ...d.data() }));
  }

  /** Busca com filtros simples */
  async findWhere(
    field: string,
    op: WhereFilterOp,
    value: unknown,
    opts?: { orderByField?: string; limitTo?: number },
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = [where(field, op, value)];
    if (opts?.orderByField) constraints.push(orderBy(opts.orderByField));
    if (opts?.limitTo)      constraints.push(limit(opts.limitTo));

    const q    = query(this.col(), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => this.toModel({ id: d.id, ...d.data() }));
  }
}
