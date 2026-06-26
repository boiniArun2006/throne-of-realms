// ============================================================
// THRONE OF REALMS — Music Manager
// Handles background music playback with crossfade
// Manages different tracks per scene with loop
// ============================================================

import Phaser from 'phaser';

export class MusicManager {
  private scene: Phaser.Scene;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private currentKey: string | null = null;
  private volume: number = 0.3;
  private fadeDuration: number = 800;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /** Play a music track, fading out any currently playing track */
  play(key: string, options?: { volume?: number; loop?: boolean; fadeMs?: number }): void {
    // Don't restart the same track
    if (this.currentKey === key && this.currentMusic && (this.currentMusic as Phaser.Sound.WebAudioSound).isPlaying) {
      return;
    }

    const loop = options?.loop !== false;
    const vol = options?.volume ?? this.volume;
    const fadeMs = options?.fadeMs ?? this.fadeDuration;

    // Fade out current music
    if (this.currentMusic) {
      const oldMusic = this.currentMusic as Phaser.Sound.WebAudioSound;
      if (oldMusic.isPlaying) {
        this.scene.tweens.add({
          targets: oldMusic,
          volume: 0,
          duration: fadeMs,
          onComplete: () => {
            oldMusic.stop();
          },
        });
      }
    }

    // Play new music
    if (this.scene.cache.audio.exists(key)) {
      const newMusic = this.scene.sound.add(key, {
        loop,
        volume: 0,
      }) as Phaser.Sound.WebAudioSound;

      newMusic.play();

      // Fade in
      this.scene.tweens.add({
        targets: newMusic,
        volume: vol,
        duration: fadeMs,
      });

      this.currentMusic = newMusic;
      this.currentKey = key;
    } else {
      console.warn(`[MusicManager] Music key "${key}" not found in cache`);
    }
  }

  /** Stop current music with fade out */
  stop(fadeMs?: number): void {
    if (!this.currentMusic) return;

    const duration = fadeMs ?? this.fadeDuration;
    const music = this.currentMusic as Phaser.Sound.WebAudioSound;

    this.scene.tweens.add({
      targets: music,
      volume: 0,
      duration,
      onComplete: () => {
        music.stop();
        music.destroy();
      },
    });

    this.currentMusic = null;
    this.currentKey = null;
  }

  /** Set master volume */
  setVolume(vol: number): void {
    this.volume = Phaser.Math.Clamp(vol, 0, 1);
    if (this.currentMusic) {
      (this.currentMusic as Phaser.Sound.WebAudioSound).setVolume(this.volume);
    }
  }

  /** Get current playing track key */
  getCurrentTrack(): string | null {
    return this.currentKey;
  }

  destroy(): void {
    this.stop(0);
  }
}
