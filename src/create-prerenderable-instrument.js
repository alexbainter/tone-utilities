import createPrerenderedToneBuffer from './create-prerendered-tone-buffer';
import createSampler from './create-sampler';

const createPrerenderedInstrument = async ({
  createInstrument,
  notes,
  noteDuration,
  sampleLibrary,
  samples,
  renderedInstrumentName,
  onProgress = () => {},
}) => {
  if (samples[renderedInstrumentName]) {
    return createSampler(samples[renderedInstrumentName]);
  }

  let renderedCount = 0;
  const noteBuffers = await Promise.all(
    notes.map(async (note) => {
      const createSourceForNote = async (context) => {
        const { instrument, dispose } = await Promise.resolve(
          createInstrument(context)
        );
        const start = () => {
          instrument.triggerAttackRelease(note, noteDuration);
        };
        return { start, dispose };
      };
      const renderedBuffer = await createPrerenderedToneBuffer({
        createSource: createSourceForNote,
        duration: noteDuration,
      });
      renderedCount += 1;
      onProgress(renderedCount / notes.length);
      return renderedBuffer;
    })
  );
  const noteBuffersByNote = noteBuffers.reduce((byNote, buffer, i) => {
    const note = notes[i];
    byNote[note] = buffer;
    return byNote;
  }, {});
  sampleLibrary.save([[renderedInstrumentName, noteBuffersByNote]]);
  return createSampler(noteBuffersByNote);
};

export default createPrerenderedInstrument;
