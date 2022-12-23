import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [photoDetails, setPhotoDetails] = useState<{ valid: boolean }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getVideo();
    setInterval(() => {
      if(!videoRef.current) return
      canvasRef.current?.getContext("2d")?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const dataURL = canvasRef.current?.toDataURL("image/jpeg");
      const photo = dataURLtoFile(dataURL, 'photo');
      if(!photo) return;
      const data = new FormData();
      data.append('photo', photo);
      axios.post('http://localhost:5000/verify-presence', data, { headers: { 'content-type': 'multipart/formdata' } }).then(response => {
        setPhotoDetails(response.data);
      })
    }, 1000);
  }, []);

  const getVideo = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: document.body.getBoundingClientRect().width } })
      .then(stream => {
        let video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }, []);

  const dataURLtoFile = useCallback((dataurl: string | undefined, filename: string) => {
    if(!dataurl) return undefined;
    const arr = dataurl.split(',')
    const  mime = arr[0].match(/:(.*?);/)![1]
    const  bstr = atob(arr[1])
    let  n = bstr.length
    const  u8arr = new Uint8Array(n);

    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}, []);

  return (
    <div className="App">
      <video ref={videoRef} />

      <canvas className="canvas" ref={canvasRef} height="200" width="200"></canvas>
      <div>
        <h2>Resultado:</h2>
        <div className="code">
          {photoDetails ? JSON.stringify(photoDetails) : ""}
        </div>
      </div>
    </div>
  )
}

export default App
