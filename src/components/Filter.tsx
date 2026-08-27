import React, { useState, useCallback, Suspense } from 'react';
import type { CourseInfo, SubjectInfo } from '@/lib/taxonomy';

interface TagGroup {
  name: string;
  values: string[];
}

interface FilterProps {
  type: string;
  tags: { course: TagGroup; period: TagGroup; subject?: TagGroup };
  peopleTags?: string[];
  projectTags?: string[];
  courses: CourseInfo[];
  subjects: SubjectInfo[];
}

// Carregamento preguiçoso do painel do filtro para minimizar o bundle JS inicial
const FilterDrawer = React.lazy(() => import('./FilterDrawer'));

const Filter = React.memo(function Filter(props: FilterProps) {
  const [isShow, setIsShow] = useState(false);

  const toggleShow = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsShow(false);
  }, []);

  // Preload do chunk JS quando o usuário passa o mouse ou toca no botão
  const preloadDrawer = useCallback(() => {
    import('./FilterDrawer');
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleShow}
        onMouseEnter={preloadDrawer}
        onTouchStart={preloadDrawer}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-700 font-semibold text-sm border border-gray-300 shadow-xs hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 focus:outline-hidden focus:ring-2 focus:ring-gray-400 transition-all cursor-pointer"
        aria-label="Abrir menu de filtros"
        aria-expanded={isShow}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.1em"
          height="1.1em"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-600"
        >
          <path d="M4.25 5.61C3.27 4.35 4.17 2.5 5.76 2.5h12.48c1.59 0 2.49 1.85 1.51 3.11l-5.75 7.39v5.75c0 .41-.17.82-.47 1.12l-2 2c-.63.63-1.71.18-1.71-.71v-8.16L4.25 5.61z" />
        </svg>
        <span>Filtros</span>
      </button>

      {isShow && (
        <Suspense fallback={null}>
          <FilterDrawer {...props} onClose={handleClose} />
        </Suspense>
      )}
    </div>
  );
});

export default Filter;
