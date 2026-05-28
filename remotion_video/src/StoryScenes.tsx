import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	Img,
	staticFile,
	spring,
} from 'remotion';
import {Video} from '@remotion/media';

const BLUE_BRAND = '#2563EB';
const DARK_BG = '#0F172A';
const WHITE = '#FFFFFF';

const useSpring = (frame: number, config = {}) => {
	const {fps} = useVideoConfig();
	return spring({
		frame,
		fps,
		config: {stiffness: 150, damping: 15, ...config},
	});
};

// --- PHASE 1: BRAND INTRO (0-4s) ---
export const BrandIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
	
	return (
		<AbsoluteFill style={{backgroundColor: BLUE_BRAND, justifyContent: 'center', alignItems: 'center', fontFamily: 'DM Sans, sans-serif'}}>
			<div style={{transform: `scale(${0.8 + s * 0.2})`, opacity: s, textAlign: 'center'}}>
				<Img
					src={staticFile('assets/img/logo.png')}
					style={{width: 280, filter: 'brightness(0) invert(1)', marginBottom: 20}}
				/>
				<h1 style={{color: WHITE, fontSize: 48, fontWeight: 800, textTransform: 'uppercase'}}>
					Découvrez <br/> Horacle Academy
				</h1>
			</div>
			{/* Animated line */}
			<div style={{
				position: 'absolute', bottom: 100, height: 4, backgroundColor: WHITE,
				width: interpolate(s, [0, 1], [0, 200])
			}} />
		</AbsoluteFill>
	);
};

// --- PHASE 2: PROBLEM (4-8s) ---
export const ProblemScene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
	const headlines = ['CPI?', 'FED?', 'PMI?', 'YIELD?', 'QE/QT'];

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, overflow: 'hidden', fontFamily: 'DM Sans, sans-serif'}}>
			{headlines.map((text, i) => {
				const hs = useSpring(frame - i * 5, {mass: 0.4});
				return (
					<div key={i} style={{
						position: 'absolute', top: `${15 + i * 15}%`, left: `${(i * 20) % 60 + 10}%`,
						opacity: hs * 0.2, color: WHITE, fontSize: 40, fontWeight: 900,
						transform: `scale(${0.8 + hs * 0.2})`
					}}>
						{text}
					</div>
				);
			})}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
				<h2 style={{color: WHITE, fontSize: 60, fontWeight: 800, textAlign: 'center', opacity: s}}>
					La macro est <br/>
					<span style={{color: BLUE_BRAND}}>trop mal comprise</span>.
				</h2>
                <Img src={staticFile('assets/img/biglogo.png')} style={{position: 'absolute', right: -100, bottom: -100, width: 400, opacity: 0.1}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// --- PHASE 3: SOLUTION MENTORAT (8-12s) ---
export const MentorshipScene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
	
	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', fontFamily: 'DM Sans, sans-serif'}}>
			<div style={{textAlign: 'center', padding: 40, opacity: s, transform: `scale(${0.9 + s * 0.1})`}}>
				<h2 style={{color: WHITE, fontSize: 55, fontWeight: 800, marginBottom: 30}}>
					Un <span style={{color: BLUE_BRAND}}>mentorat 1 to 1</span> <br/> de A à Z.
				</h2>
				<Img src={staticFile('assets/img/screen_2_terminal.jpeg')} style={{width: '100%', borderRadius: 10, border: '1px solid #334155'}} />
			</div>
		</AbsoluteFill>
	);
};

// --- PHASE 4: FORMULAS (12-16s) ---
export const FormulasScene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
    const s2 = useSpring(frame - 15);

	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, padding: 60, fontFamily: 'DM Sans, sans-serif'}}>
			<h2 style={{color: WHITE, fontSize: 45, fontWeight: 800, marginBottom: 40, textAlign: 'center', opacity: s}}>
				Deux formules sur-mesure :
			</h2>
			<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
				<div style={{
					backgroundColor: BLUE_BRAND, padding: 30, borderRadius: 15, opacity: s,
					transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`
				}}>
					<h3 style={{color: WHITE, margin: 0, fontSize: 32}}>Pack Macro-Analyse</h3>
				</div>
				<div style={{
					border: `2px solid ${BLUE_BRAND}`, padding: 30, borderRadius: 15, opacity: s2,
					transform: `translateX(${interpolate(s2, [0, 1], [50, 0])}px)`
				}}>
					<h3 style={{color: WHITE, margin: 0, fontSize: 32}}>Formule à l'heure</h3>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- PHASE 5: VIDEO DEMO (16-25s) ---
const MacWindow: React.FC<{children: React.ReactNode}> = ({children}) => {
	return (
		<div style={{
			width: '90%', backgroundColor: '#1E293B', borderRadius: '12px',
			overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
		}}>
			<div style={{height: 24, backgroundColor: '#334155', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6}}>
				<div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF5F56'}} />
				<div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFBD2E'}} />
				<div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#27C93F'}} />
			</div>
			<div style={{position: 'relative', height: 1000, backgroundColor: '#000'}}>{children}</div>
		</div>
	);
};

export const VideoScene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center'}}>
			<div style={{transform: `scale(${0.9 + s * 0.1})`, opacity: s, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<MacWindow>
					<Video src={staticFile('assets/videos/academy_scroll.mov')} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
				</MacWindow>
			</div>
		</AbsoluteFill>
	);
};

// --- PHASE 6: FINAL CTA (25-30s) ---
export const FinalCTA: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(frame);
	return (
		<AbsoluteFill style={{backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', fontFamily: 'DM Sans, sans-serif'}}>
			<div style={{textAlign: 'center', padding: 60}}>
				<Img src={staticFile('assets/img/logo.png')} style={{width: 150, marginBottom: 30, filter: 'brightness(0) invert(1)', opacity: s}} />
				<h2 style={{fontSize: 55, fontWeight: 900, color: WHITE, marginBottom: 30, opacity: s}}>PRÊT À PASSER LE CAP ?</h2>
				<div style={{backgroundColor: BLUE_BRAND, color: WHITE, padding: '24px 60px', fontSize: 28, fontWeight: 800, opacity: s}}>
					POSTULER
				</div>
                <p style={{marginTop: 30, color: BLUE_BRAND, fontWeight: 700}}>horaclecapital.com/academy</p>
			</div>
		</AbsoluteFill>
	);
};
