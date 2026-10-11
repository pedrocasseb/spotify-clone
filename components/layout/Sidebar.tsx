'use client';

import { cn } from "@/lib/utils";
import { ArrowRight, Home, Library, LogOut, LucideIcon, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { IconButton } from "../ui/IconButton";
import { Tooltip } from "../ui/Tooltip";
import { ui } from "@/lib/styles";
import { useLibraryStore } from "@/store/libraryStore";
import { useIsTablet } from "@/lib/hooks/useMediaQuery";
import { LibraryFilterBar } from "../library/LibraryFilterBar";

interface SidebarProps {
  forceCollapsedOn?: 'md';
  alwaysExpanded?: boolean;
  onNavigate?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const paths: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
  },
];

export function Sidebar({
  forceCollapsedOn,
  alwaysExpanded,
  onNavigate
}: SidebarProps = {}) {
  const router = useRouter();
  const isTablet = useIsTablet();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const storedCollapsed = useLibraryStore((s) => s.sidebarCollapsed);
  const setCollapsed = useLibraryStore((s) => s.setSidebarCollapsed);
  const filter = useLibraryStore((s) => s.filter);
  const setFilter = useLibraryStore((s) => s.setFilter);
  const rows = useLibraryStore((s) => s.rows);

  const forcedCollapsed = !alwaysExpanded && forceCollapsedOn === 'md' && isTablet;
  const collapsed = alwaysExpanded ? false : forcedCollapsed || storedCollapsed;
  const canToggleCollapse = !alwaysExpanded && !forcedCollapsed;
  
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const filteredRows = rows.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'playlists') return r.kind === 'playlist' || r.kind === 'liked';
    if (filter === 'albums') return r.kind === 'album';
    if (filter === 'artists') return r.kind === 'artist';
    return true;
  })

  return (
    <aside className={cn('flex h-full min-h-0 flex-col gap-2 transition-[width] duration-300', collapsed ? 'w-18' : 'w-full sm:w-85')}>
      <nav className="rounded-lg bg-bg-elevated-base p-2">
        <ul className="flex flex-col gap-1">
          {paths.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <li key={href}>
                <Link
                  href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={cn( 'flex items-center gap-4 rounded-md px-3 py-2 text-sm font-bold transition', active ? 'text-text-base' : 'text-text-subdued hover:text-text-base', collapsed && 'justify-center px-0')}>
                  <Icon size={24} aria-hidden="true" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="flex min-h-0 flex-1 flex-col ">
        <header className={cn('flex items-center justify-between px-4 pb-2 pt-2', collapsed && 'px-3')}>
          <button type="button"
            onClick={() => canToggleCollapse && setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand Your Library' : 'Collapse Your Library'}
            className={cn('flex items-center gap-3 text-sm font-bold text-text-subdued', canToggleCollapse && 'hover:text-text-base', !canToggleCollapse && 'cursor-default')}
          >
            <Library size={24} />
          </button>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <IconButton label="Create Playlist" size="md" disabled={pending}>
                <Plus size={18} />
              </IconButton>
              {canToggleCollapse && (
                <IconButton label="Show More" size="md" onClick={() => setCollapsed(true)}>
                <ArrowRight size={18} />
                </IconButton>
              )}
            </div>
          )}
        </header>
        {!collapsed && (
          <LibraryFilterBar filter={filter} onFilterChange={setFilter} className="overflow-x-auto no-scollbar px-4 pb-3"/>
        )}
      </div>
    </aside>
  )
}
