import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Main} from './Main';
const Root = () => <Composition id="Main" component={Main} durationInFrames={3600} fps={30} width={1080} height={1920} />;
registerRoot(Root);
