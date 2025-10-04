import { X, Clock, Target, Package, CheckCircle, Star, ChevronDown, Search, Youtube, Globe, Shield } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Skill } from '../lib/types';
import { useEffect, useState } from 'react';

interface SkillModalProps {
  skill: Skill;
  onClose: () => void;
}

export function SkillModal({ skill, onClose }: SkillModalProps) {
  const IconComponent = (Icons as any)[skill.icon] || Icons.BookOpen;
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showSearchOptions) {
        setShowSearchOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSearchOptions]);

  const difficultyColors = {
    'Начинающий': 'bg-green-100 text-green-700 border-green-200',
    'Средний': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Продвинутый': 'bg-red-100 text-red-700 border-red-200',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const searchEngines = [
    {
      name: 'Google',
      url: (query: string) => `https://www.google.com/search?q=${query}`,
      icon: Search,
      color: 'text-blue-600'
    },
    {
      name: 'YouTube',
      url: (query: string) => `https://www.youtube.com/results?search_query=${query}`,
      icon: Youtube,
      color: 'text-red-600'
    },
    {
      name: 'DuckDuckGo',
      url: (query: string) => `https://duckduckgo.com/?q=${query}`,
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      name: 'Яндекс',
      url: (query: string) => `https://yandex.ru/search/?text=${query}`,
      icon: Globe,
      color: 'text-yellow-600'
    }
  ];

  const handleStartLearning = (searchEngine = searchEngines[0]) => {
    const searchQuery = encodeURIComponent(`${skill.name} обучение курс как научиться`);
    const searchUrl = searchEngine.url(searchQuery);
    
    window.open(searchUrl, '_blank');
    setShowSearchOptions(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        
        <div className="max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          
          <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6 lg:p-8">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {skill.name}
                  </h1>
                  <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${difficultyColors[skill.difficulty_level]} self-start`}>
                    {skill.difficulty_level}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{skill.hours_required} часов</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-sm sm:text-base">{skill.category}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {skill.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            {skill.learning_outcomes.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Что вы изучите</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {skill.learning_outcomes.map((outcome, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover-lift"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">{outcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skill.resources_needed.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Что вам понадобится</h2>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {skill.resources_needed.map((resource, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 border border-gray-200 px-3 py-2 sm:px-4 sm:py-2 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium text-sm sm:text-base">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Готовы начать?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Освойте этот навык всего за <span className="font-semibold">{skill.hours_required} часов</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <button 
                    onClick={() => handleStartLearning()}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Начать обучение</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSearchOptions(!showSearchOptions);
                    }}
                    className="absolute right-0 top-0 h-full px-2 sm:px-3 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 transition-colors flex items-center border-l border-gray-700"
                  >
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showSearchOptions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSearchOptions && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 animate-fade-in"
                    >
                      {searchEngines.map((engine, index) => {
                        const IconComponent = engine.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleStartLearning(engine)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3 first:rounded-t-md last:rounded-b-md transition-colors"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${engine.color}`} />
                            </div>
                            <span className="text-gray-700 font-medium text-sm sm:text-base">Искать в {engine.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={onClose}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-gray-700 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Просмотреть другие навыки
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
