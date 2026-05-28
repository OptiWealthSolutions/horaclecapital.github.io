import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	spring,
} from 'remotion';
import {GridBackground} from './Slide1';

const BLUE = '#2563EB';
const DARK_BG = '#0F172A';

export const Slide2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const label = "LE PROBLÈME";
	const charsVisible = Math.floor(frame / (30 / 30));
	const displayedLabel = label.slice(0, charsVisible);

	const showCursor = Math.floor(frame / 10) % 2 === 0;

	const headlineSpring = spring({
		frame: frame - 15,
		fps,
		config: {stiffness: 100},
	});

	const subtextOpacity = interpolate(frame, [35, 50], [0, 0.8], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG}}>
			<GridBackground />
			<div style={{
				position: 'absolute',
				inset: 0,
				background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.5) 100%)',
			}} />

			<AbsoluteFill style={{justifyContent: 'center', padding: '0 100px'}}>
				<div style={{
					fontFamily: 'Space Mono',
					color: BLUE,
					fontSize: 32,
					marginBottom: 40,
					fontWeight: 'bold',
					display: 'flex',
					alignItems: 'center'
				}}>
					{displayedLabel}
					{showCursor && <span style={{width: 20, height: 40, backgroundColor: BLUE, marginLeft: 10}} />}
				</div>

				<h2 style={{
					fontFamily: 'Space Grotesk',
					fontSize: 85,
					fontWeight: 'bold',
					color: 'white',
					lineHeight: 1.1,
					marginBottom: 40,
					opacity: headlineSpring,
					transform: `translateY(${interpolate(headlineSpring, [0, 1], [40, 0])}px)`,
				}}>
					Les marchés ne s'expliquent pas avec des vidéos YouTube.
				</h2>

				<div style={{
					opacity: subtextOpacity,
					transform: `translateY(${interpolate(subtextOpacity, [0, 0.8], [20, 0])}px)`
				}}>
					<div style={{
						fontFamily: 'Space Mono',
						fontSize: 32,
						color: BLUE,
						fontWeight: 'bold',
						marginBottom: 10,
						textTransform: 'uppercase'
					}}>
						› Solution Institutionnelle
					</div>
					<p style={{
						fontFamily: 'Space Grotesk',
						fontSize: 44,
						color: 'white',
						margin: 0,
						lineHeight: 1.2
					}}>
						Passez du chaos à une méthodologie de recherche rigoureuse.
					</p>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
