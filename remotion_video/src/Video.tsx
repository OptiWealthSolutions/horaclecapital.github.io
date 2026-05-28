import {Composition} from 'remotion';
import {Main} from './Main';
import {AcademyStory} from './AcademyStory';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={55 * 30} // 55 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="AcademyStory"
				component={AcademyStory}
				durationInFrames={30 * 30} // 30 seconds at 30fps
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
