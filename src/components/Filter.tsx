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
      className="text-xs font-semibold inline-block uppercase last:mr-0 mr-1 mb-1 py-1 px-2 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-700 hover:text-white transition duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {value}
    </a>
  );
}

export default function Filter({ type, tags, allTags }: FilterProps) {
  const [isShow, setIsShow] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleShow = () => {
    setIsShow(!isShow);
  };

  const toggleAccordion = (accordionId: string) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
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
            .filter((tag) =>
              ['curso', 'disciplina', 'semestre'].includes(tag.name)
            )
            .map((tag, index) => {
              const accordionId = `codes-${tag.name}-${index}`;
              const isOpen = openAccordion === accordionId;

              return (
                <div key={index} className="mb-4">
                  <div className="group">
                    <div
                      onClick={() => toggleAccordion(accordionId)}
                      className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                        isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
                      }`}
                    >
                      <h1 className="font-semibold text-sm capitalize m-0">
                        {tag.name}
                      </h1>
                      <Icon
                        icon="mdi:chevron-down"
                        className={`text-xl transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                        {tag.values
                          .sort((a, b) => a.localeCompare(b))
                          .map((value) => (
                            <Badge
                              key={value}
                              url={`/projects/${type}/${value}/1`}
                              value={value}
                            />
                          ))}
                      </nav>
                    )}
                  </div>
                </div>
              );
            })}
        {type === 'codes' &&
          (() => {
            const accordionId = 'codes-tipo';
            const isOpen = openAccordion === accordionId;

            return (
              <div className="mb-4">
                <div className="group">
                  <div
                    onClick={() => toggleAccordion(accordionId)}
                    className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                      isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
                    }`}
                  >
                    <h1 className="font-semibold text-sm m-0">Tipo</h1>
                    <Icon
                      icon="mdi:chevron-down"
                      className={`text-xl transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                      <Badge
                        url={`/projects/codes/subject/1`}
                        value="Disciplina"
                      />
                      <Badge
                        url={`/projects/codes/research/1`}
                        value="Pesquisa"
                      />
                      {/* <Badge url={`/projects/codes/extension/1`} value="Extensão" /> */}
                      <Badge
                        url={`/projects/codes/open%20source/1`}
                        value="Open Source"
                      />
                    </nav>
                  )}
                </div>
              </div>
            );
          })()}
        {type === 'codes' &&
          (() => {
            const accordionId = 'codes-extra';
            const isOpen = openAccordion === accordionId;

            return (
              <div className="mb-4">
                <div className="group">
                  <div
                    onClick={() => toggleAccordion(accordionId)}
                    className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                      isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
                    }`}
                  >
                    <h1 className="font-semibold text-sm m-0">Extra</h1>
                    <Icon
                      icon="mdi:chevron-down"
                      className={`text-xl transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                      <Badge url={`/projects/codes/figma/1`} value="figma" />
                    </nav>
                  )}
                </div>
              </div>
            );
          })()}
        {type === 'people' &&
          Object.entries(
            Object.entries(getSemesterCourses(tags.semester.values)).reduce(
              (
                acc: Record<string, Array<[string, string[]]>>,
                [course, semesters]: [string, string[]]
              ) => {
                const courseData = getCourseByAbbreviation(course);
                const level = courseData?.data.level.compact || 'Outros';
                if (!acc[level]) {
                  acc[level] = [];
                }
                acc[level].push([course, semesters]);
                return acc;
              },
              {}
            )
          )
            .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
            .map(([level, coursesInLevel]) => (
              <div key={level} className="mb-6">
                <h3 className="font-bold text-base mb-3 text-gray-800">
                  {level}
                </h3>
                {coursesInLevel
                  .sort(([a], [b]) =>
                    getCourseByAbbreviation(a).data.name.localeCompare(
                      getCourseByAbbreviation(b).data.name
                    )
                  )
                  .map(([course, semesters]: [string, string[]]) => {
                    const accordionId = `people-${course}`;
                    const isOpen = openAccordion === accordionId;

                    return (
                      <div key={course} className="mb-4 ml-2">
                        <div className="group">
                          <div
                            onClick={() => toggleAccordion(accordionId)}
                            className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                              isOpen
                                ? 'rounded-b-none bg-gray-300'
                                : 'bg-gray-200'
                            }`}
                          >
                            <h1 className="font-semibold text-sm m-0">
                              {getCourseByAbbreviation(course).data.name}
                            </h1>
                            <Icon
                              icon="mdi:chevron-down"
                              className={`text-xl transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          {isOpen && (
                            <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                              <Badge
                                url={`/projects/people/${course}/1`}
                                value="Alunos"
                              />

                              {allTags.includes(`egresso-${course}`) && (
                                <Badge
                                  url={`/projects/people/egresso-${course}/1`}
                                  value="Egressos"
                                />
                              )}

                              {semesters.map((semester) => (
                                <Badge
                                  key={semester}
                                  url={`/projects/people/${course}-${semester}/1`}
                                  value={semester}
                                />
                              ))}
                            </nav>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
        {type === 'people' && (
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 text-gray-800">Extra</h3>
            <div className="mb-4 ml-2">
              {(() => {
                const accordionId = 'people-tipos';
                const isOpen = openAccordion === accordionId;

                return (
                  <div className="group">
                    <div
                      onClick={() => toggleAccordion(accordionId)}
                      className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                        isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
                      }`}
                    >
                      <h1 className="font-semibold text-sm m-0">Tipos</h1>
                      <Icon
                        icon="mdi:chevron-down"
                        className={`text-xl transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                        <Badge
                          url={`/projects/people/professor/1`}
                          value="professores"
                        />
                        <Badge
                          url={`/projects/people/student/1`}
                          value="alunos"
                        />
                        <Badge
                          url={`/projects/people/técnico/1`}
                          value="técnico"
                        />
                        <Badge
                          url={`/projects/people/graduação/1`}
                          value="graduação"
                        />
                        <Badge
                          url={`/projects/people/mestrado/1`}
                          value="mestrado"
                        />
                        <Badge
                          url={`/projects/people/egresso/1`}
                          value="egressos"
                        />
                      </nav>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="mb-4 ml-2">
              {(() => {
                const accordionId = 'people-recursos';
                const isOpen = openAccordion === accordionId;

                return (
                  <div className="group">
                    <div
                      onClick={() => toggleAccordion(accordionId)}
                      className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
                        isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
                      }`}
                    >
                      <h1 className="font-semibold text-sm m-0">Recursos</h1>
                      <Icon
                        icon="mdi:chevron-down"
                        className={`text-xl transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
                        <Badge
                          url={`/projects/people/projects/1`}
                          value="projetos"
                        />
                        <Badge
                          url={`/projects/people/homepage/1`}
                          value="homepage"
                        />
                        <Badge url={`/projects/people/figma/1`} value="figma" />
                        <Badge
                          url={`/projects/people/researchgate/1`}
                          value="researchgate"
                        />
                      </nav>
                    )}
                  </div>
                );
              })()}
            </div>
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
