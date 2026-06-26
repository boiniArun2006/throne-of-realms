// ============================================================
// THRONE OF REALMS — Divine Weapons Data
// ============================================================

import { DivineWeapon } from '../types';
import { COLORS } from '../constants';

export const WEAPONS: Record<string, DivineWeapon> = {
  fists: {
    id: 'fists',
    name: 'Bare Fists',
    realm: 'agni_furnace', // placeholder
    description: "Veer's own two hands. Surprisingly effective when powered by divine energy.",
    damage: 15,
    range: 45,
    speed: 1.0,
    specialAbility: 'None — yet',
    color: COLORS.veerBody,
  },
  agni_chakra: {
    id: 'agni_chakra',
    name: 'Chakra of Agni',
    realm: 'agni_furnace',
    description: 'A blazing disc that burns through enemy defenses. Sacred fire weapon of the Hindu fire god.',
    damage: 25,
    range: 80,
    speed: 1.2,
    specialAbility: 'Fire Spin — AoE burn around player',
    color: COLORS.agniLava,
  },
  susanoo_totsuka: {
    id: 'susanoo_totsuka',
    name: "Totsuka-no-Tsurugi",
    realm: 'susanoo_storm',
    description: 'The divine sword pulled from the great serpent. Cuts through storms and enemies alike.',
    damage: 30,
    range: 90,
    speed: 1.0,
    specialAbility: 'Storm Slash — Projectile slash wave',
    color: COLORS.susanooAccent,
  },
  yama_danda: {
    id: 'yama_danda',
    name: "Danda of Yama",
    realm: 'yama_underworld',
    description: 'The cosmic staff that judges the dead. Drains enemy life force on hit.',
    damage: 28,
    range: 70,
    speed: 0.8,
    specialAbility: 'Soul Drain — Heal on hit',
    color: COLORS.yamaSoul,
  },
  amaterasu_mirror: {
    id: 'amaterasu_mirror',
    name: "Yata-no-Kagami",
    realm: 'amaterasu_light',
    description: 'The sacred mirror that reveals truth. Reflects projectiles and blinds enemies.',
    damage: 20,
    range: 120,
    speed: 1.5,
    specialAbility: 'Divine Reflect — Block and return projectiles',
    color: COLORS.amaterasuLight,
  },
  shiva_trishula: {
    id: 'shiva_trishula',
    name: "Trishula of Shiva",
    realm: 'shiva_tandava',
    description: 'The three-pronged spear. Destroys, creates, preserves. The ultimate weapon.',
    damage: 40,
    range: 100,
    speed: 0.9,
    specialAbility: 'Tandava Burst — Screen-clearing destruction wave',
    color: COLORS.shivaAccent,
  },
  tsukuyomi_magatama: {
    id: 'tsukuyomi_magatama',
    name: "Magatama of Tsukuyomi",
    realm: 'tsukuyomi_eclipse',
    description: 'The crescent jewel that commands darkness. Warps space around the wielder.',
    damage: 35,
    range: 110,
    speed: 1.3,
    specialAbility: 'Eclipse Warp — Short-range teleport + strike',
    color: COLORS.tsukuyomiAccent,
  },
};
