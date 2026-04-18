import { DesignOptions } from './types';

export interface TemplateBlueprint extends DesignOptions {
    id: string;
    name: string;
    layout: string;
}

export const PALETTES = [
  { name: 'Standard', primaryColor: '#2563eb', secondaryColor: '#dbeafe', bgColor: '#ffffff', textColor: '#0f172a', fontText: '"Helvetica Neue", Arial, sans-serif', fontNum: '"Helvetica Neue", Arial, sans-serif' },
  { name: 'Midnight', primaryColor: '#14b8a6', secondaryColor: '#115e59', bgColor: '#0f172a', textColor: '#f8fafc', fontText: 'Inter, sans-serif', fontNum: '"Courier New", monospace' },
  { name: 'Crimson', primaryColor: '#dc2626', secondaryColor: '#fecaca', bgColor: '#fafafa', textColor: '#171717', fontText: 'Georgia, serif', fontNum: 'Georgia, serif' },
  { name: 'Forest', primaryColor: '#16a34a', secondaryColor: '#bbf7d0', bgColor: '#f0fdf4', textColor: '#14532d', fontText: 'Arial, sans-serif', fontNum: '"Courier New", monospace' },
  { name: 'Sunset', primaryColor: '#ea580c', secondaryColor: '#fed7aa', bgColor: '#fffbeb', textColor: '#431407', fontText: 'Inter, sans-serif', fontNum: 'Inter, sans-serif' },
  { name: 'Lavender', primaryColor: '#7c3aed', secondaryColor: '#ddd6fe', bgColor: '#ffffff', textColor: '#2e1065', fontText: '"Helvetica Neue", Arial, sans-serif', fontNum: '"Courier New", monospace' },
  { name: 'Coffee', primaryColor: '#78350f', secondaryColor: '#f3c6aa', bgColor: '#fef3c7', textColor: '#451a03', fontText: 'Georgia, serif', fontNum: '"Courier New", monospace' },
  { name: 'Neon', primaryColor: '#ec4899', secondaryColor: '#fbcfe8', bgColor: '#000000', textColor: '#a1a1aa', fontText: '"Courier New", monospace', fontNum: '"Courier New", monospace' },
  { name: 'Slate', primaryColor: '#475569', secondaryColor: '#cbd5e1', bgColor: '#e2e8f0', textColor: '#0f172a', fontText: 'Inter, sans-serif', fontNum: '"Helvetica Neue", Arial, sans-serif' },
  { name: 'Ocean', primaryColor: '#0369a1', secondaryColor: '#bae6fd', bgColor: '#f0f9ff', textColor: '#0c4a6e', fontText: 'Arial, sans-serif', fontNum: 'Inter, sans-serif' },
];

export const LAYOUTS = ['modern', 'bold', 'minimal', 'executive', 'classic', 'contemporary', 'elegant', 'tech', 'retro', 'receipt'] as const;

export const TEMPLATES: TemplateBlueprint[] = LAYOUTS.flatMap(layout => 
  PALETTES.map((pal, idx) => ({
     id: `${layout}-${idx}`,
     name: `${layout.charAt(0).toUpperCase() + layout.slice(1)} - ${pal.name}`,
     layout,
     ...pal
  }))
);
