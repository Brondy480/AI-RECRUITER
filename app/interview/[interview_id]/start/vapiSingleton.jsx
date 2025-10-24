import Vapi from '@vapi-ai/web';

let instance = null;

export const getVapiInstance = () => {
  if (!instance) {
    instance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }
  return instance;
};

// New helper to completely reset Vapi
export const resetVapiInstance = () => {
  if (instance) {
    try {
      instance.stop();          // Stop any active call or speech
      instance.destroy?.();     // Destroy session if supported
    } catch (err) {
      console.warn("Vapi reset error:", err);
    }
    instance = null;
  }
};
