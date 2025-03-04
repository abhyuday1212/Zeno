import { setLocalStream } from "@/lib/store/features/socketSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCallback, useEffect } from "react";

export const useMediaStream = () => {
  const dispatch = useAppDispatch();
  const localStream = useAppSelector(
    (state) => state.socketContext.localStream
  );

  // Cleanup function to release camera when component unmounts
  useEffect(() => {
    return () => {
      if (localStream) {
        console.log("Component unmounted, stream maintained in Redux");
      }
    };
  }, [localStream]);

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 400, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });
        dispatch(setLocalStream(stream));
        return stream;
      } catch (error) {
        dispatch(setLocalStream(null));
        return null;
      }
    },
    [localStream]
  );

  const stopMediaStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      dispatch(setLocalStream(null));
    }
  }, [localStream, dispatch]);

  return { getMediaStream, stopMediaStream, localStream };
};
