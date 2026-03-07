import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { detectEmotion } from "../../utils/emotionDetector";

export default function FaceExpression() {

  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");

  useEffect(() => {

    async function init() {

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
        numFaces: 1
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoRef.current.srcObject = stream;

      videoRef.current.onloadeddata = () => {
        detect(faceLandmarker);
      };
    }

    function detect(faceLandmarker) {

      const video = videoRef.current;

      async function loop() {

        const result = faceLandmarker.detectForVideo(video, Date.now());

        if (result.faceBlendshapes.length > 0) {

          const blendshapes = result.faceBlendshapes[0].categories;

          const detectedEmotion = detectEmotion(blendshapes);

          setEmotion(detectedEmotion);
        }

        requestAnimationFrame(loop);
      }

      loop();
    }

    init();

  }, []);

  return (
    <div style={{ textAlign: "center" }}>

      <h2>AI Mood Detector</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="400"
        style={{ borderRadius: "10px" }}
      />

      <h1>{emotion}</h1>

    </div>
  );
}