// ============================================================
// THRONE OF REALMS — Game State Store (Zustand)
// Manages state shared between Phaser scenes and React UI
// ============================================================

import { create } from 'zustand';
import { DungeonRealm, GameSaveState, DivineWeapon } from './types';
import { PLAYER_BASE_ATTACK, PLAYER_BASE_DEFENSE, PLAYER_BASE_HP, CHARACTERS } from './constants';

interface GameState extends GameSaveState {
  // --- Actions ---
  setPlayerPosition: (x: number, y: number) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  completeDungeon: (realm: DungeonRealm) => void;
  unlockWeapon: (weapon: DivineWeapon) => void;
  equipWeapon: (weaponId: string) => void;
  setDialogueFlag: (flag: string, value: boolean) => void;
  incrementDungeonAttempt: () => void;
  resetGame: () => void;
  setCurrentScene: (scene: string) => void;

  // --- Derived ---
  isDungeonCompleted: (realm: DungeonRealm) => boolean;
  getAttackPower: () => number;
}

const initialSaveState: GameSaveState = {
  currentScene: 'MenuScene',
  playerHp: PLAYER_BASE_HP,
  playerMaxHp: PLAYER_BASE_HP,
  playerX: 200,
  playerY: 300,
  completedDungeons: [],
  currentWeapon: 'fists',
  unlockedWeapons: ['fists'],
  dialogueFlags: {
    intro_complete: false,
    first_bathroom: false,
    first_dungeon: false,
    met_nirvani: false,
    second_dungeon: false,
    hana_first_meeting: false,
  },
  dungeonAttempt: 0,
};

export const useGameState = create<GameState>((set, get) => ({
  ...initialSaveState,

  setPlayerPosition: (x, y) => set({ playerX: x, playerY: y }),

  damagePlayer: (amount) =>
    set((state) => ({
      playerHp: Math.max(0, state.playerHp - Math.max(0, amount - PLAYER_BASE_DEFENSE)),
    })),

  healPlayer: (amount) =>
    set((state) => ({
      playerHp: Math.min(state.playerMaxHp, state.playerHp + amount),
    })),

  completeDungeon: (realm) =>
    set((state) => ({
      completedDungeons: [...state.completedDungeons, realm],
    })),

  unlockWeapon: (weapon) =>
    set((state) => ({
      unlockedWeapons: [...state.unlockedWeapons, weapon.id],
    })),

  equipWeapon: (weaponId) => set({ currentWeapon: weaponId }),

  setDialogueFlag: (flag, value) =>
    set((state) => ({
      dialogueFlags: { ...state.dialogueFlags, [flag]: value },
    })),

  incrementDungeonAttempt: () =>
    set((state) => ({ dungeonAttempt: state.dungeonAttempt + 1 })),

  resetGame: () => set(initialSaveState),

  setCurrentScene: (scene) => set({ currentScene: scene }),

  isDungeonCompleted: (realm) => get().completedDungeons.includes(realm),

  getAttackPower: () => {
    const state = get();
    let power = PLAYER_BASE_ATTACK;
    // Future: add weapon bonus
    return power;
  },
}));
