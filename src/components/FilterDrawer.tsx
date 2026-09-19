import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import Accordion from "./Accordion";
import Badge from "./Badge";
import type { CourseInfo, SubjectInfo } from "@/lib/taxonomy";
import {
  abbreviationCourses,
  campi,
  cities,
  getPeriodCourses,
} from "@/lib/taxonomy";

interface TagGroup {
  name: string;
  values: string[];
}

export interface FilterDrawerProps {
  type: string;
  tags: { course: TagGroup; period: TagGroup; subject?: TagGroup };
  peopleTags?: string[];
  projectTags?: string[];
  courses: CourseInfo[];
  subjects: SubjectInfo[];
  onClose: () => void;
}

interface BadgeItem {
  url: string;
  value: string;
  category?: string;
}

const CODES_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "courses", label: "Cursos" },
  { id: "subjects", label: "Disciplinas" },
  { id: "types", label: "Tipos" },
  { id: "resources", label: "Recursos" },
  { id: "tags", label: "Tags" },
];

const PEOPLE_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "profiles", label: "Perfis" },
  { id: "courses", label: "Cursos" },
  { id: "campuses", label: "Campi" },
  { id: "resources", label: "Recursos" },
];

const CODES_TYPES_BADGES: BadgeItem[] = [
  { url: "/projects/codes/subject/1", value: "Disciplina" },
  { url: "/projects/codes/research/1", value: "Pesquisa" },
  { url: "/projects/codes/extension/1", value: "Extensão" },
  { url: "/projects/codes/open%20source/1", value: "Open Source" },
];

const CODES_RESOURCES_BADGES: BadgeItem[] = [
  { url: "/projects/codes/design/1", value: "design" },
  { url: "/projects/codes/workflow/1", value: "workflow" },
  { url: "/projects/codes/homepage/1", value: "homepage" },
];

const PEOPLE_PROFILES_BADGES: BadgeItem[] = [
  { url: "/projects/people/professor/1", value: "Docentes" },
  { url: "/projects/people/student/1", value: "Estudantes" },
  { url: "/projects/people/egresso/1", value: "Egressos" },
  { url: "/projects/people/técnico/1", value: "Técnico" },
  { url: "/projects/people/graduação/1", value: "Graduação" },
  { url: "/projects/people/mestrado/1", value: "Mestrado" },
];

const PEOPLE_RESOURCES_BADGES: BadgeItem[] = [
  { url: "/projects/people/projects/1", value: "com projetos" },
  { url: "/projects/people/homepage/1", value: "com homepage" },
  { url: "/projects/people/design/1", value: "com figma/design" },
  { url: "/projects/people/researchgate/1", value: "com researchgate" },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function FilterDrawer({
  type,
  tags,
  peopleTags = [],
  projectTags = [],
  courses,
  subjects,
  onClose,
}: FilterDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Mapas de indexação
  const courseMap = useMemo(() => {
    const map = new Map<string, CourseInfo>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  const courseAbbrMap = useMemo(() => {
    const map = new Map<string, CourseInfo>();
    courses.forEach((c) => map.set(c.abbreviation, c));
    return map;
  }, [courses]);

  const subjectMap = useMemo(() => {
    const map = new Map<string, SubjectInfo>();
    subjects.forEach((s) => map.set(s.id, s));
    return map;
  }, [subjects]);

  const getCourse = useCallback((id: string) => courseMap.get(id), [courseMap]);
  const getCourseByAbbreviation = useCallback(
    (abbreviation: string) => {
      const courseAbbr = abbreviation.includes("-")
        ? abbreviation.split("-")[0]
        : abbreviation;
      return courseAbbrMap.get(courseAbbr);
    },
    [courseAbbrMap],
  );
  const getSubject = useCallback(
    (id: string) => subjectMap.get(id),
    [subjectMap],
  );

  const toggleAccordion = useCallback((accordionId: string) => {
    setOpenAccordion((prev) => (prev === accordionId ? null : accordionId));
  }, []);

  // Dados estruturados de Códigos
  const codesGroupedByLevel = useMemo(() => {
    if (type !== "codes" || !tags.course?.values) return [];
    const grouped = tags.course.values.reduce(
      (acc: Record<string, string[]>, courseTag: string) => {
        const courseData = getCourse(courseTag);
        if (courseData) {
          const level = courseData.level.split(" ")[0];
          if (!acc[level]) acc[level] = [];
          acc[level].push(courseTag);
        }
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
      .map(([level, coursesInLevel]) => {
        const sortedCourses = [...coursesInLevel].sort((a, b) => {
          const nameA = getCourse(a)?.name ?? a;
          const nameB = getCourse(b)?.name ?? b;
          return nameA.localeCompare(nameB);
        });
        return [level, sortedCourses] as [string, string[]];
      });
  }, [type, tags.course?.values, getCourse]);

  const codesSubjectsByCourse = useMemo(() => {
    if (type !== "codes" || !tags.course?.values) return [];
    return tags.course.values
      .map((courseTag: string) => {
        const courseData = getCourseByAbbreviation(courseTag);
        const parts = courseTag.split("-");
        const campus = parts.length > 1 ? parts[parts.length - 1] : "";
        const campusName = campus ? ` | ${campus.toUpperCase()}` : "";
        const courseDisplayName = `${courseData?.name ?? courseTag}${campusName}`;

        const courseSubjects =
          tags.subject?.values?.filter((subjectTag: string) =>
            subjectTag.includes(`-${courseTag}`),
          ) || [];

        if (courseSubjects.length === 0) return null;

        const subjectsWithPeriods = courseSubjects.map((subjectTag) => {
          const subjectPeriods =
            tags.period?.values
              ?.filter((periodTag: string) =>
                periodTag.startsWith(`${subjectTag}-`),
              )
              .sort((a, b) => {
                const periodA = a.split("-").pop() || "";
                const periodB = b.split("-").pop() || "";
                return periodB.localeCompare(periodA);
              }) || [];

          return {
            subjectTag,
            subjectName: getSubject(subjectTag)?.name || subjectTag,
            subjectPeriods,
          };
        });

        return {
          courseTag,
          courseDisplayName,
          subjectsWithPeriods,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [
    type,
    tags.course?.values,
    tags.subject?.values,
    tags.period?.values,
    getCourseByAbbreviation,
    getSubject,
  ]);

  // Dados estruturados de Pessoas
  const peopleGroupedByLevel = useMemo(() => {
    if (type !== "people" || !tags.period?.values) return [];
    const grouped = Object.entries(getPeriodCourses(tags.period.values)).reduce(
      (
        acc: Record<string, Array<[string, string[]]>>,
        [course, periods]: [string, string[]],
      ) => {
        const courseData = getCourseByAbbreviation(course);
        const level = courseData?.level.split(" ")[0] || "Outros";
        if (!acc[level]) acc[level] = [];
        acc[level].push([course, periods]);
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
      .map(([level, coursesInLevel]) => {
        const sortedCourses = [...coursesInLevel].sort(([a], [b]) =>
          (getCourseByAbbreviation(a)?.name ?? a).localeCompare(
            getCourseByAbbreviation(b)?.name ?? b,
          ),
        );
        return [level, sortedCourses] as [string, Array<[string, string[]]>];
      });
  }, [type, tags.period?.values, getCourseByAbbreviation]);

  const availableCampuses = useMemo(
    () =>
      type === "people"
        ? Object.keys(campi)
            .filter((campusKey) => {
              const campusCode = campusKey.replace("ifpb-", "");
              return peopleTags.some((tag) => tag.includes(campusCode));
            })
            .sort()
            .map((campusKey) => {
              const campusCode = campusKey.replace("ifpb-", "");
              return {
                key: campusKey,
                code: campusCode,
                name: campi[campusKey as keyof typeof campi],
              };
            })
        : [],
    [type, peopleTags],
  );

  const createPeopleCourseBadges = useCallback(
    (course: string, periods: string[]): BadgeItem[] => {
      const badges: BadgeItem[] = [
        { url: `/projects/people/${course}/1`, value: "Todos" },
      ];

      if (peopleTags.includes(`egresso-${course}`)) {
        badges.push({
          url: `/projects/people/egresso-${course}/1`,
          value: "Egressos",
        });
      }

      periods.forEach((period) => {
        badges.push({
          url: `/projects/people/${course}-${period}/1`,
          value: period,
        });
      });

      return badges;
    },
    [peopleTags],
  );

  // Busca plana em tempo real com suporte a múltiplos termos (ex: "tsi 2024.1")
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const tokens = normalize(searchQuery).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return null;

    const matchTokens = (...texts: (string | undefined | null)[]) => {
      const combined = normalize(texts.filter(Boolean).join(" "));
      return tokens.every((token) => combined.includes(token));
    };

    const results: BadgeItem[] = [];

    if (type === "codes") {
      // Tipos
      CODES_TYPES_BADGES.forEach((b) => {
        if (matchTokens(b.value, b.url, "tipo")) {
          results.push({ ...b, category: "Tipo" });
        }
      });
      // Recursos
      CODES_RESOURCES_BADGES.forEach((b) => {
        if (matchTokens(b.value, b.url, "recurso")) {
          results.push({ ...b, category: "Recurso" });
        }
      });
      // Cursos
      (tags.course?.values || []).forEach((courseTag) => {
        const courseData = getCourse(courseTag);
        const name = courseData?.name || courseTag;
        if (matchTokens(name, courseTag, courseData?.level, "curso")) {
          results.push({
            url: `/projects/codes/${courseTag}/1`,
            value: name,
            category: "Curso",
          });
        }
      });
      // Disciplinas & Períodos de Disciplinas
      codesSubjectsByCourse.forEach((c) => {
        c.subjectsWithPeriods.forEach((s) => {
          if (
            matchTokens(
              s.subjectName,
              s.subjectTag,
              c.courseDisplayName,
              "disciplina",
            )
          ) {
            results.push({
              url: `/projects/codes/${s.subjectTag}/1`,
              value: `${s.subjectName} (${c.courseDisplayName.split(" | ")[0]})`,
              category: "Disciplina",
            });
          }

          s.subjectPeriods.forEach((periodTag) => {
            const period = periodTag.split("-").pop() || "";
            if (
              matchTokens(
                s.subjectName,
                periodTag,
                period,
                c.courseDisplayName,
                "disciplina",
                "turma",
              )
            ) {
              results.push({
                url: `/projects/codes/${periodTag}/1`,
                value: `${s.subjectName} - ${period} (${c.courseDisplayName.split(" | ")[0]})`,
                category: "Turma",
              });
            }
          });
        });
      });
      // Tags
      projectTags.forEach((tag) => {
        if (matchTokens(tag, "tag")) {
          results.push({
            url: `/projects/codes/${encodeURIComponent(tag)}/1`,
            value: tag,
            category: "Tag",
          });
        }
      });
    } else {
      // Perfis
      PEOPLE_PROFILES_BADGES.forEach((b) => {
        if (matchTokens(b.value, b.url, "perfil")) {
          results.push({ ...b, category: "Perfil" });
        }
      });
      // Campi
      availableCampuses.forEach((c) => {
        if (matchTokens(c.name, c.code, "campus")) {
          results.push({
            url: `/projects/people/${c.code}/1`,
            value: `Campus ${c.name}`,
            category: "Campus",
          });
        }
      });
      // Cursos & Turmas
      peopleGroupedByLevel.forEach(([level, coursesInLevel]) => {
        coursesInLevel.forEach(([course, periods]) => {
          const courseData = getCourseByAbbreviation(course);
          const courseName = courseData?.name || course;

          if (matchTokens(courseName, course, level, "curso")) {
            results.push({
              url: `/projects/people/${course}/1`,
              value: `${courseName} (${level})`,
              category: "Curso",
            });
          }

          if (
            peopleTags.includes(`egresso-${course}`) &&
            matchTokens("egresso", "egressos", courseName, course, level)
          ) {
            results.push({
              url: `/projects/people/egresso-${course}/1`,
              value: `Egressos - ${courseName}`,
              category: "Egressos",
            });
          }

          periods.forEach((p) => {
            if (
              matchTokens(
                courseName,
                course,
                `turma ${p}`,
                p,
                `${course}-${p}`,
                level,
                "turma",
              )
            ) {
              results.push({
                url: `/projects/people/${course}-${p}/1`,
                value: `${course.toUpperCase()} - Turma ${p}`,
                category: "Turma",
              });
            }
          });
        });
      });
      // Recursos
      PEOPLE_RESOURCES_BADGES.forEach((b) => {
        if (matchTokens(b.value, b.url, "recurso")) {
          results.push({ ...b, category: "Recurso" });
        }
      });
    }

    // Remover duplicatas de URL
    const uniqueMap = new Map<string, BadgeItem>();
    results.forEach((item) => {
      if (!uniqueMap.has(item.url)) {
        uniqueMap.set(item.url, item);
      }
    });
    return Array.from(uniqueMap.values()).slice(0, 40);
  }, [
    searchQuery,
    type,
    tags.course?.values,
    codesSubjectsByCourse,
    projectTags,
    peopleTags,
    availableCampuses,
    peopleGroupedByLevel,
    getCourse,
    getCourseByAbbreviation,
  ]);

  const categories = type === "codes" ? CODES_CATEGORIES : PEOPLE_CATEGORIES;
  const resetUrl =
    type === "codes" ? "/projects/codes/page/1" : "/projects/people/page/1";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-gray-950/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 z-50 flex h-full w-[min(94vw,30rem)] flex-col border-l border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        {/* Header fixo */}
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-700">
                <Icon icon="ph:list-dashes-bold" width="18" />
              </div>
              <div>
                <h2
                  id="filter-title"
                  className="text-lg font-black text-gray-950 sm:text-xl"
                >
                  Índice & Filtros
                </h2>
                <p className="text-xs font-semibold text-gray-500">
                  {type === "codes"
                    ? "Explorar Projetos"
                    : "Explorar Comunidade"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Fechar painel de filtros"
            >
              <Icon icon="ph:x-bold" width="18" />
            </button>
          </div>

          {/* Parágrafo explicativo */}
          <p className="mt-2.5 text-xs leading-relaxed text-gray-500">
            Navegue pelo índice de categorias, cursos, disciplinas e tags para
            abrir diretamente a página correspondente.
          </p>

          {/* Campo de busca instantânea */}
          <div className="relative mt-3.5">
            <Icon
              icon="ph:magnifying-glass-bold"
              width="16"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar curso, disciplina, perfil ou tag..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-8 pl-9 text-xs font-semibold text-gray-900 placeholder-gray-400 transition-colors focus:border-green-700 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <Icon icon="ph:x-circle-fill" width="16" />
              </button>
            )}
          </div>

          {/* Abas de categoria */}
          {!searchQuery && (
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`shrink-0 rounded-full px-3 py-1 transition-all ${
                    activeTab === cat.id
                      ? "bg-green-700 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* Visualização de resultados da busca */}
          {searchResults ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
                  Resultados encontrados ({searchResults.length})
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-green-800 hover:underline"
                >
                  Limpar busca
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {searchResults.map((item) => (
                    <div
                      key={item.url}
                      className="flex flex-col items-start gap-1"
                    >
                      {item.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {item.category}
                        </span>
                      )}
                      <Badge url={item.url} value={item.value} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-gray-500">
                  <Icon
                    icon="ph:magnifying-glass-bold"
                    width="28"
                    className="mx-auto mb-2 text-gray-300"
                  />
                  Nenhum resultado para "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ÍNDICE DE PROJETOS (CODES) */}
              {type === "codes" && (
                <div className="space-y-4">
                  {/* Tipos */}
                  {(activeTab === "all" || activeTab === "types") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Tipo de Projeto
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {CODES_TYPES_BADGES.map((badge) => (
                          <Badge
                            key={badge.url}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cursos */}
                  {(activeTab === "all" || activeTab === "courses") && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Cursos
                      </h3>
                      {codesGroupedByLevel.map(([level, coursesInLevel]) => {
                        const accordionId = `codes-lvl-${level}`;
                        const isOpen = openAccordion === accordionId;
                        return (
                          <Accordion
                            key={level}
                            id={accordionId}
                            title={`${level} (${coursesInLevel.length})`}
                            isOpen={isOpen}
                            onToggle={toggleAccordion}
                          >
                            <div className="flex flex-wrap gap-1.5">
                              {coursesInLevel.map((courseTag) => {
                                const courseData = getCourse(courseTag);
                                const parts = courseTag.split("-");
                                const campus =
                                  parts.length > 1
                                    ? parts[parts.length - 1]
                                    : "";
                                const displayName = `${courseData?.name ?? courseTag}${campus ? ` (${campus.toUpperCase()})` : ""}`;
                                const url = `/projects/codes/${courseTag}/1`;

                                return (
                                  <Badge
                                    key={courseTag}
                                    url={url}
                                    value={displayName}
                                  />
                                );
                              })}
                            </div>
                          </Accordion>
                        );
                      })}
                    </div>
                  )}

                  {/* Disciplinas */}
                  {(activeTab === "all" || activeTab === "subjects") && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Disciplinas & Turmas
                      </h3>
                      {codesSubjectsByCourse.map((courseData) => {
                        const {
                          courseTag,
                          courseDisplayName,
                          subjectsWithPeriods,
                        } = courseData;
                        const accordionId = `codes-course-subj-${courseTag}`;
                        const isOpen = openAccordion === accordionId;

                        return (
                          <Accordion
                            key={courseTag}
                            id={accordionId}
                            title={`${courseDisplayName} (${subjectsWithPeriods.length})`}
                            isOpen={isOpen}
                            onToggle={toggleAccordion}
                          >
                            <div className="space-y-3">
                              {subjectsWithPeriods.map(
                                ({
                                  subjectTag,
                                  subjectName,
                                  subjectPeriods,
                                }) => {
                                  const allUrl = `/projects/codes/${subjectTag}/1`;
                                  return (
                                    <div
                                      key={subjectTag}
                                      className="rounded-lg border border-gray-100 bg-gray-50 p-2.5"
                                    >
                                      <p className="mb-2 text-xs font-bold text-gray-800">
                                        {subjectName}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        <Badge url={allUrl} value="Todos" />
                                        {subjectPeriods.map((periodTag) => {
                                          const period =
                                            periodTag.split("-").pop() || "";
                                          const periodUrl = `/projects/codes/${periodTag}/1`;
                                          return (
                                            <Badge
                                              key={periodTag}
                                              url={periodUrl}
                                              value={period}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </Accordion>
                        );
                      })}
                    </div>
                  )}

                  {/* Recursos */}
                  {(activeTab === "all" || activeTab === "resources") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Recursos & Links
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {CODES_RESOURCES_BADGES.map((badge) => (
                          <Badge
                            key={badge.url}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags Livres */}
                  {(activeTab === "all" || activeTab === "tags") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Tags ({projectTags.length})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {projectTags.map((tag) => {
                          const url = `/projects/codes/${encodeURIComponent(tag)}/1`;
                          return (
                            <Badge key={tag} url={url} value={tag} />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ÍNDICE DE COMUNIDADE (PEOPLE) */}
              {type === "people" && (
                <div className="space-y-4">
                  {/* Perfis */}
                  {(activeTab === "all" || activeTab === "profiles") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Tipos de Perfil
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {PEOPLE_PROFILES_BADGES.map((badge) => (
                          <Badge
                            key={badge.url}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cursos & Turmas */}
                  {(activeTab === "all" || activeTab === "courses") && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Cursos & Turmas
                      </h3>
                      {peopleGroupedByLevel.map(([level, coursesInLevel]) => (
                        <div key={level} className="space-y-2">
                          <p className="text-xs font-bold text-gray-500 uppercase">
                            {level}
                          </p>
                          {coursesInLevel.map(([course, periods]) => {
                            const courseData =
                              getCourseByAbbreviation(course);
                            const courseTitle = courseData?.name ?? course;
                            const accordionId = `people-course-${course}`;
                            const isOpen = openAccordion === accordionId;
                            const badges = createPeopleCourseBadges(
                              course,
                              periods,
                            );

                            return (
                              <Accordion
                                key={course}
                                id={accordionId}
                                title={courseTitle}
                                isOpen={isOpen}
                                onToggle={toggleAccordion}
                              >
                                <div className="flex flex-wrap gap-1.5">
                                  {badges.map((badge) => (
                                    <Badge
                                      key={badge.url}
                                      url={badge.url}
                                      value={badge.value}
                                    />
                                  ))}
                                </div>
                              </Accordion>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Campi */}
                  {(activeTab === "all" || activeTab === "campuses") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Campi & Cidades
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {availableCampuses.map((campus) => {
                          const url = `/projects/people/${campus.code}/1`;
                          return (
                            <Badge
                              key={campus.key}
                              url={url}
                              value={campus.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recursos */}
                  {(activeTab === "all" || activeTab === "resources") && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                      <h3 className="mb-2.5 text-xs font-extrabold tracking-wider text-green-800 uppercase">
                        Recursos da Comunidade
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {PEOPLE_RESOURCES_BADGES.map((badge) => (
                          <Badge
                            key={badge.url}
                            url={badge.url}
                            value={badge.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
          <a
            href={resetUrl}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-600 hover:text-green-800 transition-colors"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" width="15" />
            Ver listagem completa
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-green-800 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
}
