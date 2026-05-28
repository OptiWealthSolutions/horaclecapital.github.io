import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	spring,
	Easing,
} from 'remotion';

const BLUE = '#2563EB';
const DARK_BG = '#0F172A';

export const Slide4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const countValue = Math.floor(interpolate(frame, [0, 24], [0, 40], {
		easing: Easing.out(Easing.quad),
		extrapolateRight: 'clamp',
	}));

	const labelOpacity = interpolate(frame, [0, 15], [0, 1]);
	const infoOpacity = interpolate(frame, [25, 40], [0, 1]);

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center'}}>
			<div style={{
				position: 'absolute',
				width: 700,
				height: 700,
				background: `radial-gradient(circle, ${BLUE}22 0%, transparent 70%)`,
				opacity: interpolate(frame, [10, 30], [0, 1]),
			}} />

			<div style={{textAlign: 'center', zIndex: 1, padding: '0 120px'}}>
				<div style={{
					fontFamily: 'Space Mono',
					color: BLUE,
					fontSize: 32,
					fontWeight: 'bold',
					marginBottom: 40,
					opacity: labelOpacity,
					letterSpacing: 4
				}}>
					SESSION FLASH
				</div>

				<div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: 60}}>
					<span style={{
						fontFamily: 'Space Grotesk',
						fontSize: 180,
						fontWeight: 900,
						color: BLUE,
					}}>
						{countValue}€
					</span>
					<span style={{
						fontFamily: 'Space Grotesk',
						fontSize: 48,
						color: 'white',
						marginLeft: 30,
						opacity: infoOpacity,
						fontWeight: 'bold'
					}}>
						/ heure de consulting macro
					</span>
				</div>

				<div style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 40,
					fontFamily: 'Space Grotesk',
					fontSize: 32,
					color: 'white',
				}}>
					{['Analyse live', 'Validation de thèse', 'Déblocage rapide'].map((text, i) => {
						const opacity = interpolate(frame, [40 + i * 10, 55 + i * 10], [0, 0.7], {
							extrapolateRight: 'clamp',
						});
						return (
							<React.Fragment key={i}>
								<span style={{opacity}}>{text}</span>
								{i < 2 && <span style={{opacity: 0.3, color: BLUE}}>·</span>}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
