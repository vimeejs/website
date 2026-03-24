import type { CollectionEntry } from "astro:content";
import { getLocaleFromId, stripLocalePrefix, type Locale } from "./i18n";

export interface SidebarItem {
  label: string;
  href: string;
  order: number;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

const groupLabels: Record<string, Record<Locale, string>> = {
  "getting-started": { en: "Getting Started", ja: "はじめに" },
  packages: { en: "Packages", ja: "パッケージ" },
  guides: { en: "Guides", ja: "ガイド" },
};

const groupOrder = ["getting-started", "packages", "guides"];

/** Build sidebar structure from collection entries for a given locale */
export function buildSidebar(
  entries: CollectionEntry<"docs">[],
  locale: Locale,
): SidebarGroup[] {
  const localeEntries = entries.filter(
    (e) => getLocaleFromId(e.id) === locale,
  );

  const groups = new Map<string, SidebarItem[]>();

  for (const entry of localeEntries) {
    const slug = stripLocalePrefix(entry.id);
    const parts = slug.split("/");
    if (parts.length < 2) continue;

    const groupKey = parts[0];
    if (!groups.has(groupKey)) groups.set(groupKey, []);

    const label = entry.data.sidebar?.label ?? entry.data.title;
    const order = entry.data.sidebar?.order ?? 999;
    const href = `/${locale}/${slug}/`;

    groups.get(groupKey)!.push({ label, href, order });
  }

  for (const items of groups.values()) {
    items.sort((a, b) => a.order - b.order);
  }

  return groupOrder
    .filter((key) => groups.has(key))
    .map((key) => ({
      label: groupLabels[key]?.[locale] ?? key,
      items: groups.get(key)!,
    }));
}

/** Get flat ordered list of doc entries for pagination */
export function getFlatDocOrder(
  entries: CollectionEntry<"docs">[],
  locale: Locale,
): { slug: string; title: string; href: string }[] {
  const sidebar = buildSidebar(entries, locale);
  return sidebar.flatMap((group) =>
    group.items.map((item) => ({
      slug: item.href,
      title: item.label,
      href: item.href,
    })),
  );
}
