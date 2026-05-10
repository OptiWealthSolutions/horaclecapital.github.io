import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const Noise: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// 0s: Black screen
	// 1s: Grid
	const gridOpacity = interpolate(frame, [fps, fps * 1.5], [0, 0.3], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 2s: Chaos of charts (simulated with random lines/shapes)
	const chaosOpacity = interpolate(frame, [fps * 2, fps * 3], [0, 0.5], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 4s: Keywords popping
	const keywords = [
		'Volatilité',
		'Récession ?',
		'Bulle',
		'FOMC',
		'Guerre Commerciale',
		'Inflation',
		'NFP',
		'Taux d\'intérêt',
	];

	// 9s: Cut to black
	const sceneOpacity = interpolate(frame, [fps * 9, fps * 9.5], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A', opacity: sceneOpacity}}>
			{/* Grid */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: gridOpacity,
					backgroundImage: `linear-gradient(to right, #60A5FA 1px, transparent 1px), linear-gradient(to bottom, #60A5FA 1px, transparent 1px)`,
					backgroundSize: '40px 40px',
				}}
			/>

			{/* Chaos Overlay */}
			{frame > fps * 2 && (
				<div style={{position: 'absolute', inset: 0, opacity: chaosOpacity}}>
					{Array.from({length: 20}).map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								width: `${Math.random() * 200}px`,
								height: '2px',
								backgroundColor: Math.random() > 0.5 ? '#EF4444' : '#10B981',
								transform: `rotate(${Math.random() * 360}deg)`,
							}}
						/>
					))}
				</div>
			)}

			{/* Keywords */}
			{keywords.map((word, i) => {
				const startFrame = fps * 4 + i * 10;
				if (frame < startFrame) return null;
				const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				return (
					<div
						key={word}
						style={{
							position: 'absolute',
							top: `${20 + (i * 10) % 60}%`,
							left: `${10 + (i * 20) % 70}%`,
							color: 'white',
							fontSize: i % 2 === 0 ? '4rem' : '2.5rem',
							fontWeight: 'bold',
							opacity,
							fontFamily: 'DM Sans',
						}}
					>
						{word}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
