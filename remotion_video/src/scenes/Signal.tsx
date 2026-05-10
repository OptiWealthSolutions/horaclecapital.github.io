import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';

export const Signal: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// 11s: "La Clarté"
	const clarityOpacity = interpolate(frame, [0, fps, fps * 3, fps * 4], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 14s: Blue line starts appearing after "La Clarté" fades
	const lineProgress = spring({
		frame: frame - fps * 3,
		fps,
		config: {stiffness: 100},
	});

	// Sub-sections
	// 16s: Rapports
	const reportsOpacity = interpolate(frame, [fps * 5, fps * 6, fps * 8, fps * 9], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 20s: Research
	const researchOpacity = interpolate(frame, [fps * 9, fps * 10, fps * 13, fps * 14], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 25s: Capitalis
	const capitalisOpacity = interpolate(frame, [fps * 14, fps * 15, fps * 18, fps * 19], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// 30s: Academy
	const academyOpacity = interpolate(frame, [fps * 19, fps * 20, fps * 23, fps * 24], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#0F172A'}}>
			{/* La Clarté */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: clarityOpacity,
					fontFamily: 'DM Serif Display',
					fontSize: '6rem',
					color: 'white',
				}}
			>
				La Clarté.
			</div>

			{/* Blue Line */}
			{frame > fps * 3 && (
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: 0,
						width: `${lineProgress * 100}%`,
						height: '4px',
						backgroundColor: '#2563EB',
						transform: 'translateY(-50%)',
					}}
				/>
			)}

			{/* Rapports UI */}
			<AbsoluteFill style={{opacity: reportsOpacity, justifyContent: 'center', alignItems: 'center'}}>
				<div style={{color: 'white', fontSize: '3rem', fontFamily: 'DM Sans'}}>
					Rapports Hebdomadaires.
				</div>
				<div style={{marginTop: 20, width: 600, height: 300, border: '1px solid #2563EB', padding: 20}}>
					<div style={{height: 20, width: '40%', backgroundColor: '#2563EB', marginBottom: 10}} />
					<div style={{height: 10, width: '90%', backgroundColor: '#334155', marginBottom: 5}} />
					<div style={{height: 10, width: '85%', backgroundColor: '#334155', marginBottom: 5}} />
					<div style={{height: 150, width: '100%', border: '1px solid #334155', marginTop: 20}} />
				</div>
			</AbsoluteFill>

			{/* Research UI */}
			<AbsoluteFill style={{opacity: researchOpacity, justifyContent: 'center', alignItems: 'center'}}>
				<div style={{color: 'white', fontSize: '3rem', fontFamily: 'DM Sans'}}>
					Recherche Quantitative.
				</div>
				<div style={{marginTop: 20, width: 600, height: 300, position: 'relative'}}>
					{Array.from({length: 12}).map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								width: 10,
								height: 10,
								borderRadius: '50%',
								backgroundColor: '#60A5FA',
								top: `${Math.sin(i) * 100 + 150}px`,
								left: `${Math.cos(i) * 200 + 300}px`,
							}}
						/>
					))}
				</div>
			</AbsoluteFill>

			{/* Capitalis UI */}
			<AbsoluteFill style={{opacity: capitalisOpacity, justifyContent: 'center', alignItems: 'center'}}>
				<div style={{color: 'white', fontSize: '4rem', fontFamily: 'DM Sans'}}>
					Capitalis.
				</div>
				<div style={{marginTop: 20, width: 800, height: 450, backgroundColor: '#1C2236', border: '1px solid #2563EB', borderRadius: 10, padding: 30}}>
					<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
						<div style={{height: 30, width: 200, backgroundColor: '#2563EB'}} />
						<div style={{height: 30, width: 100, backgroundColor: '#334155'}} />
					</div>
					<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
						<div style={{height: 150, backgroundColor: '#243044'}} />
						<div style={{height: 150, backgroundColor: '#243044'}} />
						<div style={{height: 150, backgroundColor: '#243044'}} />
					</div>
				</div>
			</AbsoluteFill>

			{/* Academy UI */}
			<AbsoluteFill style={{opacity: academyOpacity, justifyContent: 'center', alignItems: 'center'}}>
				<div style={{color: 'white', fontSize: '3rem', fontFamily: 'DM Sans'}}>
					Horacle Academy.
				</div>
				<div style={{display: 'flex', gap: 50, marginTop: 40}}>
					<div style={{width: 150, height: 150, borderRadius: '50%', border: '2px solid #60A5FA'}} />
					<div style={{width: 150, height: 150, borderRadius: '50%', border: '2px solid #60A5FA'}} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
