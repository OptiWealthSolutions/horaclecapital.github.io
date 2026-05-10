import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadFont} from '@remotion/google-fonts/DMSans';
import {loadFont as loadSerifFont} from '@remotion/google-fonts/DMSerifDisplay';
import {Noise} from './scenes/Noise';
import {Signal} from './scenes/Signal';
import {Synthesis} from './scenes/Synthesis';
import {Brand} from './scenes/Brand';

// Load fonts
loadFont();
loadSerifFont();

export const Main: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A'}}>
			{/* Scene 1: The Noise (0 - 10s) */}
			<Sequence from={0} durationInFrames={300}>
				<Noise />
			</Sequence>

			{/* Scene 2: The Signal (11 - 35s) */}
			<Sequence from={330} durationInFrames={720}>
				<Signal />
			</Sequence>

			{/* Scene 3: The Synthesis (36 - 48s) */}
			<Sequence from={1080} durationInFrames={360}>
				<Synthesis />
			</Sequence>

			{/* Scene 4: The Brand (49 - 55s) */}
			<Sequence from={1470} durationInFrames={180}>
				<Brand />
			</Sequence>
		</AbsoluteFill>
	);
};
