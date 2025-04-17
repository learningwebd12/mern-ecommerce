import React from "react";
import Banner from "../components/Banner";

const aboutdetails = [
  {
    Title: "Empowering women to achieve fitnessgoals with style",
    CompanyName: "The Company",
    companyDesc:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris nullam the as integer quam dolor nunc semper ready the Ornare non nulla faucibus pulvinar purus vulputate neque. Suscipit tristique nam enim mauris that consectetur platea is The Cras est arcu aliquet accumsan. Egestas ut eget egestas the ultrices diam. Lorem as ipsum dolor sit amet consectetur adipiscing elit. Mauris nullam the as integer quam dolor nunc semper ready the Ornare non nulla faucibus pulvinar purus vulputate neque. Suscipit tristique nam enim mauris consectetur platea is The Cras est arcu aliquet accumsan.",
    OurMission: "Our Mission",
    MissionDesc:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris nullam the as integer quam dolor nunc semper ready the Ornare non nulla faucibus pulvinar purus vulputate neque. Suscipit tristique nam enim mauris that consectetur platea is The Cras est arcu aliquet accumsan. Egestas ut eget egestas the ultrices diam. Lorem as ipsum dolor sit amet consectetur adipiscing elit.",
  },
];

const About = () => {
  return (
    <>
      <Banner
        title="About us"
        subtitle="At Fashion Brand Name, we believe that fashion is more than just clothing it's a powerful form of self-expression. "
      />
      {aboutdetails.map((value, index) => (
        <div key={index} className="p-4 max-w-7xl mx-auto">
          <div className="flex justify-center py-10">
            <h1 className="flex justify-center items-center text-center text-[2vw] w-[40%]">
              {value.Title}
            </h1>
          </div>
          <div>
            <img
              src="../images/about-bg.jpg"
              alt=""
              className="w-full rounded-2xl"
            />
          </div>

          <p className="text-[1.5vw] pt-5">{value.CompanyName}</p>
          <p className="text-[1vw] py-4">{value.companyDesc}</p>
          <p className="text-[1.5vw] py-2">{value.OurMission}</p>
          <p className="text-[1vw]">{value.MissionDesc}</p>
        </div>
      ))}
    </>
  );
};

export default About;
