import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Main} from './Main';
import {Base} from './scenes';
import {cuts} from './timeline';

/* the shared glowing navy stage on its own, for export as a background plate */
const Background = () => <Base seed={7} center={[540, 960]} />;

const Root = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={cuts[cuts.length - 1]} fps={30} width={1080} height={1920} />
    <Composition id="Background" component={Background} durationInFrames={450} fps={30} width={1080} height={1920} />
  </>
);
registerRoot(Root);
