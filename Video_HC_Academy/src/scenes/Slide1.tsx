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
import {loadFont as loadSpaceMono} from '@remotion/google-fonts/SpaceMono';
import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';

loadSpaceMono();
loadSpaceGrotesk();

const BLUE = '#2563EB';
const DARK_BG = '#0F172A';

export const GridBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: DARK_BG,
				backgroundImage: `
          linear-gradient(to right, ${BLUE} 1px, transparent 1px),
          linear-gradient(to bottom, ${BLUE} 1px, transparent 1px)
        `,
				backgroundSize: '80px 80px',
				opacity: 0.05,
			}}
		/>
	);
};

export const Slide1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoSpring = spring({
		frame,
		fps,
		config: {stiffness: 100},
	});

	const headlinePart1 = "Maîtrisez les Marchés.";
	const headlinePart2 = "Découvrez Horacle Academy.";
	const words1 = headlinePart1.split(' ');
	const words2 = headlinePart2.split(' ');

	const scanlinePos = interpolate(frame, [0, 18], [0, 100], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG}}>
			<GridBackground />
			
			<div
				style={{
					position: 'absolute',
					top: `${scanlinePos}%`,
					left: 0,
					right: 0,
					height: '2px',
					backgroundColor: BLUE,
					boxShadow: `0 0 10px ${BLUE}`,
					zIndex: 10,
					opacity: interpolate(frame, [0, 18], [1, 0], {extrapolateLeft: 'clamp'}),
				}}
			/>

			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 80px'}}>
				<div style={{
					transform: `scale(${0.8 + logoSpring * 0.2})`,
					opacity: logoSpring,
					marginBottom: 60
				}}>
					<Img
						src={staticFile('assets/img/logo.png')}
						style={{width: 200, filter: 'brightness(0) invert(1)'}}
					/>
				</div>

				<div style={{textAlign: 'center'}}>
					<div style={{
						fontFamily: 'Space Mono',
						color: BLUE,
						fontSize: 26,
						textTransform: 'uppercase',
						letterSpacing: 4,
						marginBottom: 40,
						fontWeight: 'bold',
					}}>
						HORACLE ACADEMY
					</div>

					<div style={{
						fontFamily: 'Space Grotesk',
						fontWeight: 'bold',
						fontSize: 90,
						lineHeight: 1.1,
						color: 'white',
						textAlign: 'center'
					}}>
						{words1.map((word, i) => {
							const wordSpring = spring({
								frame: frame - 10 - i * 3,
								fps,
							});
							return (
								<span key={i} style={{
									display: 'inline-block',
									opacity: wordSpring,
									transform: `translateY(${interpolate(wordSpring, [0, 1], [40, 0])}px)`,
									marginRight: '0.25em'
								}}>
									{word}
								</span>
							);
						})}
						<br />
						{words2.map((word, i) => {
							const wordSpring = spring({
								frame: frame - 25 - i * 3,
								fps,
							});
							return (
								<span key={i} style={{
									display: 'inline-block',
									opacity: wordSpring,
									color: BLUE,
									transform: `translateY(${interpolate(wordSpring, [0, 1], [40, 0])}px)`,
									marginRight: '0.25em'
								}}>
									{word}
								</span>
							);
						})}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
