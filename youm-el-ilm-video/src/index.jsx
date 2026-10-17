import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Main} from './Main';
import {cuts} from './timeline';
const Root = () => <Composition id="Main" component={Main} durationInFrames={cuts[cuts.length - 1]} fps={30} width={1080} height={1920} />;
registerRoot(Root);
