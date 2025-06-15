"use client";
import { FaLocationArrow, FaDownload } from "react-icons/fa6";
import { useEffect, useState } from "react";
import MagicButton from "./ui/MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadCV = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = '/cv/Saduni_CV.pdf'; // Path to your CV file
    link.download = 'Saduni_Perera_CV.pdf'; // Name for downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-20 pt-36">
      {/* Animated SV Logo - Left Corner */}
      <div className={`fixed top-8 left-8 z-50 transition-all duration-1000 ${isLogoVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
        <div className="relative group cursor-pointer">
          {/* Rotating outer ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-spin opacity-60" style={{ animationDuration: '3s' }}></div>
          
          {/* Pulsing glow effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-40 animate-pulse group-hover:opacity-70 transition-opacity duration-300"></div>
          
          {/* Static outer border */}
          <div className="absolute -inset-2 rounded-full border border-white/20 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm"></div>
          
          {/* Main logo container */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
            
            {/* Inner rotating gradient */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-spin opacity-50" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
            
            {/* SV Text */}
            <div className="relative z-10 text-white font-bold text-xl tracking-tight">
              <span className="inline-block animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" style={{ animationDelay: '0s' }}>
                S
              </span>
              <span className="inline-block animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" style={{ animationDelay: '0.5s' }}>
                V
              </span>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute w-1 h-1 bg-purple-400 rounded-full top-1 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
              <div className="absolute w-1 h-1 bg-blue-400 rounded-full bottom-1 left-1/2 transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Side orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
              <div className="absolute w-1 h-1 bg-pink-400 rounded-full top-1/2 left-1 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute w-1 h-1 bg-cyan-400 rounded-full top-1/2 right-1 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
           
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
         absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-20 z-10">
  <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">

   
    <p className="uppercase tracking-widest text-xs md:text-sm text-center font-semibold text-cyan-300">
      ✦ Hello World!
    </p>
                     
  <div className="relative mb-8">
  <TextGenerateEffect
    words={`I'm Saduni Amarasekara\nBringing ideas to life with code & creativity.`}
    className="text-center text-[32px] md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 via-blue-200 to-white bg-clip-text text-transparent leading-tight whitespace-pre-line"
  />
</div>




         <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl text-slate-300">
      A Software Engineering undergraduate & Full-Stack Developer passionate about crafting modern, user-first web applications.
    </p>

          {/* CV Download and Show Work Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <MagicButton
              title="Download CV"
              icon={<FaDownload />}
              position="left"
              handleClick={handleDownloadCV}
              otherClasses="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            />

            <a href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"                      
            />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;