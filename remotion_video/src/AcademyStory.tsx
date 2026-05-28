import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadFont} from '@remotion/google-fonts/DMSans';
import {BrandIntro, ProblemScene, MentorshipScene, FormulasScene, VideoScene, FinalCTA} from './StoryScenes';

// Load fonts
loadFont();

export const AcademyStory: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A'}}>
			{/* Phase 1: Intro (0 - 4s) */}
			<Sequence from={0} durationInFrames={120}>
				<BrandIntro />
			</Sequence>

			{/* Phase 2: Problem (4 - 8s) */}
			<Sequence from={120} durationInFrames={120}>
				<ProblemScene />
			</Sequence>

			{/* Phase 3: Mentorship (8 - 12s) */}
			<Sequence from={240} durationInFrames={120}>
				<MentorshipScene />
			</Sequence>

			{/* Phase 4: Formulas (12 - 16s) */}
			<Sequence from={360} durationInFrames={120}>
				<FormulasScene />
			</Sequence>

			{/* Phase 5: Video Demo (16 - 25s) */}
			<Sequence from={480} durationInFrames={270}>
				<VideoScene />
			</Sequence>

			{/* Phase 6: Final CTA (25 - 30s) */}
			<Sequence from={750} durationInFrames={150}>
				<FinalCTA />
			</Sequence>
		</AbsoluteFill>
	);
};
