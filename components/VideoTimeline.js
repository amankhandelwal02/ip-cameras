// import React, { useRef, useEffect, useState } from 'react';

// const VideoTimeline = ({ videoSrc }) => {
//   const videoRef = useRef(null);
//   const timelineRef = useRef(null);
//   const [frames, setFrames] = useState([]);
//   const frameWidth = 100; // Adjust this value as needed

//   useEffect(() => {
//     const video = videoRef.current;
//     const timeline = timelineRef.current;
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     const frameCount = Math.floor(video.duration);
//     const extractedFrames = [];

//     canvas.width = frameWidth;
//     canvas.height = timeline.offsetHeight;

//     const extractFrame = (time) => {
//       context.drawImage(video, 0, 0, frameWidth, canvas.height);
//       const imageData = context.getImageData(0, 0, frameWidth, canvas.height);
//       extractedFrames.push(imageData);
//     };

//     const renderFrames = () => {
//       const timelineProgress = timeline.querySelector('.timeline-progress');
//       extractedFrames.forEach((frameData, index) => {
//         const frameElement = document.createElement('div');
//         frameElement.className = 'timeline-frame';
//         frameElement.style.backgroundImage = `url(${getImageDataUrl(frameData)})`;
//         frameElement.style.width = `${frameWidth}px`;
//         timeline.appendChild(frameElement);

//         frameElement.addEventListener('click', () => {
//           const percentage = index / frameCount;
//           const currentTime = video.duration * percentage;
//           video.currentTime = currentTime;
//         });
//       });

//       const progressWidth = (video.currentTime / video.duration) * 100;
//       timelineProgress.style.width = `${progressWidth}%`;
//     };

//     const getImageDataUrl = (imageData) => {
//       const tempCanvas = document.createElement('canvas');
//       tempCanvas.width = imageData.width;
//       tempCanvas.height = imageData.height;
//       const tempContext = tempCanvas.getContext('2d');
//       tempContext.putImageData(imageData, 0, 0);
//       return tempCanvas.toDataURL();
//     };

//     video.addEventListener('loadedmetadata', () => {
//       for (let i = 0; i < frameCount; i++) {
//         extractFrame(i);
//       }
//       renderFrames();
//     });

//     video.addEventListener('timeupdate', () => {
//       const progressWidth = (video.currentTime / video.duration) * 100;
//       timeline.querySelector('.timeline-progress').style.width = `${progressWidth}%`;
//     });

//     return () => {
//       video.removeEventListener('loadedmetadata', () => {});
//       video.removeEventListener('timeupdate', () => {});
//     };
//   }, []);

//   return (
//     <div className="video-container">
//       <video ref={videoRef} src={"/earth.mp4"} controls />
//       <div className="timeline-bar" ref={timelineRef}>
//         <div className="timeline-progress" />
//       </div>
//     </div>
//   );
// };

// export default VideoTimeline;

// import React, { useRef, useEffect, useState } from 'react';

// const VideoTimeline = ({ videoSrc }) => {
//   const videoRef = useRef(null);
//   const timelineRef = useRef(null);
//   const [frames, setFrames] = useState([]);
//   const frameWidth = 100; // Adjust this value as needed

//   useEffect(() => {
//     const video = videoRef.current;
//     const timeline = timelineRef.current;
//     const frameCount = Math.floor(video.duration);
//     const extractedFrames = []

//     const generateFrames = async () => {
//       for (let i = 0; i < frameCount; i++) {
//         video.currentTime = i;
//         await video.play().catch((err) => {
//           console.error('Video playback error:', err);
//         });
//         const canvas = document.createElement('canvas');
//         canvas.width = frameWidth;
//         canvas.height = timeline.offsetHeight;
//         const context = canvas.getContext('2d');
//         context.drawImage(video, 0, 0, frameWidth, canvas.height);
//         const frameData = canvas.toDataURL('image/jpeg');
//         extractedFrames.push(frameData);
//         video.pause();
//       }
//       setFrames(extractedFrames);
//     };

//     generateFrames();
//   }, []);

//   return (
//     <div className="video-container">
//       <video ref={videoRef} src={"/earth.mp4"} controls />
//       <div className="timeline-bar" ref={timelineRef}>
//         {frames.map((frame, index) => (
//           <div
//             key={index}
//             className="timeline-frame"
//             style={{
//               backgroundImage: `url(${frame})`,
//               width: `${frameWidth}px`,
//               height: '100%',
//               display: 'inline-block',
//             }}
//             onClick={() => {
//               const video = videoRef.current;
//               const percentage = index / frames.length;
//               const currentTime = video.duration * percentage;
//               video.currentTime = currentTime;
//             }}
//           />
//         ))}
//         <div className="timeline-progress" />
//       </div>
//     </div>
//   );
// };

// export default VideoTimeline;

import React, { useRef, useEffect, useState } from 'react';

const VideoTimeline = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const scrubberRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const frameWidth = 53; // Adjust this value as needed

  useEffect(() => {
    const video = videoRef.current;
    const timeline = timelineRef.current;
    const scrubber = scrubberRef.current;
    const frameCount = Math.floor(video.duration);
    const extractedFrames = [];

    const generateFrames = async () => {
      for (let i = 0; i < frameCount; i++) {
        video.currentTime = i;
        await video.play().catch((err) => {
          console.error('Video playback error:', err);
        });
        const canvas = document.createElement('canvas');
        canvas.width = frameWidth;
        canvas.height = timeline.offsetHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, frameWidth, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg');
        extractedFrames.push(frameData);
        video.pause();
      }
      setFrames(extractedFrames);
    };

    const handleScrubberDrag = (event) => {
      const timelineRect = timeline.getBoundingClientRect();
      const offsetX = event.clientX - timelineRect.left;
      const percentage = offsetX / timeline.offsetWidth;
      const currentTime = video.duration * percentage;
      video.currentTime = currentTime;
    };

    generateFrames();

    scrubber.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', handleScrubberDrag);
    });

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleScrubberDrag);
    });

    return () => {
      video.removeEventListener('loadedmetadata', () => {});
      video.removeEventListener('timeupdate', () => {});
      document.removeEventListener('mousemove', handleScrubberDrag);
      document.removeEventListener('mouseup', handleScrubberDrag);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const scrubber = scrubberRef.current;

    const handleVideoTimeUpdate = () => {
      const scrubberWidth = (video.currentTime / video.duration) * 100;
      scrubber.style.left = `${scrubberWidth}%`;
    };

    video.addEventListener('timeupdate', handleVideoTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleVideoTimeUpdate);
    };
  }, []);

  console.log("frames", frames)

  return (
    <div className="video-container w-3/4 mx-auto">
      <video ref={videoRef} src={"/output_2023-07-14T14-23-22.mp4"} controls />
      <div className="timeline-bar" ref={timelineRef}>
        {frames.length > 0 && frames.map((frame, index) => (
          <div
            key={index}
            className="timeline-frame"
            style={{
              backgroundImage: `url(${frame})`,
              width: `${frameWidth}px`,
              height: '94%',
              display: 'inline-block',
            }}
            onClick={() => {
              const video = videoRef.current;
              const percentage = index / frames.length;
              const currentTime = video.duration * percentage;
              video.currentTime = currentTime;
            }}
          />
        ))}
        {/* <div className="timeline-progress" /> */}
        <div className="scrubber" ref={scrubberRef} />
      </div>
    </div>
  );
};

export default VideoTimeline;
