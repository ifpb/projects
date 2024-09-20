import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export default function Filter({ type, tags }) {
  const [isShow, setIsShow] = useState(false);

  const toogleShow = () => {
    setIsShow(!isShow);
  };

  return isShow ? (
    <>
      <div
        className="fixed h-full w-full right-0 top-0 bg-black bg-opacity-50 z-10"
        onClick={toogleShow}
      ></div>

      <div className="absolute w-2/3 md:w-1/3 lg:w-1/4 min-h-screen right-0 top-0 bottom-0 bg-gray-100 shadow-lg p-4 z-50">
        <Icon
          icon="material-symbols:close"
          className="float-right text-2xl cursor-pointer"
          onClick={toogleShow}
        />
        <h1 className="font-bold text-xl capitalize text-center mb-8">Tags</h1>
        {Object.values(tags).map((tag, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg capitalize">{tag.name}</h3>
            {tag.values.map((value) => (
              <a
                href={`/projects/${type}/${value}/1`}
                className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 uppercase last:mr-0 mr-1 mt-1"
              >
                {value}
              </a>
            ))}
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="relative">
      <Icon
        icon="material-symbols:filter-alt"
        className="absolute right-0 mr-[10%] md:mr-32 lg:mr-32 xl:mr-0 text-4xl cursor-pointer mt-0.5"
        onClick={toogleShow}
      />
    </div>
  );
}
