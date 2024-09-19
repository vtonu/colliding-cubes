import * as React from 'react';
import { Card } from '@/components/ui/card';
import CollidingCubes from './CollidingCubes';

export function BlackCard() {
  return (
    <Card className="w-[710px] h-[500px] m-1">
      <main className="flex flex-col items-center justify-center p-6 space-y-4">
        Canvas used to display the cubes and their information.
        <br></br>
        <CollidingCubes />
      </main>
    </Card>
  );
}
