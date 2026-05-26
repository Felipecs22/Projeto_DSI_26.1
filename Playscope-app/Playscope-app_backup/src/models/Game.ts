/**
 * Game — representa um jogo do catálogo Steam.
 * Responsabilidade: encapsular dados e fornecer helpers de apresentação.
 */
export class Game {
  readonly id: string;
  readonly appId: number;
  readonly name: string;
  readonly genres: string;
  readonly rating: number;        // 0–5 float
  readonly ratingLabel: string;
  readonly reviews: number;
  readonly price: number;
  readonly priceLabel: string;
  readonly steamRating: string;
  readonly releaseDate: string;
  readonly image: string;
  status: string | null;

  constructor(data: {
    id: string;
    appId: number;
    name: string;
    genres: string;
    rating: number;
    ratingLabel: string;
    reviews: number;
    price: number;
    priceLabel: string;
    steamRating: string;
    releaseDate: string;
    image: string;
    status?: string | null;
  }) {
    this.id          = data.id;
    this.appId       = data.appId;
    this.name        = data.name;
    this.genres      = data.genres;
    this.rating      = data.rating;
    this.ratingLabel = data.ratingLabel;
    this.reviews     = data.reviews;
    this.price       = data.price;
    this.priceLabel  = data.priceLabel;
    this.steamRating = data.steamRating;
    this.releaseDate = data.releaseDate;
    this.image       = data.image;
    this.status      = data.status ?? null;
  }

  /** URL da imagem de capa via Steam CDN */
  get coverUrl(): string {
    return this.image;
  }

  /** Retorna true se for gratuito */
  get isFree(): boolean {
    return this.price === 0;
  }

  /** Retorna true se tiver avaliação positiva (>= 4) */
  get isHighlyRated(): boolean {
    return this.rating >= 4;
  }

  /** Formata número de reviews para exibição */
  get reviewsFormatted(): string {
    if (this.reviews >= 1_000_000) return `${(this.reviews / 1_000_000).toFixed(1)}M`;
    if (this.reviews >= 1_000)     return `${(this.reviews / 1_000).toFixed(0)}K`;
    return String(this.reviews);
  }

  /** Serializa para objeto plano (ex: salvar no Firestore) */
  toJSON(): Record<string, unknown> {
    return {
      id:          this.id,
      appId:       this.appId,
      name:        this.name,
      genres:      this.genres,
      rating:      this.rating,
      ratingLabel: this.ratingLabel,
      reviews:     this.reviews,
      price:       this.price,
      priceLabel:  this.priceLabel,
      steamRating: this.steamRating,
      releaseDate: this.releaseDate,
      image:       this.image,
      status:      this.status,
    };
  }

  /** Cria instância a partir de objeto plano */
  static fromJSON(data: Record<string, any>): Game {
    return new Game({
      id:          data.id          ?? String(data.appId),
      appId:       data.appId       ?? 0,
      name:        data.name        ?? '',
      genres:      data.genres      ?? '',
      rating:      data.rating      ?? 0,
      ratingLabel: data.ratingLabel ?? `${data.rating ?? 0}/5`,
      reviews:     data.reviews     ?? 0,
      price:       data.price       ?? 0,
      priceLabel:  data.priceLabel  ?? '',
      steamRating: data.steamRating ?? '',
      releaseDate: data.releaseDate ?? '',
      image:       data.image       ?? '',
      status:      data.status      ?? null,
    });
  }
}
