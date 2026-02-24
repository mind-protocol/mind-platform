'use client';

import { Suspense, lazy } from 'react';
import type { EnvironmentCapture } from '@/lib/tracker/types/environment';
import PanoramaEnvironment from './PanoramaEnvironment';
import MeshEnvironment from './MeshEnvironment';

const SplatEnvironment = lazy(() => import('./SplatEnvironment'));

interface Props {
  env: EnvironmentCapture;
}

/**
 * Dispatches to the correct environment renderer based on capture type.
 */
export default function EnvironmentRenderer({ env }: Props) {
  switch (env.type) {
    case 'panorama':
      return <PanoramaEnvironment url={env.url} />;
    case 'mesh':
      return <MeshEnvironment url={env.url} />;
    case 'splat':
      return (
        <Suspense fallback={null}>
          <SplatEnvironment url={env.url} />
        </Suspense>
      );
    default:
      return null;
  }
}
