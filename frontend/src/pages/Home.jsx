import React from "react";

const Home = () => {
  return (
    <>
      <div className="flex justify-between items-center p-5 w-full self-stretch ">
        <div className="flex justify-center w-[25%] bg-[#E0E0E0]">
          <img src="/images/image1.png" alt="Image1" />
        </div>

        <div className="w-[35%] flex justify-center flex-col items-center ">
          <div className=" bg-[#E0E0E0] flex justify-center">
            <img src="/images/image3.png" alt="" />
          </div>
          <div className="w-full items-center flex flex-col">
            <h1 className="text-[5vw]">ULTIMATE</h1>
            <h2 className="text-[5vw]">SALE</h2>
            <p>New Collection</p>
            <button class="bg-indigo-500 hover:bg-fuchsia-500 px-8 p-3 rounded-sm text-cyan-50 cursor-pointer">
              Shop Now
            </button>
          </div>
          <div className="w-full flex justify-center items-center">
            <img src="/images/images4.png" alt="" />
          </div>
        </div>

        <div className="flex justify-center w-[25%]  bg-[#E0E0E0]">
          <img src="/images/image2.png" alt="Image2" />
        </div>
      </div>
    </>
  );
};

export default Home;
