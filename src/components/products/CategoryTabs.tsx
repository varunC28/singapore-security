import { motion } from 'framer-motion';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex flex-row gap-2 min-w-max pb-2">
        <button
          onClick={() => onSelect(null)}
          className={`relative px-4 py-2 min-h-[44px] rounded-full snap-start transition-colors duration-200 z-10 ${
            activeCategory === null ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {activeCategory === null && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-dark rounded-full -z-10 border-b-2 border-accent"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-20">All</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`relative px-4 py-2 min-h-[44px] rounded-full snap-start transition-colors duration-200 z-10 ${
              activeCategory === category.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-dark rounded-full -z-10 border-b-2 border-blue-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20">{category.name}</span>
          </button>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
}
