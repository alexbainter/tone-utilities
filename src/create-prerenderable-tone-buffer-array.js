import createToneBuffer from './create-tone-buffer';
import renderToneBuffer from './render-tone-buffer';
import noop from './utilities/noop';

const createPrerenderableBufferArray = async ({
  samples,
  sourceInstrumentName,
  renderedInstrumentName,
  sampleLibrary,
  getDestination,
  additionalRenderLength = 0,
  onProgress = noop,
  bufferSourceOptions = {},
} = {}) => {
  if (samples[renderedInstrumentName]) {
    return Promise.all(
      samples[renderedInstrumentName].map((buffer) => createToneBuffer(buffer))
    );
  }
  const sourceBuffers = await Promise.all(
    samples[sourceInstrumentName].map((buffer) => createToneBuffer(buffer))
  );
  const renderedBuffers = await Promise.all(
    sourceBuffers.map(async (buffer, i) => {
      const renderedBuffer = await renderToneBuffer({
        buffer,
        getDestination,
        bufferSourceOptions,
        duration: buffer.duration + additionalRenderLength,
      });
      buffer.dispose();
      onProgress((i + 1) / sourceBuffers.length);
      return renderedBuffer;
    })
  );
  sampleLibrary.save([[renderedInstrumentName, renderedBuffers]]);
  return renderedBuffers;
};

export default createPrerenderableBufferArray;
