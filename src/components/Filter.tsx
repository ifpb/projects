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

function Badge({ url, value }: { url: string; value: string }) {
  return (
    <a
      href={url}
      className="text-xs font-semibold inline-block uppercase last:mr-0 mr-1 mb-1 py-1 px-2 rounded-full bg-white hover:bg-gray-700 hover:text-white transition duration-300"
    >
      {value}
    </a>
  );
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

      <div className="absolute w-2/3 md:w-1/3 lg:w-1/4 max-w-[400px] min-h-screen right-0 top-0 bottom-0 bg-gray-100 shadow-lg p-4 z-50">
        <Icon
          icon="material-symbols:close"
          className="float-right text-2xl cursor-pointer"
          onClick={toggleShow}
        />
        <h1 className="font-bold text-xl capitalize text-center mb-8">Tags</h1>
        {type === 'codes' &&
          Object.values(tags)
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((tag => ['curso', 'disciplina', 'semestre'].includes(tag.name)))
            .map((tag, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-lg capitalize">{tag.name}</h3>
                <nav>
                  {tag.values
                    .sort((a, b) => a.localeCompare(b))
                    .map((value) => (
                      <Badge
                        url={`/projects/${type}/${value}/1`}
                        value={value}
                      />
                    ))}
                </nav>
              </div>
            ))}
        {type === 'codes' && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Tipo</h3>
            <nav>
              <Badge url={`/projects/codes/subject/1`} value="Disciplina" />
              <Badge url={`/projects/codes/research/1`} value="Pesquisa" />
              {/* <Badge url={`/projects/codes/extension/1`} value="Extensão" /> */}
              <Badge
                url={`/projects/codes/open%20source/1`}
                value="Open Source"
              />
            </nav>
          </div>
        )}
        {type === 'codes' && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Outros</h3>
            <nav>
              <Badge url={`/projects/codes/figma/1`} value="figma" />
            </nav>
          </div>
        )}
        {type === 'people' &&
          Object.entries(getSemesterCourses(tags.semester.values)).map(
            ([course, semesters]: [string, string[]]) => (
              <div key={course} className="mb-4">
                <h3 className="font-semibold text-lg">
                  {getCourseByAbbreviation(course).data.name}
                </h3>
                <nav>
                  <Badge url={`/projects/people/${course}/1`} value={course} />

                  {allTags.includes(`egresso-${course}`) && (
                    <Badge
                      url={`/projects/people/egresso-${course}/1`}
                      value={`${course}-egressos`}
                    />
                  )}

                  {semesters.map((semester) => (
                    <Badge
                      url={`/projects/people/${course}-${semester}/1`}
                      value={semester}
                    />
                  ))}
                </nav>
              </div>
            )
          )}
        {type === 'people' && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Outros</h3>
            <nav>
              <Badge url={`/projects/people/professor/1`} value="professor" />
              <Badge url={`/projects/people/egresso/1`} value="egressos" />
              <Badge url={`/projects/people/projetos/1`} value="projetos" />
              <Badge url={`/projects/people/homepage/1`} value="homepage" />
              <Badge url={`/projects/people/figma/1`} value="figma" />
              <Badge
                url={`/projects/people/researchgate/1`}
                value="researchgate"
              />
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
