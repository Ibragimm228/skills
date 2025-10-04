import { Clock, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Skill } from '../lib/types';

interface SkillCardProps {
  skill: Skill;
  onClick: () => void;
}

export function SkillCard({ skill, onClick }: SkillCardProps) {
  const IconComponent = (Icons as any)[skill.icon] || Icons.BookOpen;

  const difficultyColors = {
    'Начинающий': 'bg-green-100 text-green-700 border-green-200',
    'Средний': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Продвинутый': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 cursor-pointer hover-lift transition-all duration-200 hover:border-gray-300 animate-fade-in h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[skill.difficulty_level]}`}>
          {skill.difficulty_level}
        </div>
      </div>
      <div className="mb-3 sm:mb-4 flex-1">
        <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
          {skill.category}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
          {skill.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {skill.description}
        </p>
      </div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="font-medium text-gray-900 text-sm sm:text-base">{skill.hours_required} часов</span>
      </div>
      {skill.learning_outcomes.length > 0 && (
        <div className="mb-4 sm:mb-6 space-y-2 flex-1">
          <div className="text-xs sm:text-sm font-medium text-gray-700">
            Что вы изучите:
          </div>
          <div className="space-y-1">
            {skill.learning_outcomes.slice(0, 2).map((outcome, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span className="line-clamp-1">{outcome}</span>
              </div>
            ))}
            {skill.learning_outcomes.length > 2 && (
              <div className="text-xs text-gray-500 mt-1">
                +{skill.learning_outcomes.length - 2} ещё результатов
              </div>
            )}
          </div>
        </div>
      )}
      <button className="w-full group flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base mt-auto">
        <span>Подробнее</span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
