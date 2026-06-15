/**
 * GamingPlace — representa um estabelecimento retornado pela API do Nominatim (OpenStreetMap).
 * Responsabilidade: encapsular os dados de um local (loja de games ou LAN house).
 */

export type PlaceType = 'store' | 'lanhouse';

export class GamingPlace {
  readonly placeId: string;
  readonly name: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly type: PlaceType;

  constructor(data: {
    placeId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    type: PlaceType;
  }) {
    this.placeId   = data.placeId;
    this.name      = data.name;
    this.address   = data.address;
    this.latitude  = data.latitude;
    this.longitude = data.longitude;
    this.type      = data.type;
  }

  /**
   * Cria uma instância a partir do objeto bruto retornado pelo Nominatim.
   * O campo display_name vem no formato "Nome, Rua, Bairro, Cidade, ..."
   * então pegamos só a primeira parte como nome e o restante como endereço.
   */
  static fromNominatim(data: any, type: PlaceType): GamingPlace {
    const parts   = (data.display_name as string).split(',');
    const name    = parts[0].trim();
    const address = parts.slice(1, 4).join(',').trim();

    return new GamingPlace({
      placeId:   String(data.place_id),
      name,
      address,
      latitude:  parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      type,
    });
  }
}