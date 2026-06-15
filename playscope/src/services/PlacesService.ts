/**
 * PlacesService — regras de negócio para busca de locais próximos.
 * Segue o padrão Singleton dos demais Services do projeto.
 *
 * Fluxo: NearbyScreen → PlacesService → PlacesRepository → Nominatim (OpenStreetMap)
 */

import { GamingPlace, type PlaceType } from '../models/GamingPlace';
import { PlacesRepository } from '../repositories/PlacesRepository';

export class PlacesService {
  private static instance: PlacesService;
  private repository = new PlacesRepository();

  private constructor() {}

  static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  /**
   * Busca estabelecimentos próximos de um tipo específico.
   * Remove duplicatas pelo placeId antes de retornar.
   *
   * @param lat     — latitude do usuário
   * @param lng     — longitude do usuário
   * @param radius  — raio em metros (500 a 5000)
   * @param type    — 'store' para lojas de games, 'lanhouse' para LAN houses
   */
  async getNearby(
    lat: number,
    lng: number,
    radius: number,
    type: PlaceType,
  ): Promise<GamingPlace[]> {
    const places = await this.repository.findNearby(lat, lng, radius, type);

    // Remove eventuais duplicatas por placeId
    const seen  = new Set<string>();
    return places.filter(p => {
      if (seen.has(p.placeId)) return false;
      seen.add(p.placeId);
      return true;
    });
  }
}