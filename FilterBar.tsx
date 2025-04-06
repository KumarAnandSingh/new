import { FC, useState } from 'react';

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  title,
  options,
  selectedOption,
  onChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedOption === option
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

interface FilterBarProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  additionalFilters?: {
    title: string;
    options: string[];
    selectedOption: string;
    onChange: (option: string) => void;
  }[];
  sortOptions?: string[];
  onSortChange?: (option: string) => void;
  selectedSortOption?: string;
}

const FilterBar: FC<FilterBarProps> = ({
  categories,
  onCategoryChange,
  selectedCategory,
  additionalFilters,
  sortOptions,
  onSortChange,
  selectedSortOption
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        
        {sortOptions && onSortChange && selectedSortOption && (
          <div className="mt-4 md:mt-0">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedSortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <button
          className="md:hidden mt-4 md:mt-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        <FilterSection
          title="Categories"
          options={categories}
          selectedOption={selectedCategory}
          onChange={onCategoryChange}
        />
        
        {additionalFilters?.map((filter, index) => (
          <FilterSection
            key={index}
            title={filter.title}
            options={filter.options}
            selectedOption={filter.selectedOption}
            onChange={filter.onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
