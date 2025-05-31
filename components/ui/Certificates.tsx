"use client";

import React from "react";
import { Certificates } from "@/data";
import { InfiniteMovingCards } from "./infiniteMovingCards";

const CertificatesSection = () => {
  return (
    <section id="certificates" className="py-20">
      <h1 className="heading">
        My Professional
        <span className="text-purple"> Certifications</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={Certificates}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;