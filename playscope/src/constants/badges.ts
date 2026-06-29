/**
 * badges.ts — define as conquistas do Playscope e a logica para calcular
 * quais delas um usuario ja desbloqueou.
 *
 * Nao depende de nenhuma colecao nova no Firestore: os badges sao calculados
 * em tempo real a partir de dados que os Services ja retornam (LibraryStats,
 * contagem de reviews, contagem de amigos, data de criacao da conta).
 *
 * Reutilizavel: a mesma funcao getEarnedBadges() pode ser usada tanto no
 * perfil do proprio usuario quanto, futuramente, no perfil de um amigo —
 * basta passar os stats dele.
 */

export interface BadgeStats {
  total: number;
  jogados: number;
  jogando: number;
  pausados: number;
  abandonados: number;
  fila: number;
  reviewCount: number;
  friendCount: number;
  createdAt: string; // ISO date string
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string; // nome do icone Ionicons
  check: (stats: BadgeStats) => boolean;
}

export interface BadgeResult extends Omit<Badge, 'check'> {
  earned: boolean;
}

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

export const BADGES: Badge[] = [
  {
    id: 'primeiro_jogo',
    label: 'Primeiro Jogo',
    description: 'Adicionou o primeiro jogo a biblioteca',
    icon: 'game-controller',
    check: (s) => s.total >= 1,
  },
  {
    id: 'colecionador',
    label: 'Colecionador',
    description: 'Tem 10 ou mais jogos na biblioteca',
    icon: 'library',
    check: (s) => s.total >= 10,
  },
  {
    id: 'curador',
    label: 'Curador',
    description: 'Concluiu 5 ou mais jogos',
    icon: 'trophy',
    check: (s) => s.jogados >= 5,
  },
  {
    id: 'maratonista',
    label: 'Maratonista',
    description: 'Concluiu 15 ou mais jogos',
    icon: 'star',
    check: (s) => s.jogados >= 15,
  },
  {
    id: 'critico',
    label: 'Critico',
    description: 'Escreveu a primeira review',
    icon: 'chatbox',
    check: (s) => s.reviewCount >= 1,
  },
  {
    id: 'resenhista',
    label: 'Resenhista',
    description: 'Escreveu 5 ou mais reviews',
    icon: 'create',
    check: (s) => s.reviewCount >= 5,
  },
  {
    id: 'social',
    label: 'Social',
    description: 'Adicionou o primeiro amigo',
    icon: 'people',
    check: (s) => s.friendCount >= 1,
  },
  {
    id: 'popular',
    label: 'Popular',
    description: 'Tem 5 ou mais amigos',
    icon: 'people-circle',
    check: (s) => s.friendCount >= 5,
  },
  {
    id: 'veterano',
    label: 'Veterano',
    description: 'Conta criada ha 30 dias ou mais',
    icon: 'calendar',
    check: (s) => {
      const created = new Date(s.createdAt).getTime();
      return Date.now() - created >= DAYS_30_MS;
    },
  },
  {
    id: 'organizado',
    label: 'Organizado',
    description: 'Tem jogos em todas as categorias de status',
    icon: 'list',
    check: (s) =>
      s.jogando > 0 && s.jogados > 0 && s.pausados > 0 && s.abandonados > 0 && s.fila > 0,
  },
];

/**
 * Retorna todos os badges com a flag `earned` indicando se foram
 * desbloqueados ou nao. Util para exibir tanto os conquistados (coloridos)
 * quanto os bloqueados (apagados) na mesma lista.
 */
export function getAllBadgesWithStatus(stats: BadgeStats): BadgeResult[] {
  return BADGES.map(({ check, ...badge }) => ({
    ...badge,
    earned: check(stats),
  }));
}

/** Retorna apenas os badges que o usuario ja desbloqueou. */
export function getEarnedBadges(stats: BadgeStats): BadgeResult[] {
  return getAllBadgesWithStatus(stats).filter((b) => b.earned);
}