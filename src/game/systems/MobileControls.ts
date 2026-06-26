// ============================================================
// THRONE OF REALMS — Mobile Touch Controls
// Virtual D-pad + Action buttons for Android/mobile
// Uses Kenney mobile control assets
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

export class MobileControls extends Phaser.GameObjects.Container {
  // D-pad
  private dpad!: Phaser.GameObjects.Image;
  private dpadUp!: Phaser.GameObjects.Image;
  private dpadDown!: Phaser.GameObjects.Image;
  private dpadLeft!: Phaser.GameObjects.Image;
  private dpadRight!: Phaser.GameObjects.Image;

  // Action buttons
  private btnAttack!: Phaser.GameObjects.Image;
  private btnInteract!: Phaser.GameObjects.Image;

  // State
  public moveDirection: { left: boolean; right: boolean; up: boolean; down: boolean } = {
    left: false, right: false, up: false, down: false,
  };
  public attackPressed: boolean = false;
  public interactPressed: boolean = false;

  // Input simulation
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.setDepth(300);
    this.setScrollFactor(0);

    // Only show on touch devices
    if (!scene.input.pointer1) {
      this.setVisible(false);
      return;
    }

    this.createDPad();
    this.createActionButtons();
    this.setupTouchInput();
  }

  private createDPad(): void {
    const dpadX = 100;
    const dpadY = GAME_HEIGHT - 100;
    const dpadScale = 1.5;

    // Main D-pad background
    this.dpad = this.scene.add.image(dpadX, dpadY, 'mobile_dpad');
    this.dpad.setScale(dpadScale);
    this.dpad.setAlpha(0.5);
    this.dpad.setDepth(300);
    this.dpad.setScrollFactor(0);
    this.add(this.dpad);

    // Directional elements (highlighted when pressed)
    const elementOffset = 22 * dpadScale;

    this.dpadUp = this.scene.add.image(dpadX, dpadY - elementOffset, 'mobile_dpad_up');
    this.dpadUp.setScale(dpadScale);
    this.dpadUp.setAlpha(0);
    this.dpadUp.setDepth(301);
    this.dpadUp.setScrollFactor(0);
    this.add(this.dpadUp);

    this.dpadDown = this.scene.add.image(dpadX, dpadY + elementOffset, 'mobile_dpad_down');
    this.dpadDown.setScale(dpadScale);
    this.dpadDown.setAlpha(0);
    this.dpadDown.setDepth(301);
    this.dpadDown.setScrollFactor(0);
    this.add(this.dpadDown);

    this.dpadLeft = this.scene.add.image(dpadX - elementOffset, dpadY, 'mobile_dpad_left');
    this.dpadLeft.setScale(dpadScale);
    this.dpadLeft.setAlpha(0);
    this.dpadLeft.setDepth(301);
    this.dpadLeft.setScrollFactor(0);
    this.add(this.dpadLeft);

    this.dpadRight = this.scene.add.image(dpadX + elementOffset, dpadY, 'mobile_dpad_right');
    this.dpadRight.setScale(dpadScale);
    this.dpadRight.setAlpha(0);
    this.dpadRight.setDepth(301);
    this.dpadRight.setScrollFactor(0);
    this.add(this.dpadRight);
  }

  private createActionButtons(): void {
    const btnX = GAME_WIDTH - 100;
    const btnY = GAME_HEIGHT - 100;
    const btnScale = 1.8;

    // Attack button (square)
    this.btnAttack = this.scene.add.image(btnX - 30, btnY - 20, 'mobile_btn_attack');
    this.btnAttack.setScale(btnScale);
    this.btnAttack.setAlpha(0.5);
    this.btnAttack.setDepth(300);
    this.btnAttack.setScrollFactor(0);

    // Attack label
    const attackLabel = this.scene.add.text(btnX - 30, btnY - 20, 'ATK', {
      fontSize: '10px',
      fontFamily: 'Press Start 2P, monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);
    this.add(this.btnAttack);
    this.add(attackLabel);

    // Interact button (diamond)
    this.btnInteract = this.scene.add.image(btnX + 30, btnY + 20, 'mobile_btn_interact');
    this.btnInteract.setScale(btnScale);
    this.btnInteract.setAlpha(0.5);
    this.btnInteract.setDepth(300);
    this.btnInteract.setScrollFactor(0);

    // Interact label
    const interactLabel = this.scene.add.text(btnX + 30, btnY + 20, 'INT', {
      fontSize: '10px',
      fontFamily: 'Press Start 2P, monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);
    this.add(this.btnInteract);
    this.add(interactLabel);
  }

  private setupTouchInput(): void {
    // D-pad touch zones
    const dpadX = 100;
    const dpadY = GAME_HEIGHT - 100;
    const dpadRadius = 60;

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x < 200 && pointer.y > GAME_HEIGHT - 200) {
        // D-pad area
        const dx = pointer.x - dpadX;
        const dy = pointer.y - dpadY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < dpadRadius) {
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) { this.moveDirection.right = true; this.dpadRight.setAlpha(0.8); }
            else { this.moveDirection.left = true; this.dpadLeft.setAlpha(0.8); }
          } else {
            if (dy > 0) { this.moveDirection.down = true; this.dpadDown.setAlpha(0.8); }
            else { this.moveDirection.up = true; this.dpadUp.setAlpha(0.8); }
          }
        }
      }

      // Attack button area
      if (pointer.x > GAME_WIDTH - 180 && pointer.y > GAME_HEIGHT - 180) {
        const atkX = GAME_WIDTH - 130;
        const atkY = GAME_HEIGHT - 120;
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, atkX, atkY);
        if (dist < 50) {
          this.attackPressed = true;
          this.btnAttack.setAlpha(1);
        }
      }

      // Interact button area
      if (pointer.x > GAME_WIDTH - 180 && pointer.y > GAME_HEIGHT - 180) {
        const intX = GAME_WIDTH - 70;
        const intY = GAME_HEIGHT - 80;
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, intX, intY);
        if (dist < 50) {
          this.interactPressed = true;
          this.btnInteract.setAlpha(1);
        }
      }
    });

    this.scene.input.on('pointerup', () => {
      // Reset all
      this.moveDirection = { left: false, right: false, up: false, down: false };
      this.attackPressed = false;
      this.interactPressed = false;

      this.dpadUp.setAlpha(0);
      this.dpadDown.setAlpha(0);
      this.dpadLeft.setAlpha(0);
      this.dpadRight.setAlpha(0);
      this.btnAttack.setAlpha(0.5);
      this.btnInteract.setAlpha(0.5);
    });
  }

  /** Check if this is a touch device */
  static isTouchDevice(scene: Phaser.Scene): boolean {
    return !scene.game.device.os.desktop;
  }
}
