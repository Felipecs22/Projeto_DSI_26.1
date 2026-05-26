/**
 * GameService — gerencia o catálogo local de jogos (dataset Steam).
 * O catálogo é estático/local; dados de usuário ficam no Firestore.
 */

import { Game } from '../models/Game';
import gamesRaw from '../data/games_data.json';

export class GameService {
  private static instance: GameService;
  private catalog: Game[] = [];

  private constructor() {
    // Carrega catálogo uma única vez
    this.catalog = (gamesRaw as any[]).map(Game.fromJSON);
  }

  static getInstance(): GameService {
    if (!GameService.instance) GameService.instance = new GameService();
    return GameService.instance;
  }

  /** Retorna todo o catálogo */
  getAll(): Game[] {
    return this.catalog;
  }

  /** Busca por ID */
  findById(id: string): Game | undefined {
    return this.catalog.find(g => g.id === id);
  }

  /** Pesquisa por nome ou gênero */
  search(query: string): Game[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.catalog;
    return this.catalog.filter(
      g =>
        g.name.toLowerCase().includes(q) ||
        g.genres.toLowerCase().includes(q),
    );
  }

  /** Jogos em destaque (recomendações): mais bem avaliados e populares */
  getRecommended(limit = 10): Game[] {
    return [...this.catalog]
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      .slice(0, limit);
  }

  /** Em Alta: mais populares por número de reviews */
  getTrending(limit = 10): Game[] {
    return [...this.catalog]
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit);
  }

  /** Filtra por gênero (keyword) */
  getByGenre(genre: string, limit = 20): Game[] {
    const g = genre.toLowerCase();
    return this.catalog
      .filter(game => game.genres.toLowerCase().includes(g))
      .slice(0, limit);
  }

  /** Jogos gratuitos */
  getFree(limit = 20): Game[] {
    return this.catalog.filter(g => g.isFree).slice(0, limit);
  }

  /** Jogos com desconto — aqui retorna os mais baratos não-grátis */
  getCheap(limit = 20): Game[] {
    return [...this.catalog]
      .filter(g => g.price > 0 && g.price < 15)
      .sort((a, b) => a.price - b.price)
      .slice(0, limit);
  }

  /** Novidades: mais recentes */
  getRecent(limit = 20): Game[] {
    return [...this.catalog]
      .filter(g => g.releaseDate)
      .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
      .slice(0, limit);
  }

  /** Total de jogos no catálogo */
  get count(): number {
    return this.catalog.length;
  }
}
