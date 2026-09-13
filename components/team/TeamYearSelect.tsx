import { ChevronDown } from "./ChevronDown";

/**
 * Academic-year picker for the team page.
 *
 * Deliberately built from <details> and plain links, with no client JavaScript:
 * picking a year is an ordinary browser navigation to /team?year=…, so the
 * dropdown cannot end up out of step with the team shown below it. Earlier
 * versions used a <select> driven by an onChange handler, which silently did
 * nothing whenever the page's JavaScript failed to hydrate.
 */
export function TeamYearSelect({
  years,
  selected,
}: {
  years: string[];
  selected: string;
}) {
  if (years.length === 0) return null;

  return (
    <details className="group relative text-sm">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 text-ieee-gray [&::-webkit-details-marker]:hidden"
        aria-label="Select academic year"
      >
        <span className="font-medium">Academic Year</span>
        <span className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 font-semibold text-ieee-navy shadow-sm transition group-open:border-ieee-red hover:border-ieee-red">
          {selected}
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <ul className="absolute right-0 z-20 mt-1 min-w-[8rem] overflow-hidden rounded border border-gray-300 bg-white py-1 shadow-lg">
        {years.map((y) => {
          const isSelected = y === selected;
          return (
            <li key={y}>
              <a
                href={`/team?year=${encodeURIComponent(y)}`}
                aria-current={isSelected ? "true" : undefined}
                className={
                  isSelected
                    ? "block px-4 py-2 font-semibold text-ieee-red"
                    : "block px-4 py-2 text-ieee-navy hover:bg-gray-50 hover:text-ieee-red"
                }
              >
                {y}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
