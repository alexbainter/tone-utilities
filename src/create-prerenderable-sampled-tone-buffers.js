import createToneBuffers from './create-tone-buffers';
import createPrerenderableSampledToneBuffer from './create-prerenderable-sampled-tone-buffer';

const inProgress = new Map();

const createPrerenderableSampledBuffers = async ({
  notes,
  samples,
  sampleLibrary,
  sourceInstrumentName,
  renderedInstrumentName,
  getDestination,
  additionalRenderLength = 0,
  onProgress = () => {},
  bufferSourceOptions = {},
  pitchShift = 0,
  reverse = false,
} = {}) => {
  if (samples[renderedInstrumentName]) {
    return createToneBuffers(samples[renderedInstrumentName]);
  }
  if (inProgress.has(renderedInstrumentName)) {
    const renderedBuffersByNote = await inProgress.get(renderedInstrumentName);
    return createToneBuffers(renderedBuffersByNote);
  }
  const samplesByNote = samples[sourceInstrumentName];
  const promise = Promise.all(
    notes.map(async (note, i) => {
      const buffer = await createPrerenderableSampledToneBuffer({
        note,
        samplesByNote,
        getDestination,
        additionalRenderLength,
        bufferSourceOptions,
        pitchShift,
        reverse,
      });
      onProgress((i + 1) / notes.length);
      return buffer;
    })
  ).then((renderedBuffers) =>
    renderedBuffers.reduce((o, renderedBuffer, i) => {
      const note = notes[i];
      o[note] = renderedBuffer;
      return o;
    }, {})
  );
  inProgress.set(renderedInstrumentName, promise);
  const renderedBuffersByNote = await promise;
  sampleLibrary.save([[renderedInstrumentName, renderedBuffersByNote]]);
  inProgress.delete(renderedInstrumentName);
  return createToneBuffers(renderedBuffersByNote);
};

export default createPrerenderableSampledBuffers;
