import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	spring,
	Img,
	staticFile,
} from 'remotion';

const BLUE = '#2563EB';
const DARK_BG = '#0F172A';

export const Slide5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const headlineSpring = spring({
		frame,
		fps,
		config: {stiffness: 100},
	});

	const subOpacity = interpolate(frame, [15, 30], [0, 1]);

	const ctaSpring = spring({
		frame: frame - 25,
		fps,
		config: {stiffness: 100},
	});

	const ctaPulse = Math.sin(frame / 6) * 0.02 + 1;
	const ctaRotation = interpolate(ctaSpring, [0, 1], [-1, 0]);

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', padding: '0 60px'}}>
			<div style={{textAlign: 'center'}}>
				<h2 style={{
					fontFamily: 'Space Grotesk',
					fontSize: 100,
					fontWeight: 'bold',
					color: 'white',
					lineHeight: 1,
					marginBottom: 60,
					opacity: headlineSpring,
					transform: `translateY(${interpolate(headlineSpring, [0, 1], [40, 0])}px)`,
				}}>
					Réserve ton appel de diagnostic.
				</h2>

				<div style={{
					display: 'inline-flex',
					alignItems: 'center',
					backgroundColor: `${BLUE}1A`,
					borderLeft: `6px solid ${BLUE}`,
					padding: '15px 30px',
					marginBottom: 80,
					opacity: subOpacity,
				}}>
					<span style={{
						fontFamily: 'Space Mono',
						color: BLUE,
						fontSize: 40,
						fontWeight: 'bold',
						textTransform: 'uppercase',
					}}>
						GRATUIT — sans engagement
					</span>
				</div>

				<div style={{
					transform: `scale(${ctaSpring * ctaPulse}) rotate(${ctaRotation}deg)`,
					opacity: ctaSpring,
				}}>
					<div style={{
						backgroundColor: BLUE,
						padding: '30px 60px',
						borderRadius: 100,
						fontFamily: 'Space Grotesk',
						fontSize: 40,
						fontWeight: 'bold',
						color: 'white',
						textTransform: 'uppercase',
					}}>
						→ horaclecapital.com/academy
					</div>
				</div>
			</div>

			<div style={{
				position: 'absolute',
				bottom: 100,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 20,
				opacity: interpolate(frame, [40, 55], [0, 1]),
			}}>
				<Img
					src={staticFile('assets/img/logo.png')}
					style={{width: 100, filter: 'brightness(0) invert(1)'}}
				/>
				<div style={{
					fontFamily: 'Space Mono',
					color: 'white',
					fontSize: 24,
					opacity: 0.6,
				}}>
					@horacle_capital
				</div>
			</div>
		</AbsoluteFill>
	);
};
