import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data/index";
import MagicButton from "./ui/MagicButton";

const Footer = () => {
  return (
    <footer className="w-full pt-10 pb-10 mb-[100px] md:mb-5" id="contact">
     

      <div className="flex flex-col items-center">
  <h1 className="heading lg:max-w-[45vw]">
    Ready to take <span className="text-purple">your</span> digital presence to the next level?
  </h1>
  <p className="text-white-200 md:mt-10 my-5 text-center">
    Let's connect and bring your vision to life — I'm here to help you reach your goals.
  </p>
        <a href="mailto:saduvindhaya@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2025 Saduni Amarsekara
        </p>
<div className="flex items-center md:gap-3 gap-6">
  <a
    href="https://github.com/SaduAmarasekara"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
  >
    <img src="/git.svg" alt="github icon" width={20} height={20} />
  </a>
  <a
    href="https://www.linkedin.com/in/saduni-amarasekara-147451278/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
  >
    <img src="/link.svg" alt="linkedin icon" width={20} height={20} />
  </a>
</div>


      </div>
    </footer>
  );
};

export default Footer;