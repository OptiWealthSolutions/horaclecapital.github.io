import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';

export const Synthesis: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Convergence (36s - 40s) -> Relative frames [0 - 120]
	const convergence = spring({
		frame,
		fps,
		config: {stiffness: 100},
	});

	// Fusion into sphere (40s - 43s) -> Relative frames [120 - 210]
	const fusionOpacity = interpolate(frame, [fps * 4, fps * 5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Final phrase (43s) -> Relative frames [210+]
	const phraseOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			{/* Panels Convergence */}
			{frame < fps * 5 && (
				<div style={{position: 'relative', width: 400, height: 400}}>
					{[
						{top: -200, left: -200},
						{top: -200, left: 200},
						{top: 200, left: -200},
						{top: 200, left: 200},
					].map((pos, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								width: 150,
								height: 100,
								backgroundColor: '#2563EB',
								border: '1px solid white',
								top: `calc(50% + ${pos.top * (1 - convergence)}px)`,
								left: `calc(50% + ${pos.left * (1 - convergence)}px)`,
								transform: 'translate(-50%, -50%)',
								opacity: 1 - fusionOpacity,
							}}
						/>
					))}
				</div>
			)}

			{/* Blue Sphere */}
			<div
				style={{
					position: 'absolute',
					width: 200,
					height: 200,
					borderRadius: '50%',
					backgroundColor: '#60A5FA',
					boxShadow: '0 0 50px #2563EB',
					opacity: fusionOpacity * (1 - phraseOpacity),
					transform: `scale(${interpolate(frame, [fps * 4, fps * 7], [0.5, 1.5], {extrapolateRight: 'clamp'})})`,
				}}
			/>

			{/* Final Phrase */}
			<div
				style={{
					opacity: phraseOpacity,
					color: 'white',
					fontFamily: 'DM Serif Display',
					fontSize: '5rem',
					textAlign: 'center',
				}}
			>
				Le signal. Pas le bruit.
			</div>
		</AbsoluteFill>
	);
};
