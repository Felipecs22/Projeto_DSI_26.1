/**
 * PlacesRepository — comunica com o Nominatim, a API de busca do OpenStreetMap.
 * Limitação do Nominatim: máximo 1 requisição por segundo.
 * Isso não é problema aqui pois as buscas são disparadas por ações
 * do usuário (soltar o slider, trocar o filtro) — nunca em loop.
 */

import { GamingPlace, type PlaceType } from '../models/GamingPlace';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Keywords de busca por categoria
const KEYWORDS: Record<PlaceType, string> = {
  store:    'loja de games',
  lanhouse: 'lan house',
};

/**
 * Calcula um bounding box (caixa delimitadora) a partir de um ponto central e raio.
 * O Nominatim usa esse box para limitar os resultados à área de interesse.
 */
function calcBoundingBox(lat: number, lng: number, radiusMeters: number) {
  const latDelta = radiusMeters / 111_000;
  const lngDelta = radiusMeters / (111_000 * Math.cos((lat * Math.PI) / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

export class PlacesRepository {
  /**
   * Busca estabelecimentos próximos usando o Nominatim (OpenStreetMap).
   *
   * @param lat           — latitude do usuário
   * @param lng           — longitude do usuário
   * @param radiusMeters  — raio de busca em metros
   * @param type          — categoria do local
   */
  async findNearby(
    lat: number,
    lng: number,
    radiusMeters: number,
    type: PlaceType,
  ): Promise<GamingPlace[]> {
    const keyword = KEYWORDS[type];
    const bb      = calcBoundingBox(lat, lng, radiusMeters);

    // viewbox: left,top,right,bottom (minLng, maxLat, maxLng, minLat)
    const viewbox = `${bb.minLng},${bb.maxLat},${bb.maxLng},${bb.minLat}`;

    const url =
      `${NOMINATIM_URL}` +
      `?q=${encodeURIComponent(keyword)}` +
      `&format=json` +
      `&limit=20` +
      `&bounded=1` +
      `&viewbox=${viewbox}`;

    const response = await fetch(url, {
      headers: {
        // Obrigatório pela política de uso do Nominatim
        'User-Agent':      'Playscope/1.0 (projeto acadêmico)',
        'Accept-Language': 'pt-BR,pt',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar locais: ${response.status}`);
    }

    const data: any[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) return [];

    return data
      .filter(item => item.lat && item.lon)
      .map(item => GamingPlace.fromNominatim(item, type));
  }
}