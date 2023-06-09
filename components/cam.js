import React,{use} from 'react';

const Cam = () => (
  <div>
    <video controls className='w-[600px]'>
      <source src="/api/stream" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

export default Cam;
