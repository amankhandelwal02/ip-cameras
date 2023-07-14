import React, { useEffect, useState } from "react";
import { BsFillGrid3X3GapFill, BsFillVolumeDownFill } from "react-icons/bs";
import { TiMediaPlayReverse } from "react-icons/ti";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AiFillBackward, AiFillCamera, AiFillForward } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import { GrStopFill } from "react-icons/gr";
import { BiExpand, BiZoomIn } from "react-icons/bi";
import { IoMdFilm } from "react-icons/io";
import { LiaCutSolid } from "react-icons/lia";
import { HiOutlineDownload } from "react-icons/hi";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdOutlineFolderDelete } from "react-icons/md";
import axios from "axios";

const Playback_option = ({ videoRef,setIsTrimming, isTrimming }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeHandleClose = () => {
    setAnchorEl(null);
  };
  
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    setShow(true);
    setText("Play");
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShow(true);
    setText("Pause");
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Increase zoom by 0.1, up to a maximum of 2
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Decrease zoom by 0.1, down to a minimum of 0.5
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
          handleZoomIn();
        } else if (event.deltaY > 0) {
          handleZoomOut();
        }
      });
    }
  }, [videoRef]);

  // const handleStop = () => {
  //   if (videoRef.current) {
  //     videoRef.current.pause();
  //     videoRef.current.currentTime = 0;
  //   }
  //   setShow(true);
  //   setText("Stop");
  // };

  const handleStop = async () => {
    console.log("hello")
    if (videoRef.current) {
      await axios.get("/api/stop")
      setShow(true);
      setText("Close");
      window.location.reload();
      }
  }

  const handleDownloadVideo = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const url = videoElement.src;
      const filename = url.split("/").pop();
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], filename, { type: "video/mp4" });
          saveAs(file);
        })
        .catch((error) => {
          console.error("Failed to download video:", error);
        });
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("click", handleDownloadVideo);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("click", handleDownloadVideo);
      }
    };
  }, [videoRef]);

  const handleToggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
    setShow(true);
    setText("Full Screen");
  };

  const handleClose = async () => {
    if (videoRef.current) {
      await axios.get("/api/stop");
      setShow(true);
      setText("Close");
      window.location.reload();
    }
  };
  const handleBackward = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime -= 5; // 300 seconds = 5 minutes
    }
  };
  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10; // Add 300 seconds (5 minutes) to current time
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current.currentTime >= trimEndTime) {
      videoRef.current.pause();
      videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    }
  };

  const captureImage = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const imageURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = "video-frame.png";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(imageURL);
      });
    }
  };

  const startRecording = () => {
    const videoElement = videoRef.current;
    if (videoElement && !recording) {
      const stream = videoElement.captureStream();
      const recorder = new MediaRecorder(stream);
      setRecordedChunks([]);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "live-clip.webm";
        link.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  };


  const handleTrimButtonClick = () => {
    setIsTrimming(true);
  };



  const hhandleBackward = () => {
    const video = videoRef.current;
    if (video) {
      const newTime = video.currentTime - 10;
      video.currentTime = newTime < 0 ? 0 : newTime;
      setCurrentTime(video.currentTime);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2500);
  }, [show]);

  const Text = ({ text }) => {
    return (
      <>
        <span>{text}</span>
      </>
    );
  };

  return (
    <div className="bg-gray-200 w-full h-10 flex items-center justify-between px-10">
      <div className="flex justify-start">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <BsFillGrid3X3GapFill className="text-black" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeHandleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>2*2</MenuItem>
          <MenuItem onClick={handleClose}>3*3</MenuItem>
          <MenuItem onClick={handleClose}>4*4</MenuItem>
        </Menu>
        <MdOutlineFolderDelete/>
      </div>

      <div className="flex space-x-7 text-black">
        <div onClick={handleStop}>
          <TiMediaPlayReverse />
        </div>
        <div onClick={handlePause}>
          <GrStopFill />
        </div>
        <div onClick={handleBackward}>
          <AiFillBackward />
        </div>
        <div onClick={handlePlay}>
          <FaPlay />
        </div>
        <div onClick={handleSkipForward}>
          <AiFillForward />
        </div>
      </div>

      <div className="flex items-center space-x-7 text-black cursor-pointer duration-300">
        <div>
          {!recording && (
            <div onClick={startRecording}>
              <IoMdFilm />
            </div>
          )}
          {recording && (
            <div onClick={stopRecording}>
              <IoMdFilm />
            </div>
          )}
        </div>

        <div onClick={captureImage}>
          <AiFillCamera />
        </div>
        <div>
        {isTrimming ?  <LiaCutSolid /> :  <LiaCutSolid />}
         
        </div>
        <div onClick={handleZoomIn}>
          <AiOutlineZoomIn />
        </div>
        <div onClick={handleZoomOut}>
          <AiOutlineZoomOut />
        </div>
        <div>
          {" "}
          <BsFillVolumeDownFill className="text-black" />
        </div>
        <div onClick={handleDownloadVideo}>
          {" "}
          <HiOutlineDownload />
        </div>
        <div onClick={handleToggleFullScreen}>
          {" "}
          <BiExpand />
        </div>
      </div>
    </div>
  );
};

export default Playback_option;
