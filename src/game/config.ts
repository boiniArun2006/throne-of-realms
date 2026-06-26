// ============================================================
// THRONE OF REALMS — Phaser Game Configuration
// Central configuration that registers all scenes
// Uses real downloaded assets (CC0)
// FIXED: Gravity set to 800 for arcade physics
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { HubWorldScene } from './scenes/HubWorldScene';
import { DungeonScene } from './scenes/DungeonScene';
import { HUDScene } from './scenes/HUDScene';

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#0a0a1e',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 800 },
        debug: false,
      },
    },
    scene: [
      BootScene,
      MenuScene,
      HubWorldScene,
      DungeonScene,
      HUDScene,
    ],
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
    },
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
  };
}
