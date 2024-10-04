import * as React from 'react';
import { Card } from '@/components/ui/card';
import StrawberryVisualization from './Strawberry';
import ParticleEdges from './X';

export function BlackCard() {
  return (
    <Card className="w-[710px] h-[500px] m-1">
      <main className="flex flex-col items-center justify-center p-6 space-y-4 font-sans font-normal">
        This canvas is used to display my three.js visuals.
        <br></br>
        {/* <StrawberryVisualization /> */}
        <ParticleEdges />
      </main>
    </Card>
  );
}
