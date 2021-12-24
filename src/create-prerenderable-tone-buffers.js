import createPrerenderableToneBufferArray from './create-prerenderable-tone-buffer-array';
import createToneBuffers from './create-tone-buffers';
import renderToneBuffer from './render-tone-buffer';

const createPrerenderableBuffers = async (options) => {
  const {
    samples,
    sourceInstrumentName,
    renderedInstrumentName,
    sampleLibrary,
    getDestination,
    additionalRenderLength = 0,
    onProgress = () => {},
    bufferSourceOptions = {},
    keyFilter = () => true,
  } = options;
  if (samples[renderedInstrumentName]) {
    return createToneBuffers(samples[renderedInstrumentName]);
  }
  if (Array.isArray(samples[sourceInstrumentName])) {
    const bufferArray = await createPrerenderableToneBufferArray(options);
    return createToneBuffers(bufferArray);
  }
  const keys = Object.keys(samples[sourceInstrumentName]).filter(keyFilter);
  const values = keys.map((key) => samples[sourceInstrumentName][key]);
  const renderedBuffers = await Promise.all(
    values.map(async (buffer, i) => {
      const renderedBuffer = await renderToneBuffer({
        buffer,
        getDestination,
        bufferSourceOptions,
        duration: buffer.duration + additionalRenderLength,
      });
      onProgress((i + 1) / values.length);
      return renderedBuffer;
    })
  );
  const renderedBuffersByKey = renderedBuffers.reduce(
    (o, renderedBuffer, i) => {
      const key = keys[i];
      o[key] = renderedBuffer;
      return o;
    },
    {}
  );
  sampleLibrary.save([[renderedInstrumentName, renderedBuffersByKey]]);
  return createToneBuffers(renderedBuffersByKey);
};

export default createPrerenderableBuffers;
