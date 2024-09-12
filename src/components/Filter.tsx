import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { getCourseByAbbreviation, getSemesterCourses } from '@/helpers/courses';

interface TagGroup {
  name: string;
  values: string[];
}

interface FilterProps {
  type: string;
  tags: { course: TagGroup; semester: TagGroup };
  allTags: string[];
}

export default function Filter({ type, tags, allTags }: FilterProps) {
  const [isShow, setIsShow] = useState(false);

  const toggleShow = () => {
    setIsShow(!isShow);
  };

  return isShow ? (
    <>
      <div
        className="fixed h-full w-full right-0 top-0 bg-black bg-opacity-50 z-10"
        onClick={toggleShow}
      ></div>

      <div className="absolute w-2/3 md:w-1/3 lg:w-1/4 min-h-screen right-0 top-0 bottom-0 bg-gray-100 shadow-lg p-4 z-50">
        <Icon
          icon="material-symbols:close"
          className="float-right text-2xl cursor-pointer"
          onClick={toggleShow}
        />
        <h1 className="font-bold text-xl capitalize text-center mb-8">Tags</h1>
        {type === 'codes' &&
          Object.values(tags)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-lg capitalize">{tag.name}</h3>
                <nav>
                  {tag.values
                    .sort((a, b) => a.localeCompare(b))
                    .map((value) => (
                      <a
                        href={`/projects/${type}/${value}/1`}
                        className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 uppercase last:mr-0 mr-1 mt-1"
                      >
                        {value}
                      </a>
                    ))}
                </nav>
              </div>
            ))}
        {type === 'people' &&
          Object.entries(getSemesterCourses(tags.semester.values)).map(
            ([course, semesters]: [string, string[]]) => (
              <div key={course} className="mb-4">
                <h3 className="font-semibold text-lg">
                  {getCourseByAbbreviation(course).data.name}
                </h3>
                <nav>
                  <a
                    href={`/projects/${type}/${course}/1`}
                    className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 lowercase last:mr-0 mr-1 mt-1"
                  >
                    {course}
                  </a>
                  {allTags.includes(`egresso-${course}`) && (
                    <a
                      href={`/projects/${type}/egresso-${course}/1`}
                      className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 lowercase last:mr-0 mr-1 mt-1"
                    >
                      {course}-egressos
                    </a>
                  )}
                  {semesters.map((semester) => (
                    <a
                      href={`/projects/${type}/${course}-${semester}/1`}
                      className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 last:mr-0 mr-1 mt-1"
                    >
                      {semester}
                    </a>
                  ))}
                </nav>
              </div>
            )
          )}
        {type === 'people' && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Outros</h3>
            <nav>
              <a
                href={`/projects/${type}/professor/1`}
                className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 lowercase last:mr-0 mr-1 mt-1"
              >
                professor
              </a>
              <a
                href={`/projects/${type}/egresso/1`}
                className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-white hover:bg-gray-600 hover:text-white transition duration-500 lowercase last:mr-0 mr-1 mt-1"
              >
                egressos
              </a>
            </nav>
          </div>
        )}
      </div>
    </>
  ) : (
    <div className="relative">
      <Icon
        icon="material-symbols:filter-alt"
        className="absolute right-0 mr-[10%] md:mr-32 lg:mr-32 xl:mr-0 text-4xl cursor-pointer mt-0.5"
        onClick={toggleShow}
      />
    </div>
  );
}
