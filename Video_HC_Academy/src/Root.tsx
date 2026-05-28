import {Composition} from 'remotion';
import {Slide1} from './scenes/Slide1';
import {Slide2} from './scenes/Slide2';
import {Slide3} from './scenes/Slide3';
import {Slide4} from './scenes/Slide4';
import {Slide5} from './scenes/Slide5';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';

export const Main: React.FC = () => {
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={90}>
				<Slide1 />
			</TransitionSeries.Sequence>
			
			<TransitionSeries.Transition
				presentation={wipe({direction: 'from-right'})}
				timing={linearTiming({durationInFrames: 8})}
			/>
			
			<TransitionSeries.Sequence durationInFrames={90}>
				<Slide2 />
			</TransitionSeries.Sequence>
			
			<TransitionSeries.Transition
				presentation={fade()}
				timing={linearTiming({durationInFrames: 6})}
			/>
			
			<TransitionSeries.Sequence durationInFrames={105}>
				<Slide3 />
			</TransitionSeries.Sequence>
			
			<TransitionSeries.Transition
				presentation={slide({direction: 'from-bottom'})}
				timing={linearTiming({durationInFrames: 9})}
			/>
			
			<TransitionSeries.Sequence durationInFrames={90}>
				<Slide4 />
			</TransitionSeries.Sequence>
			
			<TransitionSeries.Transition
				presentation={fade()}
				timing={linearTiming({durationInFrames: 8})}
			/>
			
			<TransitionSeries.Sequence durationInFrames={105}>
				<Slide5 />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="HC-Academy-Story"
			component={Main}
			durationInFrames={480}
			fps={30}
			width={1080}
			height={1920}
		/>
	);
};
