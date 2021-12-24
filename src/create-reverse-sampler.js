import { ToneAudioBuffer } from 'tone';
import createToneBuffers from './create-tone-buffers';
import createSampler from './create-sampler';

const createReverseSampler = async (urlMap, opts = {}) => {
  const buffers = await createToneBuffers(urlMap);
  const keys = Object.keys(urlMap);
  const reverseBuffersByKey = keys.reduce(
    (byKey, key) => {
      const buffer = ToneAudioBuffer.fromArray(buffers.get(key).toArray());
      buffer.reverse = true;
      byKey[key] = buffer;
      return byKey;
    },
    Array.isArray(urlMap) ? [] : {}
  );
  buffers.dispose();
  return createSampler(reverseBuffersByKey, opts);
};

export default createReverseSampler;
