import { ToneBufferSource } from 'tone';
import createPrerenderedToneBuffer from './create-prerendered-tone-buffer';

const renderBuffer = ({
  buffer,
  getDestination,
  duration,
  bufferSourceOptions,
}) => {
  const createSource = async () => {
    const destination = await getDestination();
    const bufferSource = new ToneBufferSource(
      Object.assign({}, bufferSourceOptions, { url: buffer })
    );
    bufferSource.connect(destination);
    const start = () => {
      bufferSource.start();
    };
    const dispose = () => {
      bufferSource.dispose();
      destination.dispose();
    };
    return { start, dispose };
  };
  return createPrerenderedToneBuffer({ createSource, duration });
};

export default renderBuffer;
