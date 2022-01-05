import * as Tone from 'tone';
import createToneBuffer from './create-tone-buffer.js';

describe('createToneBuffer', () => {
  it('should return a promise', () => {
    expect(createToneBuffer('')).to.be.instanceOf(Promise);
    expect(
      createToneBuffer(Tone.context.createBuffer(1, 44100, 44100))
    ).to.be.an.instanceOf(Promise);
  });
  it('should resolve a string url with a Tone Buffer', () => {
    return createToneBuffer('./base/test-assets/noise-1s.ogg').then((result) =>
      expect(result).to.be.an.instanceOf(Tone.ToneAudioBuffer)
    );
  });
  it('should resolve an AudioBuffer with a Tone Buffer', () => {
    return createToneBuffer(Tone.context.createBuffer(1, 44100, 44100)).then(
      (result) => expect(result).to.be.an.instanceOf(Tone.ToneAudioBuffer)
    );
  });
});
