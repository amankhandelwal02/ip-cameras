import React, { useEffect, useRef, useState } from "react";
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

const Playback_option = ({ videoRef, canvasRef }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [isReversed, setIsReversed] = useState(false);

  const handleReverse = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame onto canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reverse the video frames
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const reversedImageData = reverseImageData(imageData);
      context.putImageData(reversedImageData, 0, 0);

      // Set reversed video as the source of the video element
      video.src = canvas.toDataURL('video/webm');
      setIsReversed(!isReversed);
    }
  };

  const reverseImageData = (imageData) => {
    const { data, width, height } = imageData;
    const reversedData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const reversedPixelIndex = ((height - y - 1) * width + x) * 4;

        // Copy pixel data from original to reversed position
        reversedData[reversedPixelIndex] = data[pixelIndex]; // Red channel
        reversedData[reversedPixelIndex + 1] = data[pixelIndex + 1]; // Green channel
        reversedData[reversedPixelIndex + 2] = data[pixelIndex + 2]; // Blue channel
        reversedData[reversedPixelIndex + 3] = data[pixelIndex + 3]; // Alpha channel
      }
    }

    return new ImageData(reversedData, width, height);
  };
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

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShow(true);
    setText("Stop");
  };

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
      </div>

      <div className="flex space-x-7 text-black">
        <div onClick={handleReverse}>
          <TiMediaPlayReverse />
        </div>
        <div>
          <GrStopFill />
        </div>
        <div>
          <AiFillBackward />
        </div>
        <div>
          <FaPlay />
        </div>
        <div>
          <AiFillForward />
        </div>
      </div>

      <div className="flex items-center space-x-7 text-black">
        <div>
          <IoMdFilm />
        </div>
        <div>
          <AiFillCamera />
        </div>
        <div>
          {" "}
          <LiaCutSolid />
        </div>
        <div>
          {" "}
          <BiZoomIn />
        </div>
        <div>
          {" "}
          <BsFillVolumeDownFill className="text-black" />
        </div>
        <div>
          {" "}
          <HiOutlineDownload />
        </div>
        <div>
          {" "}
          <BiExpand />
        </div>
      </div>
    </div>
  );
};

export default Playback_option;
