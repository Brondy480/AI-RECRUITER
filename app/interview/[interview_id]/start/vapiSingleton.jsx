import Vapi from "@vapi-ai/web";

let vapi;

export const getVapiInstance = () => {
  if (!vapi) {
    vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }
  return vapi;
};

export const destroyVapiInstance = () => {
  if (vapi) {
    vapi.stop?.();
    vapi = null;
  }
};
