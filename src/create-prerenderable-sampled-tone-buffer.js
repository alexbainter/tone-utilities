import sampleNote from './sample-note';
import createToneBuffer from './create-tone-buffer';
import renderToneBuffer from './render-tone-buffer';

const createPrerenderableSampledToneBuffer = async ({
  note,
  samplesByNote,
  getDestination,
  additionalRenderLength,
  bufferSourceOptions = {},
  pitchShift = 0,
  reverse = false,
}) => {
  const { playbackRate, sampledNote } = sampleNote({
    note,
    pitchShift,
    sampledNotes: Object.keys(samplesByNote),
  });
  const noteBuffer = await createToneBuffer(samplesByNote[sampledNote]);
  noteBuffer.reverse = reverse;
  const renderedBuffer = await renderToneBuffer({
    getDestination,
    buffer: noteBuffer,
    duration: noteBuffer.duration / playbackRate + additionalRenderLength,
    bufferSourceOptions: Object.assign({}, bufferSourceOptions, {
      playbackRate,
    }),
  });
  noteBuffer.dispose();
  return renderedBuffer;
};

export default createPrerenderableSampledToneBuffer;
