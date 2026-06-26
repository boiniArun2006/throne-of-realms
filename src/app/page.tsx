'use client';

import dynamic from 'next/dynamic';

// Dynamic import to ensure Phaser only loads on client side
const GameContainer = dynamic(
  () => import('@/components/GameContainer'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0a1e]">
      <GameContainer />
    </main>
  );
}
