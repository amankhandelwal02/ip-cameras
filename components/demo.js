import React, { useEffect, useState } from 'react';

const Demo = () => {
      const [currentTime, setCurrentTime] = useState(new Date());
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          const now = new Date();
          setCurrentTime(now);
        }, 1000);
    
        return () => {
          clearInterval(intervalId);
        };
      }, []);
    
      const renderTimeline = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          const time = new Date();
          time.setHours(i);
          const isActive = time.getHours() === currentTime.getHours();
          hours.push(
            <div key={i} className={`hour-block ${isActive ? 'active' : ''}`}>
              <span>{i}:00</span>
            </div>
          );
        }
        return hours;
      };
    
      return (
        <div>
          <h1>Timeline</h1>
          <div className="timeline-container">
            <div className="current-time">{currentTime.toLocaleTimeString()}</div>
            <div className="timeline">{renderTimeline()}</div>
          </div>
        </div>
      );
    };
    
   
    

export default Demo;






