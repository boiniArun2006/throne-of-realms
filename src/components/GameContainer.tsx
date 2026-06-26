'use client';

// ============================================================
// THRONE OF REALMS — Game Container Component
// React component that creates and manages the Phaser game instance
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { createGameConfig } from '@/game/config';
import { GAME_TITLE, GAME_SUBTITLE } from '@/game/constants';

export default function GameContainer() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent multiple game instances
    if (gameRef.current) {
      return;
    }

    const initGame = async () => {
      try {
        // Dynamic import to ensure Phaser loads only on client
        const Phaser = (await import('phaser')).default;

        if (!gameContainerRef.current) {
          setError('Game container not found');
          return;
        }

        const config = createGameConfig('game-container');

        const game = new Phaser.Game({
          ...config,
          parent: gameContainerRef.current,
        });

        gameRef.current = game;
        setIsLoading(false);

        // Handle game events
        game.events.on('destroy', () => {
          gameRef.current = null;
        });

      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(`Failed to load game engine: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    initGame();

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0a1e]">
      {/* Game Title Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-mono font-bold text-sm">{GAME_TITLE}</span>
          <span className="text-purple-300 font-mono text-xs">— {GAME_SUBTITLE}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-mono text-xs">Alpha v0.1.0</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a1e]">
          <div className="text-2xl font-mono font-bold text-yellow-400 mb-4">{GAME_TITLE}</div>
          <div className="w-48 h-2 bg-gray-800 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 animate-pulse rounded" style={{ width: '60%' }} />
          </div>
          <div className="text-gray-400 font-mono text-sm mt-3">Forging divine weapons...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a1e]">
          <div className="text-red-400 font-mono text-lg mb-2">Engine Error</div>
          <div className="text-gray-400 font-mono text-sm text-center max-w-md">{error}</div>
          <button
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-mono rounded transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Phaser Game Canvas */}
      <div
        id="game-container"
        ref={gameContainerRef}
        className="w-full flex-1 flex items-center justify-center"
        style={{ minHeight: '400px' }}
      />

      {/* Controls Help Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center px-4 py-2 bg-black/40">
        <div className="flex items-center gap-4 text-gray-400 font-mono text-xs">
          <span><kbd className="px-1 bg-gray-700 rounded text-gray-200">←→</kbd> / <kbd className="px-1 bg-gray-700 rounded text-gray-200">WASD</kbd> Move</span>
          <span className="text-gray-600">|</span>
          <span><kbd className="px-1 bg-gray-700 rounded text-gray-200">Z</kbd> / <kbd className="px-1 bg-gray-700 rounded text-gray-200">Space</kbd> Attack</span>
          <span className="text-gray-600">|</span>
          <span><kbd className="px-1 bg-gray-700 rounded text-gray-200">X</kbd> Interact</span>
        </div>
      </div>
    </div>
  );
}
