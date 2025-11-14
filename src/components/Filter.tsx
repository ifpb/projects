import React, { useState, useMemo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import {
  getCourse,
  getCourseByAbbreviation,
  getPeriodCourses,
} from '@/helpers/courses';
import { getSubject } from '@/helpers/subjects';
import Accordion from './Accordion';
import Badge from './Badge';
import { abbreviationCourses, campi, cities } from '@/content/config';

interface TagGroup {
  name: string;
  values: string[];
}

interface FilterProps {
  type: string;
  tags: { course: TagGroup; period: TagGroup; subject?: TagGroup };
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
      { url: '/projects/codes/workflow/1', value: 'projeto' },
      { url: '/projects/codes/homepage/1', value: 'homepage' },
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
      { url: '/projects/people/design/1', value: 'design' },
      { url: '/projects/people/researchgate/1', value: 'researchgate' },
    ],
  },
];

const Filter = React.memo(function Filter({
  type,
  tags,
  peopleTags,
  projectTags,
}: FilterProps) {
  const [isShow, setIsShow] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  // Memoizar badges de tags de projetos
  const projectTagsBadges = useMemo(
    () =>
      projectTags.map((tag) => ({
        url: `/projects/codes/${encodeURIComponent(tag)}/1`,
        value: tag,
      })),
    [projectTags]
  );

  // Atualizar CODES_EXTRA_ACCORDIONS apenas quando necessário
  useMemo(() => {
    const codesTagsAccordion = CODES_EXTRA_ACCORDIONS.find(
      (acc) => acc.id === 'codes-tags'
    );
    if (codesTagsAccordion) {
      codesTagsAccordion.badges = projectTagsBadges;
    }
  }, [projectTagsBadges]);

  const toggleShow = useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);

  const toggleAccordion = useCallback((accordionId: string) => {
    setOpenAccordion((prev) => (prev === accordionId ? null : accordionId));
  }, []);

  const handleDetailsToggle = useCallback((detailsId: string) => {
    setOpenDetails((prev) => (prev === detailsId ? null : detailsId));
  }, []);

  const createCourseAccordion = useCallback(
    (course: string, periods: string[]): AccordionConfig => {
      const badges = [{ url: `/projects/people/${course}/1`, value: 'Todos' }];

      if (peopleTags.includes(`egresso-${course}`)) {
        badges.push({
          url: `/projects/people/egresso-${course}/1`,
          value: 'Egressos',
        });
      }

      periods.forEach((period) => {
        badges.push({
          url: `/projects/people/${course}-${period}/1`,
          value: period,
        });
      });

      const subjectTags = peopleTags.filter((tag) => {
        const parts = tag.split('-');
        if (parts.length === 4) {
          const [subjectCode, courseCode, campusCode, period] = parts;
          return (
            `${courseCode}-${campusCode}` === course &&
            Object.keys(cities).includes(campusCode) &&
            abbreviationCourses.some((abbreviation) =>
              abbreviation.includes(courseCode)
            )
          );
        }
        return false;
      });

      subjectTags.forEach((tag) => {
        const parts = tag.split('-');
        const subject = parts[0];
        const period = parts.at(-1);
        badges.push({
          url: `/projects/people/${tag}/1`,
          value: `${subject.toUpperCase()} ${period}`,
        });
      });

      return {
        id: `people-${course}`,
        title: getCourseByAbbreviation(course).data.name,
        badges,
      };
    },
    [peopleTags]
  );

  // Memoizar dados para códigos
  const codesGroupedByLevel = useMemo(
    () =>
      type === 'codes'
        ? Object.entries(
            tags.course?.values?.reduce(
              (acc: Record<string, string[]>, courseTag: string) => {
                const courseData = getCourse(courseTag);
                if (courseData) {
                  const level = courseData.data.level.compact.split(' ')[0];
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
        : [],
    [type, tags.course?.values]
  );

  const codesSubjectsByCourse = useMemo(
    () =>
      type === 'codes'
        ? tags.course?.values?.map((courseTag: string) => {
            const courseData = getCourseByAbbreviation(courseTag);
            const parts = courseTag.split('-');
            const campus = parts.length > 1 ? parts[parts.length - 1] : '';
            const campusName = campus ? ` | ${campus.toUpperCase()}` : '';
            const courseDisplayName = `${courseData?.data.name}${campusName}`;

            const courseSubjects =
              tags.subject?.values?.filter((subjectTag: string) =>
                subjectTag.includes(`-${courseTag}`)
              ) || [];

            return courseSubjects.length > 0
              ? {
                  courseTag,
                  courseDisplayName,
                  courseSubjects,
                }
              : null;
          })
        : [],
    [type, tags.course?.values, tags.subject?.values]
  );

  // Memoizar dados para pessoas
  const peopleGroupedByLevel = useMemo(
    () =>
      type === 'people'
        ? Object.entries(
            Object.entries(getPeriodCourses(tags.period.values)).reduce(
              (
                acc: Record<string, Array<[string, string[]]>>,
                [course, periods]: [string, string[]]
              ) => {
                const courseData = getCourseByAbbreviation(course);
                const level =
                  courseData?.data.level.compact.split(' ')[0] || 'Outros';
                if (!acc[level]) {
                  acc[level] = [];
                }
                acc[level].push([course, periods]);
                return acc;
              },
              {}
            )
          )
        : [],
    [type, tags.period.values]
  );

  const availableCampuses = useMemo(
    () =>
      type === 'people'
        ? Object.keys(campi)
            .filter((campusKey) => {
              const campusCode = campusKey.replace('ifpb-', '');
              return peopleTags.some((tag) => tag.includes(campusCode));
            })
            .sort()
            .map((campusKey) => {
              const campusCode = campusKey.replace('ifpb-', '');
              return {
                key: campusKey,
                code: campusCode,
                name: campi[campusKey],
              };
            })
        : [],
    [type, peopleTags]
  );

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
            <h1 className="font-bold text-base capitalize mb-4">Acadêmico</h1>
            <details open={openDetails === 'cursos'} className="mb-2">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('cursos');
                  setOpenAccordion(null);
                }}
              >
                Cursos
              </summary>
              {codesGroupedByLevel
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
                            const courseA = getCourse(a);
                            const courseB = getCourse(b);
                            return (
                              courseA?.data.name.localeCompare(
                                courseB?.data.name
                              ) || 0
                            );
                          })
                          .map((courseTag) => {
                            const courseData = getCourse(courseTag);
                            // Extrair campus do courseTag se existir
                            const parts = courseTag.split('-');
                            const campus =
                              parts.length > 1 ? parts[parts.length - 1] : '';
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
            {codesSubjectsByCourse
              .filter((courseData) => courseData !== null)
              .map((courseData) => {
                const { courseTag, courseDisplayName, courseSubjects } =
                  courseData!;

                const courseAccordionId = `codes-course-${courseTag}`;
                const isCourseOpen = openAccordion === courseAccordionId;

                return (
                  <details
                    key={courseTag}
                    open={openDetails === `course-${courseTag}`}
                    className="mb-2"
                  >
                    <summary
                      className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDetailsToggle(`course-${courseTag}`);
                        setOpenAccordion(null);
                      }}
                    >
                      {courseDisplayName}
                    </summary>
                    <div className="ml-2">
                      {courseSubjects.map((subjectTag: string) => {
                        const subjectData = getSubject(subjectTag);
                        const subjectName =
                          subjectData?.data.name.full || subjectTag;

                        const subjectPeriods =
                          tags.period?.values?.filter((periodTag: string) =>
                            periodTag.startsWith(`${subjectTag}-`)
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
                              {subjectPeriods
                                .sort((a, b) => {
                                  const periodA = a.split('-').pop() || '';
                                  const periodB = b.split('-').pop() || '';
                                  return periodB.localeCompare(periodA);
                                })
                                .map((periodTag) => {
                                  const period = periodTag.split('-').pop();
                                  return (
                                    <Badge
                                      key={periodTag}
                                      url={`/projects/${type}/${periodTag}/1`}
                                      value={period || ''}
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
              })}{' '}
            <h1 className="font-bold text-base capitalize mb-4">Outros</h1>
            <details open={openDetails === 'extra-codes'} className="mb-2">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('extra-codes');
                  setOpenAccordion(null);
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

        {type === 'people' && (
          <>
            <h1 className="font-bold text-base capitalize mb-4">Acadêmico</h1>
            {peopleGroupedByLevel
              .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
              .map(([level, coursesInLevel]) => (
                <details
                  key={level}
                  open={openDetails === `people-${level}`}
                  className="mb-2"
                >
                  <summary
                    className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDetailsToggle(`people-${level}`);
                      setOpenAccordion(null);
                    }}
                  >
                    {`Cursos | ${level}`}
                  </summary>
                  <div className="ml-2 mt-2">
                    {coursesInLevel
                      .sort(([a], [b]) =>
                        getCourseByAbbreviation(a).data.name.localeCompare(
                          getCourseByAbbreviation(b).data.name
                        )
                      )
                      .map(([course, periods]: [string, string[]]) => {
                        const accordion = createCourseAccordion(
                          course,
                          periods
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
          </>
        )}

        {type === 'people' && (
          <>
            <details open={openDetails === 'campus'} className="mb-2">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('campus');
                  setOpenAccordion(null);
                }}
              >
                Campus
              </summary>
              <div className="mb- ml-2">
                <Accordion
                  id="people-campus"
                  title="Cidades"
                  isOpen={openAccordion === 'people-campus'}
                  onToggle={toggleAccordion}
                >
                  {availableCampuses.map((campus) => (
                    <Badge
                      key={campus.key}
                      url={`/projects/people/${campus.code}/1`}
                      value={campus.name}
                    />
                  ))}
                </Accordion>
              </div>
            </details>
          </>
        )}
        {type === 'people' && (
          <>
            <details open={openDetails === 'tipos'} className="mb-6">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('tipos');
                  setOpenAccordion(null);
                }}
              >
                Perfis
              </summary>
              <div className="ml-2 mt-2">
                {(() => {
                  const tiposAccordion = PEOPLE_EXTRA_ACCORDIONS.find(
                    (accordion) => accordion.id === 'people-types'
                  );
                  if (!tiposAccordion) return null;
                  const isOpen = openAccordion === tiposAccordion.id;

                  return (
                    <div className="mb-4">
                      <Accordion
                        id={tiposAccordion.id}
                        title={tiposAccordion.title}
                        isOpen={isOpen}
                        onToggle={toggleAccordion}
                      >
                        {tiposAccordion.badges.map((badge) => (
                          <Badge
                            key={badge.value}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </Accordion>
                    </div>
                  );
                })()}
              </div>
            </details>
          </>
        )}
        {type === 'people' && (
          <>
            <h1 className="font-bold text-base capitalize mb-4">Outros</h1>
            <details open={openDetails === 'extra-people'} className="mb-6">
              <summary
                className="font-bold text-sm mb-3 text-gray-800 cursor-pointer hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsToggle('extra-people');
                  setOpenAccordion(null);
                }}
              >
                Extra
              </summary>
              <div className="mt-2">
                {PEOPLE_EXTRA_ACCORDIONS.filter(
                  (accordion) => accordion.id !== 'people-types'
                ).map((accordion) => {
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
          </>
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
});

export default Filter;
