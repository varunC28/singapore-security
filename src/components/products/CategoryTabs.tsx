import CustomSelect from '@/components/ui/CustomSelect';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  const options = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="w-full sm:max-w-xs mb-2">
      <CustomSelect 
        value={activeCategory || 'all'}
        onChange={(val) => onSelect(val === 'all' ? null : val)}
        options={options}
      />
    </div>
  );
}
