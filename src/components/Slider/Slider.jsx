import React, { useEffect } from "react";
import "./Style.css";
import adobe from "../../assets/company logo/adobe.svg";
import amazon from "../../assets/company logo/amazon.svg";
import atlassian from "../../assets/company logo/atlassian.svg";
import DeutscheBank from "../../assets/company logo/Deutsche_Bank.png";
import cisco from "../../assets/company logo/cisco.svg";
import google from "../../assets/company logo/google.svg";
import masterCard from "../../assets/company logo/masterCard.svg";
import microsoft from "../../assets/company logo/microsoft.svg";
import uber from "../../assets/company logo/uber.svg";

const logos = [
  adobe,
  amazon,
  atlassian,
  DeutscheBank,
  cisco,
  google,
  masterCard,
  microsoft,
  uber,
];

const Slider = () => {
  useEffect(() => {
    const logosSlide = document.querySelector(".logos-slide");
    const logosContainer = document.querySelector(".logos");
    const copy = logosSlide.cloneNode(true);
    logosContainer.appendChild(copy);

    logosSlide.style.animation = "35s slide infinite linear";
  }, []);

  return (
    <div className="w-screen max-w-[1440px]">
      <div className="logos">
        <div className="logos-slide">
          {logos.concat(logos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Logo ${index}`}
              draggable="false"
              className="select-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
