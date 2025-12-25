import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-surface-main/70 md:text-sm"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brand-light"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-surface-main/80">
                  {item.label}
                </span>
              )}
              {!isLast && <span className="mx-1 text-surface-main/50">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

