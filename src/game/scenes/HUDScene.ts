// ============================================================
// THRONE OF REALMS — HUD Scene
// Overlay UI showing health, weapon, dungeon info
// Runs in parallel with game scenes
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, COLORS, GAME_TITLE, CHARACTERS } from '../constants';
import { useGameState } from '../GameState';

export class HUDScene extends Phaser.Scene {
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private weaponIcon!: Phaser.GameObjects.Image;
  private weaponName!: Phaser.GameObjects.Text;
  private dungeonName!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private interactionHint!: Phaser.GameObjects.Text;

  private currentHp: number = 100;
  private maxHp: number = 100;
  private displayHp: number = 100; // For smooth health bar animation

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    // HUD should not be affected by camera scroll
    this.cameras.main.setScroll(0, 0);
    this.physics.world.setBounds(0, 0, 0, 0);

    // --- Health Bar ---
    this.healthBar = this.add.graphics();
    this.drawHealthBar();

    this.healthText = this.add.text(24, 18, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2,
    }).setDepth(100);

    // --- Weapon Display ---
    this.weaponName = this.add.text(GAME_WIDTH - 20, 12, '', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(1, 0).setDepth(100);

    // --- Dungeon Name ---
    this.dungeonName = this.add.text(GAME_WIDTH / 2, 12, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#e0b0ff',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(100);

    // --- Combo Counter ---
    this.comboText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
      fontSize: '32px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#8b4513',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100).setAlpha(0);

    // --- Interaction Hint ---
    this.interactionHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(100);

    // --- Setup event listeners from game state ---
    this.setupStateListeners();
  }

  update(_time: number, delta: number): void {
    // Smooth health bar interpolation
    if (this.displayHp !== this.currentHp) {
      const diff = this.currentHp - this.displayHp;
      this.displayHp += diff * Math.min(1, delta / 200);
      if (Math.abs(this.displayHp - this.currentHp) < 1) {
        this.displayHp = this.currentHp;
      }
      this.drawHealthBar();
    }

    // Update health text
    this.healthText.setText(`HP: ${Math.floor(this.currentHp)}/${this.maxHp}`);

    // Update weapon name
    const gameState = useGameState.getState();
    this.weaponName.setText(`Weapon: ${gameState.currentWeapon.replace(/_/g, ' ').toUpperCase()}`);

    // Update dungeon name based on current scene
    if (gameState.currentScene === SCENES.DUNGEON) {
      this.dungeonName.setText('DUNGEON');
    } else if (gameState.currentScene === SCENES.HUB) {
      this.dungeonName.setText(`Village of ${CHARACTERS.WORLD}`);
    } else {
      this.dungeonName.setText('');
    }
  }

  private drawHealthBar(): void {
    this.healthBar.clear();

    const barX = 20;
    const barY = 10;
    const barWidth = 160;
    const barHeight = 16;

    // Background
    this.healthBar.fillStyle(COLORS.healthBarBg, 0.8);
    this.healthBar.fillRoundedRect(barX, barY, barWidth, barHeight, 4);

    // Health fill
    const healthPercent = Math.max(0, this.displayHp / this.maxHp);
    const fillColor = healthPercent > 0.5 ? 0x2ecc71 : healthPercent > 0.25 ? 0xf39c12 : 0xe74c3c;
    this.healthBar.fillStyle(fillColor, 1);
    this.healthBar.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * healthPercent, barHeight - 4, 3);

    // Border
    this.healthBar.lineStyle(1, COLORS.healthBarStroke, 0.6);
    this.healthBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 4);

    // Damage flash (when health is low)
    if (healthPercent < 0.25) {
      this.healthBar.fillStyle(0xff0000, 0.2 + 0.1 * Math.sin(Date.now() / 200));
      this.healthBar.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * healthPercent, barHeight - 4, 3);
    }
  }

  public updateHealth(hp: number, maxHp: number): void {
    this.currentHp = hp;
    this.maxHp = maxHp;
  }

  public showCombo(count: number): void {
    this.comboText.setText(`${count}x COMBO!`);
    this.comboText.setAlpha(1);
    this.comboText.setScale(1.5);

    this.tweens.add({
      targets: this.comboText,
      alpha: 0,
      scaleX: 1,
      scaleY: 1,
      y: GAME_HEIGHT / 2 - 30,
      duration: 800,
      ease: 'Power2',
    });
  }

  public showHint(text: string): void {
    this.interactionHint.setText(text);
    this.interactionHint.setAlpha(1);
  }

  public hideHint(): void {
    this.interactionHint.setAlpha(0);
  }

  private setupStateListeners(): void {
    // Listen for game state changes
    const gameState = useGameState.getState();

    // Initial values
    this.currentHp = gameState.playerHp;
    this.maxHp = gameState.playerMaxHp;
    this.displayHp = this.currentHp;
  }
}
