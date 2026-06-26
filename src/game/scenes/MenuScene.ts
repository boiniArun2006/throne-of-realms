// ============================================================
// THRONE OF REALMS — Main Menu Scene
// Epic title screen with animated background + music
// Uses Press Start 2P + MedievalSharp fonts
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
  private particles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    // --- Music ---
    this.musicManager = new MusicManager(this);
    this.musicManager.play('music_menu', { volume: 0.25, loop: true });

    // --- Background ---
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

    // --- Star field ---
    for (let i = 0; i < 60; i++) {
      this.bgStars.push({
        x: Phaser.Math.Between(0, GAME_WIDTH),
        y: Phaser.Math.Between(0, GAME_HEIGHT),
        speed: Phaser.Math.FloatBetween(0.2, 1.0),
        size: Phaser.Math.Between(1, 3),
        alpha: Phaser.Math.FloatBetween(0.3, 1.0),
      });
    }

    // --- Portal animation ---
    this.createPortalEffect(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

    // --- Title (MedievalSharp for fantasy headings) ---
    this.titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, GAME_TITLE, {
      fontSize: '40px',
      fontFamily: 'MedievalSharp, serif',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#8b4513',
      strokeThickness: 4,
      shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 8, fill: true },
    }).setOrigin(0.5).setDepth(10);

    // --- Subtitle (Press Start 2P for pixel text) ---
    this.subtitleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 35, GAME_SUBTITLE, {
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
    this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v0.2.0-alpha', {
      fontSize: '8px',
      fontFamily: '"Silkscreen", monospace',
      color: '#404040',
    }).setOrigin(1).setDepth(10);

    // --- Input ---
    this.input.keyboard?.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard?.on('keydown-ENTER', () => this.startGame());

    // --- Touch to start ---
    this.input.on('pointerdown', () => {
      // On mobile, tap anywhere to start
      if (!this.game.device.os.desktop) {
        this.startGame();
      }
    });
  }

  update(time: number, delta: number): void {
    // Animate stars
    const starGraphics = this.add.graphics();
    starGraphics.setDepth(1);
    for (const star of this.bgStars) {
      star.y += star.speed * (delta / 16);
      if (star.y > GAME_HEIGHT) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
      starGraphics.fillStyle(0xffffff, star.alpha * (0.5 + 0.5 * Math.sin(time / 1000 + star.x)));
      starGraphics.fillCircle(star.x, star.y, star.size);
    }

    // Portal rotation
    this.portalAngle += delta * 0.002;

    // Title pulse
    const pulse = 1 + 0.03 * Math.sin(time / 500);
    this.titleText.setScale(pulse);

    // Subtitle shimmer
    this.subtitleText.setAlpha(0.7 + 0.3 * Math.sin(time / 800));

    // Clean particles
    this.particles.forEach(p => p.destroy());
    this.particles = [];

    // Portal particles
    if (Phaser.Math.Between(0, 3) === 0) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(40, 80);
      const px = GAME_WIDTH / 2 + Math.cos(angle) * dist;
      const py = GAME_HEIGHT / 2 - 30 + Math.sin(angle) * dist;
      const particle = this.add.graphics();
      particle.fillStyle(0xe0b0ff, 0.6);
      particle.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      particle.setPosition(px, py);
      particle.setDepth(2);
      this.particles.push(particle);
      this.tweens.add({
        targets: particle, alpha: 0, y: py - 30, duration: 1000,
        onComplete: () => particle.destroy(),
      });
    }
  }

  private createPortalEffect(cx: number, cy: number): void {
    const portal = this.add.graphics();
    portal.setDepth(2);

    const drawPortal = () => {
      portal.clear();
      for (let i = 0; i < 3; i++) {
        const angle = this.portalAngle + (i * Math.PI * 2) / 3;
        const radius = 60 + i * 15;
        portal.lineStyle(2, 0x8a2be2, 0.3 + i * 0.15);
        portal.beginPath();
        portal.arc(cx, cy, radius, angle, angle + 2);
        portal.strokePath();
      }
      portal.fillStyle(0xe0b0ff, 0.15 + 0.05 * Math.sin(this.portalAngle * 3));
      portal.fillCircle(cx, cy, 40);
    };

    this.events.on('update', drawPortal);
    drawPortal();
  }

  private createStartButton(): void {
    const btnX = GAME_WIDTH / 2;
    const btnY = GAME_HEIGHT / 2 + 40;

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
