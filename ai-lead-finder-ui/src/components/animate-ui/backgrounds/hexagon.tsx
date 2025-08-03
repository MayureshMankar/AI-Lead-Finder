"use client";

import React from "react";

interface HexagonBackgroundProps {
  className?: string;
  hexagonCount?: number;
  size?: number;
  speed?: number;
  opacity?: number;
}

export const HexagonBackground: React.FC<HexagonBackgroundProps> = ({
  className,
  hexagonCount = 50,
  size = 80,
  speed = 6,
  opacity = 0.1,
}) => {
  return (
    <div
      className={`fixed inset-0 overflow-hidden ${className || ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
      }}
    >
      {/* Simple test elements */}
      <div 
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
          opacity: 0.8,
          zIndex: 9999,
        }}
      >
        TEST HEXAGON
      </div>
      
      <div 
        style={{
          position: 'absolute',
          top: '200px',
          left: '200px',
          width: '80px',
          height: '80px',
          backgroundColor: 'blue',
          opacity: 0.6,
          zIndex: 9999,
        }}
      >
        BLUE TEST
      </div>
      
      <div 
        style={{
          position: 'absolute',
          top: '350px',
          left: '350px',
          width: '60px',
          height: '60px',
          backgroundColor: 'green',
          opacity: 0.7,
          zIndex: 9999,
        }}
      >
        GREEN
      </div>
      
      {/* Mouse position indicator */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          padding: '10px',
          backgroundColor: 'white',
          color: 'black',
          zIndex: 10000,
          fontSize: '12px',
        }}
      >
        Background Component Loaded
      </div>
    </div>
  );
}; 