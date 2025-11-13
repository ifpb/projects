import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { getCourseByAbbreviation, getSemesterCourses } from '@/helpers/courses';
import { getSubject } from '@/helpers/subjects';
import Accordion from './Accordion';
import Badge from './Badge';

interface TagGroup {
  name: string;
  values: string[];
}

interface FilterProps {
  type: string;
  tags: { course: TagGroup; semester: TagGroup; subject?: TagGroup };
  peopleTags: string[];
  projectTags: string[];
}

interface AccordionConfig {
  id: string;
  title: string;
  badges: { url: string; value: string }[];
}

const CODES_EXTRA_ACCORDIONS: AccordionConfig[] = [
  {
    id: 'codes-type',
    title: 'Tipo',
    badges: [
      { url: '/projects/codes/subject/1', value: 'Disciplina' },
      { url: '/projects/codes/research/1', value: 'Pesquisa' },
      { url: '/projects/codes/extension/1', value: 'Extensão' },
      { url: '/projects/codes/open%20source/1', value: 'Open Source' },
    ],
  },
  {
    id: 'codes-resource',
    title: 'Recursos',
    badges: [
      { url: '/projects/codes/design/1', value: 'design' },
      { url: '/projects/codes/workflow/1', value: 'workflow' },
    ],
  },
  {
    id: 'codes-tags',
    title: 'Tags',
    badges: [],
  },
];

const PEOPLE_EXTRA_ACCORDIONS: AccordionConfig[] = [
  {
    id: 'people-types',
    title: 'Tipos',
    badges: [
      { url: '/projects/people/professor/1', value: 'professores' },
      { url: '/projects/people/student/1', value: 'alunos' },
      { url: '/projects/people/técnico/1', value: 'técnico' },
      { url: '/projects/people/graduação/1', value: 'graduação' },
      { url: '/projects/people/mestrado/1', value: 'mestrado' },
      { url: '/projects/people/egresso/1', value: 'egressos' },
    ],
  },
  {
    id: 'people-resources',
    title: 'Recursos',
    badges: [
      { url: '/projects/people/projects/1', value: 'projetos' },
      { url: '/projects/people/homepage/1', value: 'homepage' },
      { url: '/projects/people/figma/1', value: 'figma' },
      { url: '/projects/people/researchgate/1', value: 'researchgate' },
    ],
  },
];

export default function Filter({
  type,
  tags,
  peopleTags,
  projectTags,
}: FilterProps) {
  const [isShow, setIsShow] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  const projectTagsBadges = projectTags.map((tag) => ({
    url: `/projects/codes/${encodeURIComponent(tag)}/1`,
    value: tag,
  }));

  CODES_EXTRA_ACCORDIONS.find((acc) => acc.id === 'codes-tags')!.badges =
    projectTagsBadges;

  const toggleShow = () => {
    setIsShow(!isShow);
  };

  const toggleAccordion = (accordionId: string) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  const handleDetailsToggle = (detailsId: string) => {
    setOpenDetails(openDetails === detailsId ? null : detailsId);
  };

  const createCourseAccordion = (
    course: string,
    semesters: string[]
  ): AccordionConfig => {
    const badges = [{ url: `/projects/people/${course}/1`, value: 'Alunos' }];

    if (peopleTags.includes(`egresso-${course}`)) {
      badges.push({
        url: `/projects/people/egresso-${course}/1`,
        value: 'Egressos',
      });
    }

    semesters.forEach((semester) => {
      badges.push({
        url: `/projects/people/${course}-${semester}/1`,
        value: semester,
      });
    });

    return {
      id: `people-${course}`,
      title: getCourseByAbbreviation(course).data.name,
      badges,
    };
  };

  return isShow ? (
    <>
      <div
        className="fixed h-full w-full right-0 top-0 bg-black bg-opacity-50 z-10"
        onClick={toggleShow}
      ></div>

      <div className="absolute w-2/3 md:w-1/3 lg:w-1/4 max-w-[400px] min-h-screen right-0 top-0 bottom-0 bg-gray-100 shadow-lg p-4 z-50 overflow-y-auto">
        <Icon
          icon="material-symbols:close"
          className="float-right text-2xl cursor-pointer"
          onClick={toggleShow}
        />
        <h1 className="font-bold text-xl capitalize text-center mb-8">
          Filtros
        </h1>
        {type === 'codes' && (
          <>
            <details open={openDetails === 'cursos'} className="mb-6">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('cursos');
                }}
              >
                Cursos
              </summary>
              {Object.entries(
                tags.course?.values?.reduce(
                  (acc: Record<string, string[]>, courseTag: string) => {
                    const courseData = getCourseByAbbreviation(
                      courseTag.split('-')[0]
                    );
                    if (courseData) {
                      const level = courseData.data.level.compact;
                      if (!acc[level]) {
                        acc[level] = [];
                      }
                      acc[level].push(courseTag);
                    }
                    return acc;
                  },
                  {}
                ) || {}
              )
                .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
                .map(([level, coursesInLevel]) => {
                  const levelAccordionId = `codes-level-${level}`;
                  const isLevelOpen = openAccordion === levelAccordionId;

                  return (
                    <div key={level} className="mb-4 ml-2">
                      <Accordion
                        id={levelAccordionId}
                        title={level}
                        isOpen={isLevelOpen}
                        onToggle={toggleAccordion}
                      >
                        {coursesInLevel
                          .sort((a, b) => {
                            const courseA = getCourseByAbbreviation(
                              a.split('-')[0]
                            );
                            const courseB = getCourseByAbbreviation(
                              b.split('-')[0]
                            );
                            return (
                              courseA?.data.name.localeCompare(
                                courseB?.data.name
                              ) || 0
                            );
                          })
                          .map((courseTag) => {
                            const [courseAbbr, campus] = courseTag.split('-');
                            const courseData =
                              getCourseByAbbreviation(courseAbbr);
                            const campusName = campus
                              ? ` | ${campus.toUpperCase()}`
                              : '';
                            const displayName = `${courseData?.data.name}${campusName}`;

                            return (
                              <Badge
                                key={courseTag}
                                url={`/projects/${type}/${courseTag}/1`}
                                value={displayName}
                              />
                            );
                          })}
                      </Accordion>
                    </div>
                  );
                })}
            </details>

            {tags.course?.values?.map((courseTag: string) => {
              const [courseAbbr, campus] = courseTag.split('-');
              const courseData = getCourseByAbbreviation(courseAbbr);
              const campusName = campus ? ` | ${campus.toUpperCase()}` : '';
              const courseDisplayName = `${courseData?.data.name}${campusName}`;

              const courseSubjects =
                tags.subject?.values?.filter((subjectTag: string) =>
                  subjectTag.includes(`-${courseAbbr}-${campus}`)
                ) || [];

              if (courseSubjects.length === 0) return null;

              const courseAccordionId = `codes-course-${courseTag}`;
              const isCourseOpen = openAccordion === courseAccordionId;

              return (
                <details
                  key={courseTag}
                  open={openDetails === `course-${courseTag}`}
                  className="mb-6"
                >
                  <summary
                    className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDetailsToggle(`course-${courseTag}`);
                    }}
                  >
                    {courseDisplayName}
                  </summary>
                  <div className="ml-2">
                    {courseSubjects.map((subjectTag: string) => {
                      const subjectData = getSubject(subjectTag);
                      const subjectName =
                        subjectData?.data.name.full || subjectTag;

                      const subjectSemesters =
                        tags.semester?.values?.filter((semesterTag: string) =>
                          semesterTag.startsWith(`${subjectTag}-`)
                        ) || [];

                      const subjectAccordionId = `codes-subject-${subjectTag}`;
                      const isSubjectOpen =
                        openAccordion === subjectAccordionId;

                      return (
                        <div key={subjectTag} className="mb-4 ml-2">
                          <Accordion
                            id={subjectAccordionId}
                            title={subjectName}
                            isOpen={isSubjectOpen}
                            onToggle={toggleAccordion}
                          >
                            <Badge
                              key={`${subjectTag}-all`}
                              url={`/projects/${type}/${subjectTag}/1`}
                              value="Todos"
                            />
                            {subjectSemesters
                              .sort((a, b) => {
                                const semesterA = a.split('-').pop() || '';
                                const semesterB = b.split('-').pop() || '';
                                return semesterB.localeCompare(semesterA);
                              })
                              .map((semesterTag) => {
                                const semester = semesterTag.split('-').pop();
                                return (
                                  <Badge
                                    key={semesterTag}
                                    url={`/projects/${type}/${semesterTag}/1`}
                                    value={semester || ''}
                                  />
                                );
                              })}
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                </details>
              );
            })}

            <details open={openDetails === 'extra-codes'} className="mb-6">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('extra-codes');
                }}
              >
                Extra
              </summary>
              <div className="ml-2 mt-2">
                {CODES_EXTRA_ACCORDIONS.map((accordion) => {
                  const isOpen = openAccordion === accordion.id;

                  return (
                    <div key={accordion.id} className="mb-4">
                      <Accordion
                        id={accordion.id}
                        title={accordion.title}
                        isOpen={isOpen}
                        onToggle={toggleAccordion}
                      >
                        {accordion.badges.map((badge) => (
                          <Badge
                            key={badge.value}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            </details>
          </>
        )}

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
              <details
                key={level}
                open={openDetails === `people-${level}`}
                className="mb-6"
              >
                <summary
                  className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDetailsToggle(`people-${level}`);
                  }}
                >
                  {level}
                </summary>
                <div className="ml-2 mt-2">
                  {coursesInLevel
                    .sort(([a], [b]) =>
                      getCourseByAbbreviation(a).data.name.localeCompare(
                        getCourseByAbbreviation(b).data.name
                      )
                    )
                    .map(([course, semesters]: [string, string[]]) => {
                      const accordion = createCourseAccordion(
                        course,
                        semesters
                      );
                      const isOpen = openAccordion === accordion.id;

                      return (
                        <div key={course} className="mb-4 ml-2">
                          <Accordion
                            id={accordion.id}
                            title={accordion.title}
                            isOpen={isOpen}
                            onToggle={toggleAccordion}
                          >
                            {accordion.badges.map((badge) => (
                              <Badge
                                key={badge.value}
                                url={badge.url}
                                value={badge.value}
                              />
                            ))}
                          </Accordion>
                        </div>
                      );
                    })}
                </div>
              </details>
            ))}
        {type === 'people' && (
          <details open={openDetails === 'extra-people'} className="mb-6">
            <summary
              className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
              onClick={(e) => {
                e.preventDefault();
                handleDetailsToggle('extra-people');
              }}
            >
              Extra
            </summary>
            <div className="mt-2">
              {PEOPLE_EXTRA_ACCORDIONS.map((accordion) => {
                const isOpen = openAccordion === accordion.id;

                return (
                  <div key={accordion.id} className="mb-4 ml-2">
                    <Accordion
                      id={accordion.id}
                      title={accordion.title}
                      isOpen={isOpen}
                      onToggle={toggleAccordion}
                    >
                      {accordion.badges.map((badge) => (
                        <Badge
                          key={badge.value}
                          url={badge.url}
                          value={badge.value}
                        />
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </details>
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
