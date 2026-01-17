
import React from 'react';

/**
 * Mechtron Logo Component
 * Replicates the provided reference mechanical gear design using the brand's gradient.
 * 
 * @param {string} className - Optional classes for wrapper/sizing
 */
const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
                <defs>
                    <linearGradient id="brand_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#22d3ee" /> {/* Cyan */}
                        <stop offset="1" stopColor="#a855f7" /> {/* Purple */}
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* 
           GROUP 1: The Outer Gear 
           Solid gear shape filled with darker gradient/color
        */}
                <path
                    fill="url(#brand_gradient)"
                    d="M50 85 
             L41.3 85 L39 96 L29 92 L31 82 
             L23.5 77.5 L14.5 83 L8.5 75 L16.5 68 
             L13.5 60 L3 60 L3 50 L3 40 L13.5 40
             L16.5 32 L8.5 25 L14.5 17 L23.5 22.5
             L31 18 L29 8 L39 4 L41.3 15
             L58.7 15 L61 4 L71 8 L69 18
             L76.5 22.5 L85.5 17 L91.5 25 L83.5 32
             L86.5 40 L97 40 L97 50 L97 60 L86.5 60
             L83.5 68 L91.5 75 L85.5 83 L76.5 77.5
             L69 82 L71 92 L61 96 L58.7 85
             Z"
                />

                {/* 
           GROUP 2: The Inner Ring (Negative Space) 
           This creates the spacing between the gear and the inner core. 
           We actually just draw a dark circle on top, or use a mask. 
           For simplicity with the gradient background of the gear, 
           we'll overlay a circle matching the 'dashboard' bg color (roughly).
           Actually, let's make the gear path a compound path with a hole!
           
           Better approach: Draw the White Ring from the image.
           In the reference: Gear -> White Ring -> Blue Circle -> White Icon
        */}

                {/* The White Ring (Simulated with semi-transparent white or background cutout) */}
                <circle cx="50" cy="50" r="32" fill="#09090b" /> {/* Dark background color cutout */}
                <circle cx="50" cy="50" r="26" fill="white" className="opacity-10" /> {/* Subtle ring highlight */}

                {/* 
           GROUP 3: The Center Core 
           A solid circle filled with the brand gradient
        */}
                <circle cx="50" cy="50" r="22" fill="url(#brand_gradient)" />

                {/* 
           GROUP 4: The Mechanical Icon (Hexagon + Brackets)
           White color to stand out against the gradient core.
        */}
                <g fill="white">
                    {/* Center Hexagon */}
                    <path d="M50 63 L39 56.5 L39 43.5 L50 37 L61 43.5 L61 56.5 Z" />

                    {/* Top Mechanical Brackets (The "C" shapes or Caliper jaws) */}
                    {/* Left Bracket */}
                    <path d="M36 40 A 16 16 0 0 1 47 31 L 47 37 A 10 10 0 0 0 39 43 Z" />
                    <path d="M47 31 L 47 25 L 53 25 L 53 31" stroke="white" strokeWidth="4" strokeLinecap="round" />

                    {/* Right Bracket */}
                    <path d="M64 40 A 16 16 0 0 0 53 31 L 53 37 A 10 10 0 0 1 61 43 Z" />

                    {/* Bottom Detail (Optional, to balance) */}
                    {/* <rect x="48" y="27" width="4" height="8" rx="1" /> */}
                </g>

            </svg>
        </div>
    );
};

export default Logo;
