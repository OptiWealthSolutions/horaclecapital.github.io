import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const Brand: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoOpacity = interpolate(frame, [fps, fps * 2], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const urlOpacity = interpolate(frame, [fps * 4, fps * 5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			{/* Logo Placeholder - Can be replaced with <Img src={staticFile('logo.svg')} /> */}
			<div style={{opacity: logoOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{color: 'white', fontSize: '6rem', fontFamily: 'DM Serif Display', fontWeight: 'bold', letterSpacing: '0.1em'}}>
					HORACLE CAPITAL
				</div>
				<div style={{width: 100, height: 4, backgroundColor: '#2563EB', marginTop: 10}} />
			</div>

			{/* Website URL */}
			<div
				style={{
					opacity: urlOpacity,
					color: 'rgba(255, 255, 255, 0.6)',
					fontFamily: 'DM Sans',
					fontSize: '2rem',
					marginTop: 50,
				}}
			>
				horaclecapital.com
			</div>
		</AbsoluteFill>
	);
};
