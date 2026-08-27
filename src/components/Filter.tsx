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
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute right-0 mr-[10%] md:mr-32 lg:mr-32 xl:mr-0 text-4xl cursor-pointer mt-0.5"
        onClick={toggleShow}
        onMouseEnter={preloadDrawer}
        onTouchStart={preloadDrawer}
      >
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
      </svg>

      {isShow && (
        <Suspense fallback={null}>
          <FilterDrawer {...props} onClose={handleClose} />
        </Suspense>
      )}
    </div>
  );
});

export default Filter;
