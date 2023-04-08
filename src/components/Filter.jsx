import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export default function Filter({ tags }) {
  const [isShow, setIsShow] = useState(false);

  const toogleShow = () => {
    setIsShow(!isShow);
  };

  return isShow ? (
    <>
      <div
        className="fixed h-full w-full right-0 top-0 bg-black bg-opacity-50 z-0"
        onClick={toogleShow}
      ></div>

      <div className="absolute w-1/3 max-sm:w-2/3 right-0 top-0 bg-gray-100 shadow-lg p-4 z-50">
        <Icon
          icon="material-symbols:close"
          className="float-right text-2xl cursor-pointer"
          onClick={toogleShow}
        />
        <h1 className="font-bold text-xl capitalize text-center mb-8">Tags</h1>
        {Object.values(tags).map((tag) => (
          <div>
            <h3 className="font-semibold text-lg capitalize">{tag.name}</h3>
            {tag.values.map((value) => (
              <a
                href={`/projects/students/${value}/1`}
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
    <Icon
      icon="material-symbols:filter-alt"
      className="float-right text-4xl cursor-pointer mt-0.5"
      onClick={toogleShow}
    />
  );
}
