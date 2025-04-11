import React from "react";

const Banner = ({ title, subtitle }) => {
  return (
    <>
      <div className="bg-[#f8f8f8]">
        <div className=" h-[15vw] w-full bg-no-repeat flex justify-start items-center  p-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-[2vw] w-full">{title}</h1>
            {subtitle && <p className="text-[1vw] mt-2">{subtitle}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
