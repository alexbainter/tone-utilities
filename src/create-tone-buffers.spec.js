import * as Tone from 'tone';
import createToneBuffers from './create-tone-buffers';

describe('createBuffers', () => {
  it('should return a promise that resolves to an instance of ToneAudioBuffers', () => {
    const stringUrl = './base/test-assets/noise-1s.ogg';
    const audioBufferUrl = Tone.context.createBuffer(1, 44100, 44100);
    const urlMaps = [
      [stringUrl],
      {
        note: stringUrl,
      },
      [audioBufferUrl],
      {
        note: audioBufferUrl,
      },
    ];
    const results = urlMaps.map((urlMap) => createToneBuffers(urlMap));
    results.forEach((result) => {
      expect(result).to.be.an.instanceOf(Promise);
    });
    return Promise.all(results).then((resolvedResults) => {
      resolvedResults.forEach((result) => {
        expect(result).to.be.an.instanceOf(Tone.ToneAudioBuffers);
      });
    });
  });
});
