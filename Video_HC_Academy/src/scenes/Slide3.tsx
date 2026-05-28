import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	spring,
} from 'remotion';

const BLUE = '#2563EB';
const DARK_BG = '#0F172A';
const LIGHT_BG = '#1E293B';

const items = [
	'Architecture Monétaire',
	'Dynamique de l\'Inflation',
	'Cycles & Sentiment',
	'Synthèse Stratégique',
];

export const Slide3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enterSpring = spring({
		frame,
		fps,
		config: {stiffness: 100},
	});

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, display: 'flex', flexDirection: 'row'}}>
			{/* Left side depth */}
			<div style={{
				width: '150px',
				height: '100%',
				backgroundColor: LIGHT_BG,
				borderRight: `1px solid ${BLUE}22`
			}} />

			<AbsoluteFill style={{left: '150px', padding: '0 80px', justifyContent: 'center'}}>
				<div style={{
					opacity: enterSpring,
					transform: `translateX(${interpolate(enterSpring, [0, 1], [-50, 0])}px)`
				}}>
					<div style={{
						fontFamily: 'Space Mono',
						color: BLUE,
						fontSize: 28,
						fontWeight: 'bold',
						marginBottom: 30,
					}}>
						PROGRAMME ÉLITE · 450€
					</div>

					<h2 style={{
						fontFamily: 'Space Grotesk',
						fontSize: 80,
						fontWeight: 'bold',
						color: 'white',
						lineHeight: 1.1,
						marginBottom: 40,
					}}>
						4 Modules. <br/> Une Méthode. <br/> Une Intuition.
					</h2>

					<div style={{
						width: interpolate(enterSpring, [0.5, 1], [0, 100], {extrapolateLeft: 'clamp'}) + '%',
						height: '2px',
						backgroundColor: BLUE,
						marginBottom: 60,
					}} />

					<div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
						{items.map((item, i) => {
							const itemSpring = spring({
								frame: frame - 20 - i * 6, // 120ms stagger approx
								fps,
							});
							const pulse = Math.sin(frame / 4) * 0.2 + 1;

							return (
								<div key={i} style={{
									display: 'flex',
									alignItems: 'center',
									gap: 20,
									opacity: itemSpring,
									transform: `translateY(${interpolate(itemSpring, [0, 1], [20, 0])}px)`
								}}>
									<span style={{
										color: BLUE,
										fontSize: 40,
										fontWeight: 'bold',
										transform: `scale(${pulse})`
									}}>
										›
									</span>
									<span style={{
										fontFamily: 'Space Grotesk',
										fontSize: 44,
										color: 'white',
										fontWeight: 500
									}}>
										{item}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
