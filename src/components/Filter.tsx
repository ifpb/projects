import React, { useState, useCallback, Suspense } from "react";
import { Icon } from "@iconify/react";
import type { CourseInfo, SubjectInfo } from "@/lib/taxonomy";

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
const FilterDrawer = React.lazy(() => import("./FilterDrawer"));

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
    import("./FilterDrawer");
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleShow}
        onMouseEnter={preloadDrawer}
        onTouchStart={preloadDrawer}
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 transition-colors hover:border-green-700 hover:text-green-800"
        aria-label="Abrir menu de filtros"
        aria-expanded={isShow}
      >
        <Icon icon="ph:funnel-bold" width="18" />
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
