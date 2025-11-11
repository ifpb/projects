import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { getCourseByAbbreviation, getSemesterCourses } from '@/helpers/courses';
import Accordion from './Accordion';
import Badge from './Badge';

interface TagGroup {
  name: string;
  values: string[];
}

interface FilterProps {
  type: string;
  tags: { course: TagGroup; semester: TagGroup };
  allTags: string[];
}

interface AccordionConfig {
  id: string;
  title: string;
  badges: { url: string; value: string }[];
}

const CODES_STATIC_ACCORDIONS: AccordionConfig[] = [
  {
    id: 'codes-tipo',
    title: 'Tipo',
    badges: [
      { url: '/projects/codes/subject/1', value: 'Disciplina' },
      { url: '/projects/codes/research/1', value: 'Pesquisa' },
      // { url: '/projects/codes/extension/1', value: 'Extensão' },
      { url: '/projects/codes/open%20source/1', value: 'Open Source' },
    ],
  },
  {
    id: 'codes-extra',
    title: 'Extra',
    badges: [{ url: '/projects/codes/figma/1', value: 'figma' }],
  },
];

const PEOPLE_EXTRA_ACCORDIONS: AccordionConfig[] = [
  {
    id: 'people-tipos',
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
    id: 'people-recursos',
    title: 'Recursos',
    badges: [
      { url: '/projects/people/projects/1', value: 'projetos' },
      { url: '/projects/people/homepage/1', value: 'homepage' },
      { url: '/projects/people/figma/1', value: 'figma' },
      { url: '/projects/people/researchgate/1', value: 'researchgate' },
    ],
  },
];

export default function Filter({ type, tags, allTags }: FilterProps) {
  const [isShow, setIsShow] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleShow = () => {
    setIsShow(!isShow);
  };

  const toggleAccordion = (accordionId: string) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  // Função auxiliar para criar accordions de cursos dinamicamente
  const createCourseAccordion = (
    course: string,
    semesters: string[]
  ): AccordionConfig => {
    const badges = [{ url: `/projects/people/${course}/1`, value: 'Alunos' }];

    // Adicionar badge de egressos se existir
    if (allTags.includes(`egresso-${course}`)) {
      badges.push({
        url: `/projects/people/egresso-${course}/1`,
        value: 'Egressos',
      });
    }

    // Adicionar badges de semestres
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
                  <Accordion
                    id={accordionId}
                    title={tag.name}
                    isOpen={isOpen}
                    onToggle={toggleAccordion}
                  >
                    {tag.values
                      .sort((a, b) => a.localeCompare(b))
                      .map((value) => (
                        <Badge
                          key={value}
                          url={`/projects/${type}/${value}/1`}
                          value={value}
                        />
                      ))}
                  </Accordion>
                </div>
              );
            })}
        {type === 'codes' &&
          CODES_STATIC_ACCORDIONS.map((accordion) => {
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
                    const accordion = createCourseAccordion(course, semesters);
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
            ))}
        {type === 'people' && (
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 text-gray-800">Extra</h3>
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
