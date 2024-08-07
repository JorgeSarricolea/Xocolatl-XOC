import React from "react";
import Image from "next/image";
import { FeatureTab } from "../../../types/assets/featureTab";

const FeaturesTabItem = ({ featureTab }: { featureTab: FeatureTab }) => {
  const { title, desc1, desc2, button, image, imageDark } = featureTab;

  return (
    <>
      <div className="flex items-center gap-8 lg:gap-19">
        <div className="md:w-1/2 p-12 tracking-tighter leading-snug">
          <h2 className="mb-7 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle2">{title}</h2>
          <p className="mb-5 text-lg pr-24">{desc1}</p>
          <p className="w-11/12 text-lg pr-24 pb-12">{desc2}</p>
          <button className="px-8 py-4 text-lg font-medium text-center text-white bg-base-300 rounded-btn">
            {button}
          </button>
        </div>
        <div className="relative mx-auto hidden aspect-[562/366] max-w-[550px] md:block md:w-1/2 mt-8">
          <Image src={image} alt={title} fill className="dark:hidden" />
          <Image src={imageDark} alt={title} fill className="hidden dark:block" />
        </div>
      </div>
    </>
  );
};

export default FeaturesTabItem;
