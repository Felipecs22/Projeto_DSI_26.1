/**
 * GameService — gerencia o catálogo local de jogos (dataset Steam).
 * O catálogo é estático/local; dados de usuário ficam no Firestore.
 */

import { Game } from '../models/Game';
import gamesRaw from '../data/games_data.json';

const TAG_PRIORITY = [
  'RPG',
  'FPS',
  'Horror',
  'Indie',
  'Exploração',
  'Estratégia',
  'Puzzle',
  'Simulação',
  'Aventura',
];

const TAG_RULES: Record<string, string[]> = {
  RPG: [
    'witcher', 'baldur', 'divinity', 'fallout', 'persona', 'yakuza',
    'souls', 'skyrim', 'mass effect', 'dragon age', 'omori', 'final fantasy',
    'elden ring', 'diablo', 'dark souls', 'monster hunter', 'cyberpunk',
  ],
  FPS: [
    'doom', 'left 4 dead', 'half-life', 'counter-strike', 'borderlands',
    'ultrakill', 'black mesa', 'killing floor', 'ravenfield', 'fear',
    'postal', 'deep rock', 'quake', 'bioshock',
  ],
  Horror: [
    'resident evil', 'outlast', 'phasmophobia', 'forest', 'dying light',
    'doki doki', 'walking dead', 'biohazard', 'fear', 'amnesia', 'silent hill',
    'evil within', 'dead space',
  ],
  Indie: [
    'hollow knight', 'stardew', 'terraria', 'hades', 'vampire survivors',
    'undertale', 'cuphead', 'celeste', 'papers please', 'hotline miami',
    'to the moon', 'gris', 'inside', 'brotato', 'pizza tower', 'katana zero',
    'inscryption', 'dead cells', 'noita', 'ori', 'slay the spire', 'ftl',
    'binding of isaac', 'broforce', 'risk of rain', 'dave the diver',
  ],
  Exploração: [
    'subnautica', 'outer wilds', 'stray', 'valheim', 'terraria', 'the forest',
    'dave the diver', 'journey', 'a hat in time', 'tomb raider',
  ],
  Estratégia: [
    'civilization', 'age of empires', 'factorio', 'rimworld', 'bloons',
    'dyson sphere', 'ftl', 'warband', 'mount & blade', 'commandos',
  ],
  Puzzle: [
    'portal', 'papers please', 'inscryption', 'the witness', 'baba is you',
    'talos', 'inside', 'limbo', 'the room',
  ],
  Simulação: [
    'simulator', 'truck', 'kerbal', 'beamng', 'tabletop', 'game dev tycoon',
    'wallpaper engine', 'slime rancher', 'oxygen not included', 'besiege',
    'carx', 'american truck', 'euro truck',
  ],
};

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  Terraria: 'Sandbox 2D de aventura com exploração, construção, crafting e batalhas contra chefes em um mundo procedural.',
  "Garry's Mod": 'Sandbox baseado em física que mistura criatividade, mods e experimentação em partidas solo ou multiplayer.',
  'The Witcher® 3: Wild Hunt': 'RPG de mundo aberto focado em narrativa, escolhas e caçadas a monstros no papel de Geralt de Rivia.',
  'Left 4 Dead 2': 'Shooter cooperativo de sobrevivência em primeira pessoa contra hordas de infectados e campanhas intensas.',
  'Stardew Valley': 'Simulador de fazenda indie com cultivo, pesca, mineração e vínculos com a comunidade local.',
  Phasmophobia: 'Horror cooperativo em que os jogadores investigam atividades paranormais e tentam identificar fantasmas.',
  'The Forest': 'Survival horror em mundo aberto com crafting, exploração e ameaça constante de canibais na ilha.',
  Valheim: 'Aventura de sobrevivência cooperativa inspirada na mitologia nórdica, com construção e progressão por biomas.',
  'Portal 2': 'Puzzle em primeira pessoa baseado em portais, física e cooperação, com uma das campanhas mais marcantes da Valve.',
  'Hollow Knight': 'Metroidvania indie de exploração com combate preciso, atmosfera melancólica e mundo interconectado.',
  "Baldur's Gate 3": 'RPG tático com forte ênfase em escolhas, narrativa ramificada e combates por turno no universo de Dungeons & Dragons.',
  'Subnautica': 'Sobrevivência e exploração submarina em um planeta alienígena, com foco em descoberta e gestão de recursos.',
  Hades: 'Roguelike de ação indie com combate veloz, progressão contínua e narrativa baseada na mitologia grega.',
  'DOOM': 'FPS de combate agressivo e ritmo acelerado, com arsenal pesado, mobilidade e confrontos intensos contra demônios.',
  'Cuphead': 'Jogo indie de ação e plataforma com foco em chefes desafiadores e direção de arte inspirada em animações clássicas.',
  'Resident Evil 2': 'Survival horror com exploração, gerenciamento de recursos e tensão constante em Raccoon City.',
  Outlast: 'Horror em primeira pessoa focado em fuga, perseguição e investigação em ambientes extremamente opressivos.',
  ULTRAKILL: 'FPS indie frenético que mistura movimentação veloz, combos agressivos e uma estética retrô.',
  'Resident Evil 4': 'Horror de ação com exploração, gerenciamento de recursos e combate contra inimigos hostis em vilarejos isolados.',
  'Outer Wilds': 'Aventura de exploração espacial baseada em descoberta, pistas ambientais e progressão por conhecimento.',
};

function normalizeValue(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildTagSet(gameName: string, rawGenre: string) {
  const normalizedName = normalizeValue(gameName);
  const normalizedGenre = normalizeValue(rawGenre);
  const tags = new Set<string>();

  if (normalizedGenre.includes('simul')) tags.add('Simulação');
  if (normalizedGenre.includes('puzzle')) tags.add('Puzzle');
  if (normalizedGenre.includes('acao')) tags.add('FPS');
  if (normalizedGenre.includes('avent')) tags.add('Aventura');

  for (const [tag, keywords] of Object.entries(TAG_RULES)) {
    if (keywords.some((keyword) => normalizedName.includes(keyword))) {
      tags.add(tag);
    }
  }

  if (tags.size === 0) {
    tags.add('Aventura');
  }

  if (
    tags.has('RPG') ||
    tags.has('FPS') ||
    tags.has('Horror') ||
    tags.has('Indie') ||
    tags.has('Exploração') ||
    tags.has('Estratégia') ||
    tags.has('Puzzle') ||
    tags.has('Simulação')
  ) {
    tags.add('Aventura');
  }

  return TAG_PRIORITY.filter((tag) => tags.has(tag));
}

function buildGenres(tags: string[]): string {
  const labels = tags.filter((tag) => tag !== 'Aventura').slice(0, 2);
  return [tags.includes('Aventura') ? 'Aventura' : null, ...labels]
    .filter(Boolean)
    .join(', ');
}

function buildDescription(game: any, tags: string[]): string {
  const override = DESCRIPTION_OVERRIDES[game.name];

  if (override) {
    return override;
  }

  const year = game.releaseDate ? String(game.releaseDate).slice(0, 4) : 'data não informada';
  const emphasis = tags.slice(0, 3).join(', ').toLowerCase();

  return `${game.name} é um jogo de ${emphasis || 'aventura'} lançado em ${year}, com avaliação ${game.ratingLabel} baseada em ${game.reviews} reviews da Steam.`;
}

export class GameService {
  private static instance: GameService;
  private catalog: Game[] = [];

  private constructor() {
    this.catalog = (gamesRaw as any[]).map((rawGame) => {
      const tags = buildTagSet(rawGame.name, rawGame.genres);

      return Game.fromJSON({
        ...rawGame,
        genres: buildGenres(tags),
        tags,
        description: buildDescription(rawGame, tags),
      });
    });
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
        g.genres.toLowerCase().includes(q) ||
        g.tags.some(tag => tag.toLowerCase().includes(q)),
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
      .filter(
        game =>
          game.genres.toLowerCase().includes(g) ||
          game.tags.some(tag => tag.toLowerCase() === g),
      )
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
