// ============================================================
// THRONE OF REALMS — Programmatic Pixel Art Sprite Generator
// All sprites are generated at runtime using Phaser Graphics API
// This gives us full control over art style (pixel-art) without
// needing external asset files.
// ============================================================

import { COLORS, PIXEL_SCALE } from './constants';

/**
 * Generate all game sprites as textures on the Phaser scene's texture manager.
 * Called once during BootScene.
 */
export function generateAllSprites(scene: Phaser.Scene): void {
  generatePlayerSprites(scene);
  generateEnemySprites(scene);
  generateNPCSprites(scene);
  generateEnvironmentSprites(scene);
  generatePortalSprites(scene);
  generateWeaponSprites(scene);
  generateParticleSprites(scene);
  generateUIsprites(scene);
}

// --- Helper: Draw a single pixel (scaled rectangle) ---
function px(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, s: number = PIXEL_SCALE): void {
  g.fillStyle(color, 1);
  g.fillRect(x * s, y * s, s, s);
}

// --- Helper: Draw a filled rectangle of pixels ---
function pxRect(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number, s: number = PIXEL_SCALE): void {
  g.fillStyle(color, 1);
  g.fillRect(x * s, y * s, w * s, h * s);
}

// ============================================================
// PLAYER SPRITES — Veer (normal + transformed)
// 16x24 pixel art character scaled by PIXEL_SCALE
// ============================================================
function generatePlayerSprites(scene: Phaser.Scene): void {
  // --- VEER NORMAL (idle frame 1) ---
  const veerIdle1 = scene.add.graphics();
  // Hair (dark brown)
  pxRect(veerIdle1, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerIdle1, 3, 1, 2, 2, COLORS.veerHair);
  pxRect(veerIdle1, 11, 1, 2, 2, COLORS.veerHair);
  // Face
  pxRect(veerIdle1, 5, 3, 6, 5, COLORS.veerBody);
  // Eyes
  px(veerIdle1, 6, 5, COLORS.veerEyes);
  px(veerIdle1, 9, 5, COLORS.veerEyes);
  // Mouth (slight frown)
  px(veerIdle1, 7, 7, 0x993333);
  px(veerIdle1, 8, 7, 0x993333);
  // Body (white shirt)
  pxRect(veerIdle1, 4, 8, 8, 6, COLORS.veerShirt);
  // Arms
  pxRect(veerIdle1, 2, 9, 2, 4, COLORS.veerBody);
  pxRect(veerIdle1, 12, 9, 2, 4, COLORS.veerBody);
  // Pants (blue)
  pxRect(veerIdle1, 4, 14, 4, 6, COLORS.veerPants);
  pxRect(veerIdle1, 8, 14, 4, 6, COLORS.veerPants);
  // Feet
  pxRect(veerIdle1, 4, 20, 4, 2, 0x4a3728);
  pxRect(veerIdle1, 8, 20, 4, 2, 0x4a3728);
  veerIdle1.generateTexture('veer_idle1', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerIdle1.destroy();

  // --- VEER NORMAL (idle frame 2 — breathing animation) ---
  const veerIdle2 = scene.add.graphics();
  // Same as idle1 with slight body shift
  pxRect(veerIdle2, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerIdle2, 3, 1, 2, 2, COLORS.veerHair);
  pxRect(veerIdle2, 11, 1, 2, 2, COLORS.veerHair);
  pxRect(veerIdle2, 5, 3, 6, 5, COLORS.veerBody);
  px(veerIdle2, 6, 5, COLORS.veerEyes);
  px(veerIdle2, 9, 5, COLORS.veerEyes);
  px(veerIdle2, 7, 7, 0x993333);
  px(veerIdle2, 8, 7, 0x993333);
  pxRect(veerIdle2, 4, 9, 8, 6, COLORS.veerShirt); // shifted down 1px
  pxRect(veerIdle2, 2, 10, 2, 4, COLORS.veerBody);
  pxRect(veerIdle2, 12, 10, 2, 4, COLORS.veerBody);
  pxRect(veerIdle2, 4, 15, 4, 6, COLORS.veerPants);
  pxRect(veerIdle2, 8, 15, 4, 6, COLORS.veerPants);
  pxRect(veerIdle2, 4, 21, 4, 2, 0x4a3728);
  pxRect(veerIdle2, 8, 21, 4, 2, 0x4a3728);
  veerIdle2.generateTexture('veer_idle2', 16 * PIXEL_SCALE, 23 * PIXEL_SCALE);
  veerIdle2.destroy();

  // --- VEER WALK frame 1 (left leg forward) ---
  const veerWalk1 = scene.add.graphics();
  pxRect(veerWalk1, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerWalk1, 3, 1, 2, 2, COLORS.veerHair);
  pxRect(veerWalk1, 11, 1, 2, 2, COLORS.veerHair);
  pxRect(veerWalk1, 5, 3, 6, 5, COLORS.veerBody);
  px(veerWalk1, 6, 5, COLORS.veerEyes);
  px(veerWalk1, 9, 5, COLORS.veerEyes);
  pxRect(veerWalk1, 4, 8, 8, 6, COLORS.veerShirt);
  pxRect(veerWalk1, 2, 9, 2, 4, COLORS.veerBody);
  pxRect(veerWalk1, 12, 8, 2, 4, COLORS.veerBody); // arm forward
  pxRect(veerWalk1, 4, 14, 4, 5, COLORS.veerPants);
  pxRect(veerWalk1, 8, 14, 4, 5, COLORS.veerPants);
  px(veerWalk1, 3, 19, 0x4a3728); // left foot forward
  pxRect(veerWalk1, 4, 19, 3, 2, 0x4a3728);
  pxRect(veerWalk1, 8, 19, 4, 2, 0x4a3728);
  veerWalk1.generateTexture('veer_walk1', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerWalk1.destroy();

  // --- VEER WALK frame 2 (right leg forward) ---
  const veerWalk2 = scene.add.graphics();
  pxRect(veerWalk2, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerWalk2, 3, 1, 2, 2, COLORS.veerHair);
  pxRect(veerWalk2, 11, 1, 2, 2, COLORS.veerHair);
  pxRect(veerWalk2, 5, 3, 6, 5, COLORS.veerBody);
  px(veerWalk2, 6, 5, COLORS.veerEyes);
  px(veerWalk2, 9, 5, COLORS.veerEyes);
  pxRect(veerWalk2, 4, 8, 8, 6, COLORS.veerShirt);
  pxRect(veerWalk2, 2, 8, 2, 4, COLORS.veerBody); // arm forward
  pxRect(veerWalk2, 12, 9, 2, 4, COLORS.veerBody);
  pxRect(veerWalk2, 4, 14, 4, 5, COLORS.veerPants);
  pxRect(veerWalk2, 8, 14, 4, 5, COLORS.veerPants);
  pxRect(veerWalk2, 4, 19, 4, 2, 0x4a3728);
  px(veerWalk2, 12, 19, 0x4a3728); // right foot forward
  pxRect(veerWalk2, 9, 19, 3, 2, 0x4a3728);
  veerWalk2.generateTexture('veer_walk2', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerWalk2.destroy();

  // --- VEER ATTACK frame (arm extended with weapon) ---
  const veerAttack = scene.add.graphics();
  pxRect(veerAttack, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerAttack, 3, 1, 2, 2, COLORS.veerHair);
  pxRect(veerAttack, 11, 1, 2, 2, COLORS.veerHair);
  pxRect(veerAttack, 5, 3, 6, 5, COLORS.veerBody);
  px(veerAttack, 7, 5, COLORS.veerEyes); // eyes looking forward
  px(veerAttack, 10, 5, COLORS.veerEyes);
  pxRect(veerAttack, 4, 8, 8, 6, COLORS.veerShirt);
  pxRect(veerAttack, 2, 9, 2, 4, COLORS.veerBody);
  // Attack arm extended
  pxRect(veerAttack, 12, 7, 6, 2, COLORS.veerBody); // arm
  px(veerAttack, 18, 6, COLORS.agniLava); // fist glow
  px(veerAttack, 18, 8, COLORS.agniLava);
  pxRect(veerAttack, 4, 14, 4, 6, COLORS.veerPants);
  pxRect(veerAttack, 8, 14, 4, 6, COLORS.veerPants);
  pxRect(veerAttack, 4, 20, 4, 2, 0x4a3728);
  pxRect(veerAttack, 8, 20, 4, 2, 0x4a3728);
  veerAttack.generateTexture('veer_attack', 20 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerAttack.destroy();

  // --- VEER HURT ---
  const veerHurt = scene.add.graphics();
  pxRect(veerHurt, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerHurt, 3, 2, 2, 2, COLORS.veerHair);
  pxRect(veerHurt, 11, 2, 2, 2, COLORS.veerHair);
  pxRect(veerHurt, 5, 4, 6, 5, COLORS.veerBody);
  // Hurt eyes (X shape)
  px(veerHurt, 6, 5, COLORS.veerEyes);
  px(veerHurt, 7, 6, COLORS.veerEyes);
  px(veerHurt, 9, 5, COLORS.veerEyes);
  px(veerHurt, 8, 6, COLORS.veerEyes);
  pxRect(veerHurt, 4, 9, 8, 6, COLORS.veerShirt);
  pxRect(veerHurt, 1, 10, 2, 4, COLORS.veerBody);
  pxRect(veerHurt, 13, 10, 2, 4, COLORS.veerBody);
  pxRect(veerHurt, 3, 15, 5, 5, COLORS.veerPants);
  pxRect(veerHurt, 8, 15, 5, 5, COLORS.veerPants);
  pxRect(veerHurt, 3, 20, 4, 2, 0x4a3728);
  pxRect(veerHurt, 8, 20, 4, 2, 0x4a3728);
  veerHurt.generateTexture('veer_hurt', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerHurt.destroy();

  // --- VEER TRANSFORMED (golden glow, powered up, idle) ---
  const veerTransformed = scene.add.graphics();
  // Aura glow behind
  pxRect(veerTransformed, 1, 2, 14, 20, 0xffd700, 1); // faint gold aura
  // Hair (now with golden tips)
  pxRect(veerTransformed, 4, 0, 8, 3, COLORS.veerHair);
  pxRect(veerTransformed, 3, 1, 2, 2, COLORS.veerTransformed);
  pxRect(veerTransformed, 11, 1, 2, 2, COLORS.veerTransformed);
  // Glowing eyes
  pxRect(veerTransformed, 5, 3, 6, 5, COLORS.veerBody);
  px(veerTransformed, 6, 5, COLORS.veerTransformed); // golden eyes
  px(veerTransformed, 9, 5, COLORS.veerTransformed);
  // Body with golden accents
  pxRect(veerTransformed, 4, 8, 8, 6, COLORS.veerShirt);
  px(veerTransformed, 4, 8, COLORS.veerTransformed); // gold trim
  px(veerTransformed, 11, 8, COLORS.veerTransformed);
  pxRect(veerTransformed, 2, 9, 2, 4, COLORS.veerBody);
  pxRect(veerTransformed, 12, 9, 2, 4, COLORS.veerBody);
  pxRect(veerTransformed, 4, 14, 4, 6, COLORS.veerPants);
  pxRect(veerTransformed, 8, 14, 4, 6, COLORS.veerPants);
  pxRect(veerTransformed, 4, 20, 4, 2, 0x4a3728);
  pxRect(veerTransformed, 8, 20, 4, 2, 0x4a3728);
  veerTransformed.generateTexture('veer_transformed', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  veerTransformed.destroy();
}

// ============================================================
// ENEMY SPRITES
// ============================================================
function generateEnemySprites(scene: Phaser.Scene): void {
  // --- SLIME (green blob, 16x12) ---
  const slime1 = scene.add.graphics();
  pxRect(slime1, 3, 4, 10, 8, COLORS.slimeBody);
  pxRect(slime1, 2, 6, 12, 4, COLORS.slimeBody);
  pxRect(slime1, 4, 2, 8, 4, COLORS.slimeBody);
  // Eyes
  px(slime1, 5, 5, 0xffffff);
  px(slime1, 9, 5, 0xffffff);
  px(slime1, 6, 5, 0x000000);
  px(slime1, 10, 5, 0x000000);
  // Mouth
  px(slime1, 7, 8, 0x2d6b3f);
  slime1.generateTexture('slime_idle1', 16 * PIXEL_SCALE, 12 * PIXEL_SCALE);
  slime1.destroy();

  const slime2 = scene.add.graphics();
  pxRect(slime2, 4, 5, 8, 7, COLORS.slimeBody);
  pxRect(slime2, 3, 7, 10, 3, COLORS.slimeBody);
  pxRect(slime2, 5, 3, 6, 4, COLORS.slimeBody);
  px(slime2, 6, 6, 0xffffff);
  px(slime2, 9, 6, 0xffffff);
  px(slime2, 7, 6, 0x000000);
  px(slime2, 10, 6, 0x000000);
  px(slime2, 8, 9, 0x2d6b3f);
  slime2.generateTexture('slime_idle2', 16 * PIXEL_SCALE, 12 * PIXEL_SCALE);
  slime2.destroy();

  // --- SKELETON (bone-white, 16x24) ---
  const skeleton = scene.add.graphics();
  // Skull
  pxRect(skeleton, 5, 0, 6, 6, COLORS.skeletonBody);
  px(skeleton, 6, 2, 0x000000); // eye socket
  px(skeleton, 9, 2, 0x000000);
  px(skeleton, 7, 4, 0x000000); // nose
  pxRect(skeleton, 6, 5, 4, 1, 0x000000); // mouth
  // Spine
  pxRect(skeleton, 7, 6, 2, 8, COLORS.skeletonBody);
  // Ribs
  pxRect(skeleton, 5, 8, 6, 1, COLORS.skeletonBody);
  pxRect(skeleton, 5, 10, 6, 1, COLORS.skeletonBody);
  pxRect(skeleton, 5, 12, 6, 1, COLORS.skeletonBody);
  // Arms
  pxRect(skeleton, 3, 8, 2, 6, COLORS.skeletonBody);
  pxRect(skeleton, 11, 8, 2, 6, COLORS.skeletonBody);
  // Legs
  pxRect(skeleton, 6, 14, 2, 8, COLORS.skeletonBody);
  pxRect(skeleton, 8, 14, 2, 8, COLORS.skeletonBody);
  // Feet
  pxRect(skeleton, 5, 22, 3, 2, COLORS.skeletonBody);
  pxRect(skeleton, 8, 22, 3, 2, COLORS.skeletonBody);
  skeleton.generateTexture('skeleton_idle', 16 * PIXEL_SCALE, 24 * PIXEL_SCALE);
  skeleton.destroy();

  // --- DEMON (red, horned, 16x24) ---
  const demon = scene.add.graphics();
  // Horns
  px(demon, 4, 0, 0x8b0000);
  px(demon, 5, 1, 0x8b0000);
  px(demon, 10, 1, 0x8b0000);
  px(demon, 11, 0, 0x8b0000);
  // Head
  pxRect(demon, 4, 2, 8, 6, COLORS.demonBody);
  px(demon, 6, 4, 0xffff00); // glowing eyes
  px(demon, 9, 4, 0xffff00);
  pxRect(demon, 6, 6, 4, 1, 0x000000); // mouth
  // Body
  pxRect(demon, 3, 8, 10, 8, 0x8b0000);
  // Arms
  pxRect(demon, 1, 9, 2, 6, COLORS.demonBody);
  pxRect(demon, 13, 9, 2, 6, COLORS.demonBody);
  px(demon, 1, 15, 0x8b0000); // claws
  px(demon, 14, 15, 0x8b0000);
  // Legs
  pxRect(demon, 4, 16, 4, 6, 0x8b0000);
  pxRect(demon, 8, 16, 4, 6, 0x8b0000);
  pxRect(demon, 3, 22, 4, 2, 0x5c0000);
  pxRect(demon, 9, 22, 4, 2, 0x5c0000);
  demon.generateTexture('demon_idle', 16 * PIXEL_SCALE, 24 * PIXEL_SCALE);
  demon.destroy();

  // --- YOKAI (purple ghost, 16x20) ---
  const yokai = scene.add.graphics();
  // Ghost body
  pxRect(yokai, 4, 2, 8, 14, COLORS.yokaiBody);
  pxRect(yokai, 3, 4, 10, 10, COLORS.yokaiBody);
  pxRect(yokai, 5, 0, 6, 4, COLORS.yokaiBody);
  // Face (mask-like)
  px(yokai, 6, 5, 0xffffff);
  px(yokai, 9, 5, 0xffffff);
  px(yokai, 6, 6, 0xff0000); // red eyes
  px(yokai, 9, 6, 0xff0000);
  pxRect(yokai, 6, 9, 4, 1, 0x000000); // mouth slit
  // Wispy bottom
  px(yokai, 4, 16, COLORS.yokaiBody);
  px(yokai, 6, 16, COLORS.yokaiBody);
  px(yokai, 8, 16, COLORS.yokaiBody);
  px(yokai, 10, 16, COLORS.yokaiBody);
  px(yokai, 5, 17, COLORS.yokaiBody);
  px(yokai, 9, 17, COLORS.yokaiBody);
  yokai.generateTexture('yokai_idle', 16 * PIXEL_SCALE, 18 * PIXEL_SCALE);
  yokai.destroy();

  // --- BOSS (large demon, 32x40) ---
  const boss = scene.add.graphics();
  // Large horns
  pxRect(boss, 4, 0, 4, 4, 0x8b0000);
  pxRect(boss, 24, 0, 4, 4, 0x8b0000);
  px(boss, 3, 2, 0x8b0000);
  px(boss, 28, 2, 0x8b0000);
  // Head
  pxRect(boss, 6, 4, 20, 10, COLORS.demonBody);
  // Eyes (3 pairs, demonic)
  px(boss, 9, 7, 0xffff00);
  px(boss, 12, 7, 0xffff00);
  px(boss, 19, 7, 0xffff00);
  px(boss, 22, 7, 0xffff00);
  // Mouth
  pxRect(boss, 10, 11, 12, 2, 0x000000);
  px(boss, 11, 11, 0xffffff); // fangs
  px(boss, 14, 11, 0xffffff);
  px(boss, 17, 11, 0xffffff);
  px(boss, 20, 11, 0xffffff);
  // Body
  pxRect(boss, 4, 14, 24, 14, 0x8b0000);
  // Arms
  pxRect(boss, 0, 16, 4, 10, COLORS.demonBody);
  pxRect(boss, 28, 16, 4, 10, COLORS.demonBody);
  // Fists
  pxRect(boss, 0, 26, 5, 4, COLORS.demonBody);
  pxRect(boss, 27, 26, 5, 4, COLORS.demonBody);
  // Legs
  pxRect(boss, 6, 28, 8, 10, 0x8b0000);
  pxRect(boss, 18, 28, 8, 10, 0x8b0000);
  // Feet
  pxRect(boss, 4, 38, 10, 2, 0x5c0000);
  pxRect(boss, 18, 38, 10, 2, 0x5c0000);
  // Aura indicators
  pxRect(boss, 2, 6, 2, 2, COLORS.bossAura);
  pxRect(boss, 28, 6, 2, 2, COLORS.bossAura);
  boss.generateTexture('boss_idle', 32 * PIXEL_SCALE, 40 * PIXEL_SCALE);
  boss.destroy();
}

// ============================================================
// NPC SPRITES
// ============================================================
function generateNPCSprites(scene: Phaser.Scene): void {
  // --- HANA (cherry blossom dress, 16x22) ---
  const hana = scene.add.graphics();
  // Hair (long, black with pink flower)
  pxRect(hana, 3, 0, 10, 4, COLORS.hanaHair);
  pxRect(hana, 2, 2, 2, 8, COLORS.hanaHair); // long hair left
  pxRect(hana, 12, 2, 2, 8, COLORS.hanaHair); // long hair right
  px(hana, 11, 1, COLORS.hanaDress); // flower
  px(hana, 12, 0, COLORS.hanaDress);
  // Face
  pxRect(hana, 4, 4, 8, 5, 0xffe0bd);
  px(hana, 6, 6, COLORS.veerEyes);
  px(hana, 9, 6, COLORS.veerEyes);
  px(hana, 7, 8, 0xff6b6b); // lips
  px(hana, 8, 8, 0xff6b6b);
  // Dress (cherry blossom pink)
  pxRect(hana, 3, 9, 10, 10, COLORS.hanaDress);
  pxRect(hana, 2, 10, 2, 8, COLORS.hanaDress); // sleeves
  pxRect(hana, 12, 10, 2, 8, COLORS.hanaDress);
  // Feet
  pxRect(hana, 5, 19, 3, 2, 0x4a3728);
  pxRect(hana, 9, 19, 3, 2, 0x4a3728);
  hana.generateTexture('hana_idle', 16 * PIXEL_SCALE, 21 * PIXEL_SCALE);
  hana.destroy();

  // --- NIRVANI (old woman in purple robe, 16x22) ---
  const nirvani = scene.add.graphics();
  // Hair (silver, pulled back)
  pxRect(nirvani, 5, 0, 6, 2, COLORS.nirvaniHair);
  // Face (elderly)
  pxRect(nirvani, 4, 2, 8, 6, 0xffe0bd);
  px(nirvani, 6, 4, COLORS.veerEyes);
  px(nirvani, 9, 4, COLORS.veerEyes);
  px(nirvani, 7, 5, 0x808080); // wrinkle lines
  px(nirvani, 8, 5, 0x808080);
  px(nirvani, 7, 7, 0x996666); // mouth
  // Robe (purple, flowing)
  pxRect(nirvani, 3, 8, 10, 12, COLORS.nirvaniRobe);
  pxRect(nirvani, 2, 9, 12, 10, COLORS.nirvaniRobe);
  pxRect(nirvani, 1, 18, 14, 4, COLORS.nirvaniRobe);
  // Hands
  px(nirvani, 2, 15, 0xffe0bd);
  px(nirvani, 13, 15, 0xffe0bd);
  // Staff
  pxRect(nirvani, 14, 4, 1, 16, 0x654321);
  px(nirvani, 14, 3, COLORS.yamaSoul); // orb on staff
  px(nirvani, 13, 2, COLORS.yamaSoul);
  nirvani.generateTexture('nirvani_idle', 16 * PIXEL_SCALE, 22 * PIXEL_SCALE);
  nirvani.destroy();
}

// ============================================================
// ENVIRONMENT TILES & OBJECTS
// ============================================================
function generateEnvironmentSprites(scene: Phaser.Scene): void {
  // --- GROUND TILE (32x32) ---
  const groundTile = scene.add.graphics();
  pxRect(groundTile, 0, 0, 32, 32, COLORS.hubGround);
  // Grass top
  pxRect(groundTile, 0, 0, 32, 4, COLORS.hubGrass);
  // Texture detail
  for (let i = 0; i < 8; i++) {
    px(groundTile, 4 + i * 4, 10 + (i % 3) * 4, 0xc4985a);
    px(groundTile, 2 + i * 4, 20 + (i % 2) * 4, 0xb8884a);
  }
  groundTile.generateTexture('tile_ground', 32, 32);
  groundTile.destroy();

  // --- STONE TILE (32x32) ---
  const stoneTile = scene.add.graphics();
  pxRect(stoneTile, 0, 0, 32, 32, COLORS.hubStone);
  // Stone texture
  pxRect(stoneTile, 0, 0, 31, 31, COLORS.hubStone);
  pxRect(stoneTile, 0, 0, 32, 1, 0x999999);
  pxRect(stoneTile, 0, 0, 1, 32, 0x999999);
  pxRect(stoneTile, 15, 0, 2, 32, 0x666666);
  pxRect(stoneTile, 0, 15, 32, 2, 0x666666);
  stoneTile.generateTexture('tile_stone', 32, 32);
  stoneTile.destroy();

  // --- WOOD TILE (32x32) ---
  const woodTile = scene.add.graphics();
  pxRect(woodTile, 0, 0, 32, 32, COLORS.hubWood);
  for (let i = 0; i < 4; i++) {
    pxRect(woodTile, 0, i * 8, 32, 1, 0x7a5b12);
  }
  pxRect(woodTile, 0, 0, 1, 32, 0x6a4b02);
  pxRect(woodTile, 31, 0, 1, 32, 0x6a4b02);
  woodTile.generateTexture('tile_wood', 32, 32);
  woodTile.destroy();

  // --- WATER TILE (32x32) ---
  const waterTile = scene.add.graphics();
  pxRect(waterTile, 0, 0, 32, 32, COLORS.hubWater);
  for (let i = 0; i < 4; i++) {
    pxRect(waterTile, 0, 4 + i * 8, 32, 2, 0x5a9ac4);
    pxRect(waterTile, 8 + i * 4, 2 + i * 6, 16, 1, 0x6aaac4);
  }
  waterTile.generateTexture('tile_water', 32, 32);
  waterTile.destroy();

  // --- TREE (64x80) ---
  const tree = scene.add.graphics();
  // Trunk
  pxRect(tree, 12, 30, 8, 30, COLORS.hubTreeTrunk);
  // Canopy (circular-ish)
  pxRect(tree, 6, 4, 20, 8, COLORS.hubTreeLeaves);
  pxRect(tree, 4, 8, 24, 16, COLORS.hubTreeLeaves);
  pxRect(tree, 2, 12, 28, 12, COLORS.hubTreeLeaves);
  pxRect(tree, 4, 24, 24, 8, COLORS.hubTreeLeaves);
  // Light spots
  px(tree, 10, 10, 0x32a852);
  px(tree, 18, 14, 0x32a852);
  px(tree, 14, 20, 0x32a852);
  tree.generateTexture('obj_tree', 32, 60);
  tree.destroy();

  // --- HOUSE (half-constructed, 128x96) ---
  const house = scene.add.graphics();
  // Walls (partial - under construction)
  pxRect(house, 4, 24, 56, 48, COLORS.hubWood);
  // Missing wall section (open)
  pxRect(house, 4, 24, 56, 8, COLORS.hubWood);
  pxRect(house, 4, 48, 24, 24, COLORS.hubWood);
  // Left wall has gap
  pxRect(house, 4, 32, 16, 16, 0x87ceeb); // open to sky
  // Roof (half done, Japanese-style curve)
  pxRect(house, 0, 16, 64, 8, COLORS.hubRoofRed);
  pxRect(house, 0, 12, 64, 4, COLORS.hubRoofRed);
  pxRect(house, 0, 8, 60, 4, COLORS.hubRoofRed);
  // Pillars
  pxRect(house, 4, 24, 4, 48, 0x5a3a1a);
  pxRect(house, 56, 24, 4, 48, 0x5a3a1a);
  pxRect(house, 30, 24, 4, 48, 0x5a3a1a);
  // Door opening
  pxRect(house, 24, 40, 16, 32, 0x1a1a2e);
  // Scaffolding
  pxRect(house, 60, 20, 2, 52, 0x8b6914);
  pxRect(house, 60, 40, 8, 2, 0x8b6914);
  house.generateTexture('obj_house', 64, 72);
  house.destroy();

  // --- TEMPLE (Indian-Japanese mix, 96x80) ---
  const temple = scene.add.graphics();
  // Base
  pxRect(temple, 4, 40, 56, 24, COLORS.hubStone);
  // Steps
  pxRect(temple, 0, 60, 64, 4, COLORS.hubStone);
  pxRect(temple, 2, 56, 60, 4, COLORS.hubStone);
  // Door
  pxRect(temple, 24, 44, 16, 20, 0x2c1810);
  // Japanese-style roof
  pxRect(temple, -4, 32, 72, 8, COLORS.hubRoofRed);
  pxRect(temple, -8, 28, 80, 4, COLORS.hubRoofRed);
  pxRect(temple, -4, 24, 72, 4, COLORS.hubRoofRed);
  // Indian-style dome on top
  pxRect(temple, 24, 16, 16, 8, COLORS.hubRoofGold);
  pxRect(temple, 28, 12, 8, 4, COLORS.hubRoofGold);
  pxRect(temple, 30, 8, 4, 4, COLORS.hubRoofGold);
  // Torii gate elements
  pxRect(temple, -8, 28, 4, 32, COLORS.hubRoofRed);
  pxRect(temple, 68, 28, 4, 32, COLORS.hubRoofRed);
  temple.generateTexture('obj_temple', 64, 64);
  temple.destroy();

  // --- BATHROOM BUILDING (48x48) ---
  const bathroom = scene.add.graphics();
  // Walls
  pxRect(bathroom, 2, 12, 28, 24, COLORS.hubBathroom);
  // Roof (small, curved)
  pxRect(bathroom, 0, 8, 32, 4, COLORS.hubRoofRed);
  pxRect(bathroom, 0, 4, 28, 4, COLORS.hubRoofRed);
  // Door
  pxRect(bathroom, 10, 20, 12, 16, COLORS.hubBathroomDoor);
  // Glow around door (portal hint)
  pxRect(bathroom, 9, 19, 14, 18, 0x8a2be2, 1); // faint purple glow
  // Sign
  pxRect(bathroom, 12, 12, 8, 4, 0xffffff);
  // Water drop on sign
  px(bathroom, 15, 13, COLORS.hubWater);
  px(bathroom, 16, 13, COLORS.hubWater);
  bathroom.generateTexture('obj_bathroom', 32, 36);
  bathroom.destroy();

  // --- TORII GATE (48x64) ---
  const torii = scene.add.graphics();
  // Pillars
  pxRect(torii, 4, 8, 4, 56, COLORS.hubRoofRed);
  pxRect(torii, 40, 8, 4, 56, COLORS.hubRoofRed);
  // Top beam
  pxRect(torii, 0, 0, 48, 4, COLORS.hubRoofRed);
  pxRect(torii, 0, 4, 48, 2, 0xa02020);
  // Middle beam
  pxRect(torii, 4, 16, 40, 4, COLORS.hubRoofRed);
  torii.generateTexture('obj_torii', 48, 64);
  torii.destroy();

  // --- LANTERN (16x24) ---
  const lantern = scene.add.graphics();
  // Pole
  pxRect(lantern, 6, 8, 4, 16, 0x654321);
  // Lamp
  pxRect(lantern, 2, 2, 12, 8, 0xffe4b5);
  pxRect(lantern, 3, 3, 10, 6, 0xff8c00);
  // Glow
  px(lantern, 5, 4, 0xffd700);
  px(lantern, 9, 4, 0xffd700);
  px(lantern, 5, 6, 0xffd700);
  px(lantern, 9, 6, 0xffd700);
  // Roof
  pxRect(lantern, 0, 0, 16, 3, COLORS.hubRoofRed);
  lantern.generateTexture('obj_lantern', 16, 24);
  lantern.destroy();
}

// ============================================================
// PORTAL SPRITES
// ============================================================
function generatePortalSprites(scene: Phaser.Scene): void {
  // --- BATHROOM PORTAL (swirling purple/blue, 48x48) ---
  const portal = scene.add.graphics();
  // Outer ring
  pxRect(portal, 4, 4, 40, 40, COLORS.portalPurple);
  pxRect(portal, 8, 2, 32, 44, COLORS.portalBlue);
  pxRect(portal, 2, 8, 44, 32, COLORS.portalBlue);
  // Inner swirl
  pxRect(portal, 12, 12, 24, 24, COLORS.portalGlow);
  pxRect(portal, 16, 10, 16, 28, COLORS.portalGlow);
  pxRect(portal, 10, 16, 28, 16, COLORS.portalGlow);
  // Center bright
  pxRect(portal, 18, 18, 12, 12, 0xffffff);
  pxRect(portal, 20, 16, 8, 16, 0xe0e0ff);
  pxRect(portal, 16, 20, 16, 8, 0xe0e0ff);
  portal.generateTexture('portal_bathroom', 48, 48);
  portal.destroy();

  // --- DUNGEON EXIT PORTAL (golden, 48x48) ---
  const exitPortal = scene.add.graphics();
  pxRect(exitPortal, 4, 4, 40, 40, 0xd4a017);
  pxRect(exitPortal, 8, 2, 32, 44, 0xffd700);
  pxRect(exitPortal, 2, 8, 44, 32, 0xffd700);
  pxRect(exitPortal, 12, 12, 24, 24, 0xffea00);
  pxRect(exitPortal, 18, 18, 12, 12, 0xffffff);
  exitPortal.generateTexture('portal_exit', 48, 48);
  exitPortal.destroy();
}

// ============================================================
// WEAPON SPRITES (visual representations of divine weapons)
// ============================================================
function generateWeaponSprites(scene: Phaser.Scene): void {
  // --- CHAKRA (spinning disc, 24x24) ---
  const chakra = scene.add.graphics();
  pxRect(chakra, 4, 4, 16, 16, COLORS.agniLava);
  pxRect(chakra, 2, 8, 20, 8, COLORS.agniLava);
  pxRect(chakra, 8, 2, 8, 20, COLORS.agniLava);
  pxRect(chakra, 8, 8, 8, 8, COLORS.agniAccent);
  pxRect(chakra, 10, 10, 4, 4, 0xffffff);
  chakra.generateTexture('weapon_chakra', 24, 24);
  chakra.destroy();

  // --- SWORD (32x8) ---
  const sword = scene.add.graphics();
  // Blade
  pxRect(sword, 8, 2, 20, 4, 0xc0c0c0);
  pxRect(sword, 10, 3, 16, 2, 0xe0e0e0);
  // Tip
  px(sword, 28, 3, 0xc0c0c0);
  px(sword, 29, 4, 0xc0c0c0);
  // Guard
  pxRect(sword, 6, 0, 4, 8, COLORS.hubRoofGold);
  // Handle
  pxRect(sword, 0, 2, 6, 4, 0x654321);
  pxRect(sword, 2, 1, 2, 6, 0x654321);
  sword.generateTexture('weapon_sword', 32, 8);
  sword.destroy();

  // --- STAFF (8x40) ---
  const staff = scene.add.graphics();
  pxRect(staff, 3, 8, 2, 32, 0x654321);
  // Orb
  pxRect(staff, 1, 0, 6, 8, COLORS.yamaSoul);
  pxRect(staff, 2, 1, 4, 6, 0xb090e0);
  px(staff, 3, 2, 0xffffff);
  staff.generateTexture('weapon_staff', 8, 40);
  staff.destroy();

  // --- FIST (attack effect, 16x16) ---
  const fist = scene.add.graphics();
  pxRect(fist, 2, 4, 12, 10, COLORS.veerBody);
  pxRect(fist, 4, 2, 8, 4, COLORS.veerBody);
  pxRect(fist, 2, 10, 3, 4, COLORS.veerBody);
  pxRect(fist, 11, 10, 3, 4, COLORS.veerBody);
  // Impact lines
  px(fist, 14, 4, 0xffffff);
  px(fist, 15, 2, 0xffffff);
  px(fist, 15, 6, 0xffffff);
  fist.generateTexture('weapon_fist', 16, 16);
  fist.destroy();
}

// ============================================================
// PARTICLE & EFFECT SPRITES
// ============================================================
function generateParticleSprites(scene: Phaser.Scene): void {
  // --- Generic glow particle (8x8) ---
  const glow = scene.add.graphics();
  pxRect(glow, 2, 2, 4, 4, 0xffffff);
  px(glow, 3, 1, 0xffffff);
  px(glow, 3, 6, 0xffffff);
  px(glow, 1, 3, 0xffffff);
  px(glow, 6, 3, 0xffffff);
  glow.generateTexture('particle_glow', 8, 8);
  glow.destroy();

  // --- Fire particle (6x6) ---
  const fire = scene.add.graphics();
  pxRect(fire, 1, 2, 4, 4, COLORS.agniLava);
  pxRect(fire, 2, 1, 2, 2, 0xffff00);
  px(fire, 2, 0, 0xffffff);
  fire.generateTexture('particle_fire', 6, 6);
  fire.destroy();

  // --- Spark particle (4x4) ---
  const spark = scene.add.graphics();
  pxRect(spark, 1, 1, 2, 2, 0xffffff);
  spark.generateTexture('particle_spark', 4, 4);
  spark.destroy();

  // --- Soul particle (6x6) ---
  const soul = scene.add.graphics();
  pxRect(soul, 1, 1, 4, 4, COLORS.yamaSoul);
  px(soul, 2, 2, 0xd8b4fe);
  soul.generateTexture('particle_soul', 6, 6);
  soul.destroy();
}

// ============================================================
// UI SPRITES
// ============================================================
function generateUIsprites(scene: Phaser.Scene): void {
  // --- Heart icon (12x12) ---
  const heart = scene.add.graphics();
  pxRect(heart, 2, 2, 3, 3, COLORS.healthBar);
  pxRect(heart, 7, 2, 3, 3, COLORS.healthBar);
  pxRect(heart, 1, 4, 10, 3, COLORS.healthBar);
  pxRect(heart, 2, 7, 8, 2, COLORS.healthBar);
  pxRect(heart, 3, 9, 6, 2, COLORS.healthBar);
  pxRect(heart, 4, 11, 4, 1, COLORS.healthBar);
  heart.generateTexture('ui_heart', 12, 12);
  heart.destroy();

  // --- Empty heart icon ---
  const heartEmpty = scene.add.graphics();
  pxRect(heartEmpty, 2, 2, 3, 3, 0x333333);
  pxRect(heartEmpty, 7, 2, 3, 3, 0x333333);
  pxRect(heartEmpty, 1, 4, 10, 3, 0x333333);
  pxRect(heartEmpty, 2, 7, 8, 2, 0x333333);
  pxRect(heartEmpty, 3, 9, 6, 2, 0x333333);
  pxRect(heartEmpty, 4, 11, 4, 1, 0x333333);
  heartEmpty.generateTexture('ui_heart_empty', 12, 12);
  heartEmpty.destroy();

  // --- Weapon slot (16x16) ---
  const weaponSlot = scene.add.graphics();
  pxRect(weaponSlot, 0, 0, 16, 16, 0x2c3e50);
  pxRect(weaponSlot, 1, 1, 14, 14, 0x34495e);
  pxRect(weaponSlot, 2, 2, 12, 12, 0x3d566e);
  weaponSlot.generateTexture('ui_weapon_slot', 16, 16);
  weaponSlot.destroy();
}
