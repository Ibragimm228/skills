import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { Skill } from '../lib/types';
import { SkillCard } from './SkillCard';
import { SkillModal } from './SkillModal';
import { getAllCategories } from '../data';

interface SkillsBrowserProps {
  skills: Skill[];
}

const CATEGORIES = ['Все', ...getAllCategories()];

export function SkillsBrowser({ skills }: SkillsBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory = selectedCategory === 'Все' || skill.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    skills.forEach(skill => {
      stats[skill.category] = (stats[skill.category] || 0) + 1;
    });
    return stats;
  }, [skills]);

  return (
    <div id="skills" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Каталог навыков
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Исследуйте нашу коллекцию навыков, которые можно освоить за 24 часа или меньше
          </p>
        </div>
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Поиск навыков..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
                {category !== 'Все' && categoryStats[category] && (
                  <span className={`ml-1 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                    selectedCategory === category 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {categoryStats[category]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6 sm:mb-8 text-center">
          <div className="text-gray-600 text-sm sm:text-base">
            Показано <span className="font-semibold text-gray-900">{filteredSkills.length}</span> навык{filteredSkills.length === 1 ? '' : filteredSkills.length < 5 ? 'а' : 'ов'}
            {selectedCategory !== 'Все' && (
              <span> в категории <span className="font-semibold">{selectedCategory}</span></span>
            )}
          </div>
        </div>
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredSkills.map((skill, index) => (
              <div 
                key={skill.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SkillCard
                  skill={skill}
                  onClick={() => setSelectedSkill(skill)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <div className="max-w-md mx-auto px-4">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Навыки не найдены</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Попробуйте изменить поисковые термины или выбрать другую категорию
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Все');
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}
        <div className="mt-12 sm:mt-20 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Готовы начать обучение?</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Каждый навык разработан для освоения за 24 часа или меньше. Выберите один и начните свое путешествие сегодня.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 sm:px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Рассчитать время
              </button>
              <button 
                onClick={() => setSelectedCategory('Техническое')}
                className="px-4 sm:px-6 py-3 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Изучить технические навыки
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedSkill && (
        <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  );
}
