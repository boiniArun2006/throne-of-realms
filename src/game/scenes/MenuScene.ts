// ============================================================
// THRONE OF REALMS — Main Menu Scene
// Epic title screen with animated background + music
// Uses Press Start 2P + MedievalSharp fonts
// FIXED: Memory leak (Graphics created every frame)
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, GAME_TITLE, GAME_SUBTITLE } from '../constants';
import { MusicManager } from '../systems/MusicManager';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Container;
  private musicManager!: MusicManager;
  private bgStars: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];
  private portalAngle: number = 0;
  private starGraphics!: Phaser.GameObjects.Graphics;
  private portalGfx!: Phaser.GameObjects.Graphics;
  private logoImage!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    // --- Music ---
    this.musicManager = new MusicManager(this);
    this.musicManager.play('music_menu', { volume: 0.25, loop: true });

    // --- Background gradient ---
    const bg = this.add.graphics();
    for (let y = 0; y < GAME_HEIGHT; y++) {
      const ratio = y / GAME_HEIGHT;
      const r = Math.floor(10 + ratio * 15);
      const g = Math.floor(10 + ratio * 20);
      const b = Math.floor(30 + ratio * 50);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, y, GAME_WIDTH, 1);
    }
    bg.setDepth(0);

    // --- Star field data ---
    for (let i = 0; i < 60; i++) {
      this.bgStars.push({
        x: Phaser.Math.Between(0, GAME_WIDTH),
        y: Phaser.Math.Between(0, GAME_HEIGHT),
        speed: Phaser.Math.FloatBetween(0.2, 1.0),
        size: Phaser.Math.Between(1, 3),
        alpha: Phaser.Math.FloatBetween(0.3, 1.0),
      });
    }

    // --- Star graphics (created once, redrawn each frame) ---
    this.starGraphics = this.add.graphics();
    this.starGraphics.setDepth(1);

    // --- Portal graphics (created once, redrawn each frame) ---
    this.portalGfx = this.add.graphics();
    this.portalGfx.setDepth(2);

    // --- Game Logo Image ---
    if (this.textures.exists('game_logo')) {
      this.logoImage = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, 'game_logo');
      this.logoImage.setScale(0.35);
      this.logoImage.setDepth(9);
    }

    // --- Title (MedievalSharp for fantasy headings) ---
    this.titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, GAME_TITLE, {
      fontSize: '40px',
      fontFamily: 'MedievalSharp, serif',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#8b4513',
      strokeThickness: 4,
      shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 8, fill: true },
    }).setOrigin(0.5).setDepth(10);

    // --- Subtitle (Press Start 2P for pixel text) ---
    this.subtitleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_SUBTITLE, {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#e0b0ff',
      stroke: '#4a0080',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    // --- Start Button ---
    this.createStartButton();

    // --- Controls hint (Silkscreen for small UI) ---
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'Arrow Keys / WASD: Move  |  Z / Space: Attack  |  X: Interact', {
      fontSize: '9px',
      fontFamily: '"Silkscreen", monospace',
      color: '#606060',
    }).setOrigin(0.5).setDepth(10);

    // --- Version ---
    this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v0.3.0-alpha', {
      fontSize: '8px',
      fontFamily: '"Silkscreen", monospace',
      color: '#404040',
    }).setOrigin(1).setDepth(10);

    // --- Input ---
    this.input.keyboard?.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard?.on('keydown-ENTER', () => this.startGame());

    // --- Touch to start ---
    this.input.on('pointerdown', () => {
      if (!this.game.device.os.desktop) {
        this.startGame();
      }
    });
  }

  update(time: number, delta: number): void {
    // --- Animate stars (reuse single Graphics object) ---
    this.starGraphics.clear();
    for (const star of this.bgStars) {
      star.y += star.speed * (delta / 16);
      if (star.y > GAME_HEIGHT) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
      this.starGraphics.fillStyle(0xffffff, star.alpha * (0.5 + 0.5 * Math.sin(time / 1000 + star.x)));
      this.starGraphics.fillCircle(star.x, star.y, star.size);
    }

    // --- Portal rotation ---
    this.portalAngle += delta * 0.002;
    this.drawPortal();

    // --- Title pulse ---
    const pulse = 1 + 0.03 * Math.sin(time / 500);
    this.titleText.setScale(pulse);

    // --- Subtitle shimmer ---
    this.subtitleText.setAlpha(0.7 + 0.3 * Math.sin(time / 800));

    // --- Logo pulse ---
    if (this.logoImage) {
      const logoPulse = 0.35 + 0.01 * Math.sin(time / 600);
      this.logoImage.setScale(logoPulse);
    }
  }

  private drawPortal(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 + 20;
    this.portalGfx.clear();
    for (let i = 0; i < 3; i++) {
      const angle = this.portalAngle + (i * Math.PI * 2) / 3;
      const radius = 60 + i * 15;
      this.portalGfx.lineStyle(2, 0x8a2be2, 0.3 + i * 0.15);
      this.portalGfx.beginPath();
      this.portalGfx.arc(cx, cy, radius, angle, angle + 2);
      this.portalGfx.strokePath();
    }
    this.portalGfx.fillStyle(0xe0b0ff, 0.15 + 0.05 * Math.sin(this.portalAngle * 3));
    this.portalGfx.fillCircle(cx, cy, 40);
  }

  private createStartButton(): void {
    const btnX = GAME_WIDTH / 2;
    const btnY = GAME_HEIGHT / 2 + 70;

    // Button background (golden/warm — NO neon)
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3d2b1f, 0.9); // Dark brown
    btnBg.fillRoundedRect(-90, -22, 180, 44, 6);
    btnBg.lineStyle(2, 0xd4a017, 1); // Gold border
    btnBg.strokeRoundedRect(-90, -22, 180, 44, 6);

    // Button text (Press Start 2P)
    const btnText = this.add.text(0, 0, 'START QUEST', {
      fontSize: '14px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.startButton = this.add.container(btnX, btnY, [btnBg, btnText]);
    this.startButton.setDepth(10);
    this.startButton.setSize(180, 44);
    this.startButton.setInteractive();

    this.startButton.on('pointerover', () => {
      this.tweens.add({ targets: this.startButton, scaleX: 1.06, scaleY: 1.06, duration: 100 });
      btnText.setColor('#ffffff');
    });

    this.startButton.on('pointerout', () => {
      this.tweens.add({ targets: this.startButton, scaleX: 1, scaleY: 1, duration: 100 });
      btnText.setColor('#ffd700');
    });

    this.startButton.on('pointerdown', () => this.startGame());
  }

  private startGame(): void {
    // Flash effect
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 1);
    flash.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    flash.setDepth(100);
    flash.setAlpha(0);

    // Play click SFX
    if (this.cache.audio.exists('sfx_click')) {
      this.sound.play('sfx_click', { volume: 0.5 });
    }

    // Fade out music
    this.musicManager.stop(1000);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: 1 },
      duration: 200,
      yoyo: true,
      onComplete: () => {
        flash.destroy();
        this.scene.start(SCENES.HUB);
        this.scene.launch(SCENES.HUD);
      },
    });
  }
}
