import { useState, useEffect } from 'react';
import { Clock, AlertCircle, Plus, Minus, Smartphone, Camera, Monitor, Film, Gamepad2, MoreHorizontal } from 'lucide-react';
import type { Skill } from '../lib/types';

interface TimeCalculatorProps {
  skills: Skill[];
}

interface ActivityInput {
  name: string;
  hours: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const PRESET_ACTIVITIES = [
  { name: 'TikTok', hours: 0, icon: Smartphone, color: 'from-pink-500 to-red-500' },
  { name: 'Instagram', hours: 0, icon: Camera, color: 'from-purple-500 to-pink-500' },
  { name: 'YouTube', hours: 0, icon: Monitor, color: 'from-red-500 to-orange-500' },
  { name: 'Netflix', hours: 0, icon: Film, color: 'from-gray-700 to-gray-900' },
  { name: 'Игры', hours: 0, icon: Gamepad2, color: 'from-green-500 to-blue-500' },
  { name: 'Другое', hours: 0, icon: MoreHorizontal, color: 'from-blue-500 to-purple-500' },
];

export function TimeCalculator({ skills }: TimeCalculatorProps) {
  const [activities, setActivities] = useState<ActivityInput[]>(PRESET_ACTIVITIES);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [totalHours, setTotalHours] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState<Skill[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);


  useEffect(() => {
    const total = activities.reduce((sum, activity) => sum + activity.hours, 0);
    setTotalHours(total);

    const getSmartSkillRecommendations = (availableHours: number, allSkills: Skill[]): Skill[] => {
      if (availableHours === 0) return [];

      const languageSkills = allSkills.filter(skill => skill.category === 'Языки');
      const nonLanguageSkills = allSkills.filter(skill => skill.category !== 'Языки');
      const availableLanguagesCount = Math.floor(availableHours / 300);
      const selectedLanguages = languageSkills.slice(0, availableLanguagesCount);

      const quickWins = nonLanguageSkills.filter(skill => skill.hours_required <= availableHours * 0.3);
      const achievable = nonLanguageSkills.filter(skill => 
        skill.hours_required > availableHours * 0.3 && skill.hours_required <= availableHours
      );
      const stretch = nonLanguageSkills.filter(skill => 
        skill.hours_required > availableHours && skill.hours_required <= availableHours * 1.5
      );

      const groupByCategory = (skills: Skill[]) => {
        const groups: { [key: string]: Skill[] } = {};
        skills.forEach(skill => {
          if (!groups[skill.category]) groups[skill.category] = [];
          groups[skill.category].push(skill);
        });
        return groups;
      };

      const quickWinsByCategory = groupByCategory(quickWins);
      const achievableByCategory = groupByCategory(achievable);
      const stretchByCategory = groupByCategory(stretch);

      const recommendations: Skill[] = [];

      const quickWinCategories = Object.keys(quickWinsByCategory);
      for (let i = 0; i < Math.min(3, quickWinCategories.length); i++) {
        const category = quickWinCategories[i];
        const categorySkills = quickWinsByCategory[category]
          .sort((a, b) => a.hours_required - b.hours_required);
        if (categorySkills.length > 0) {
          recommendations.push(categorySkills[0]);
        }
      }

      const achievableCategories = Object.keys(achievableByCategory);
      for (let i = 0; i < Math.min(4, achievableCategories.length); i++) {
        const category = achievableCategories[i];
        const categorySkills = achievableByCategory[category]
          .sort((a, b) => {
            const aScore = Math.abs(a.hours_required - availableHours * 0.7);
            const bScore = Math.abs(b.hours_required - availableHours * 0.7);
            return aScore - bScore;
          });
        if (categorySkills.length > 0 && !recommendations.find(r => r.id === categorySkills[0].id)) {
          recommendations.push(categorySkills[0]);
        }
      }

      const stretchCategories = Object.keys(stretchByCategory);
      for (let i = 0; i < Math.min(2, stretchCategories.length); i++) {
        const category = stretchCategories[i];
        const categorySkills = stretchByCategory[category]
          .sort((a, b) => a.hours_required - b.hours_required);
        if (categorySkills.length > 0 && !recommendations.find(r => r.id === categorySkills[0].id)) {
          recommendations.push(categorySkills[0]);
        }
      }

      recommendations.push(...selectedLanguages);

      const remaining = nonLanguageSkills
        .filter(skill => !recommendations.find(r => r.id === skill.id))
        .filter(skill => skill.hours_required <= availableHours) 
        .sort((a, b) => {
          const aDistance = Math.abs(a.hours_required - availableHours);
          const bDistance = Math.abs(b.hours_required - availableHours);
          return aDistance - bDistance;
        });

      recommendations.push(...remaining);

      return recommendations; 
    };

    const matched = getSmartSkillRecommendations(total, skills);
    setMatchedSkills(matched);

  }, [activities, skills]);

  const updateActivityHours = (index: number, hours: string) => {
    const numHours = Math.max(0, parseFloat(hours) || 0);
    const newActivities = [...activities];
    newActivities[index].hours = numHours;
    setActivities(newActivities);
  };

  const increaseHours = (index: number) => {
    const newActivities = [...activities];
    newActivities[index].hours += 0.5;
    setActivities(newActivities);
  };

  const decreaseHours = (index: number) => {
    const newActivities = [...activities];
    newActivities[index].hours = Math.max(0, newActivities[index].hours - 0.5);
    setActivities(newActivities);
  };

  const getMotivationalMessage = () => {
    if (totalHours === 0) return "Отслеживайте время, чтобы открыть возможности для обучения";
    if (totalHours < 4) return "Каждая минута важна! Маленькие шаги ведут к большим достижениям";
    if (totalHours < 12) return "Вы на пути к освоению чего-то удивительного!";
    if (totalHours < 24) return "Невероятный потенциал! Вы можете освоить новый навык";
    return "Выдающийся результат! У вас есть время для освоения множества навыков";
  };

  const getTimePercentage = () => {
    const total = activities.reduce((sum, activity) => sum + activity.hours, 0);
    const maxHours = timeframe === 'daily' ? 24 : timeframe === 'weekly' ? 168 : timeframe === 'monthly' ? 720 : 8760;
    return Math.min((total / maxHours) * 100, 100);
  };

  return (
    <div id="calculator" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Освойте навыки за 24 часа
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-8">
            Тщательно отобранные навыки для быстрого освоения. Превратите свободное время в ценные способности на всю жизнь.
          </p>
        </div>
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Калькулятор времени
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Укажите, сколько часов вы тратите на каждую активность за выбранный период времени.
          </p>
        </div>

        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-gray-100 p-1 rounded-lg w-full max-w-md sm:w-auto">
            <div className="grid grid-cols-2 sm:flex gap-1">
              {([
                {key: 'daily', label: 'День'}, 
                {key: 'weekly', label: 'Неделя'}, 
                {key: 'monthly', label: 'Месяц'}, 
                {key: 'yearly', label: 'Год'}
              ]).map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                  className={`px-3 sm:px-6 py-2 rounded-md font-medium transition-all text-sm sm:text-base ${
                    timeframe === tf.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="animate-fade-in stagger-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Отслеживание активностей</h3>

              <div className="space-y-4 sm:space-y-6">
                {activities.map((activity, index) => (
                  <div key={activity.name} className="border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{activity.name}</h4>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => decreaseHours(index)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={activity.hours || ''}
                            onChange={(e) => updateActivityHours(index, e.target.value)}
                            className="w-16 sm:w-20 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="0"
                          />
                          
                          <button
                            onClick={() => increaseHours(index)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          
                          <span className="text-xs sm:text-sm text-gray-500">часов</span>
                        </div>
                      </div>
                      
                      <div className="text-right sm:text-right self-end sm:self-auto">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{activity.hours}h</div>
                        <div className="text-xs sm:text-sm text-gray-500">за {timeframe === 'daily' ? 'день' : timeframe === 'weekly' ? 'неделю' : timeframe === 'monthly' ? 'месяц' : 'год'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <span className="text-base sm:text-lg font-medium text-gray-700">Всего времени за {timeframe === 'daily' ? 'день' : timeframe === 'weekly' ? 'неделю' : timeframe === 'monthly' ? 'месяц' : 'год'}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">{totalHours.toFixed(1)} часов</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getTimePercentage()}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-500">{getTimePercentage().toFixed(1)}% от {timeframe === 'daily' ? 'дня (24ч)' : timeframe === 'weekly' ? 'недели (168ч)' : timeframe === 'monthly' ? 'месяца (720ч)' : 'года (8760ч)'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8 animate-fade-in stagger-2">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Потенциал для обучения</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{getMotivationalMessage()}</p>
                </div>
              </div>

              {totalHours > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{matchedSkills.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Доступные навыки</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{Math.floor(totalHours / 300) || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Доступные языки</div>
                  </div>
                </div>
              )}
            </div>
            {matchedSkills.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    <span className="text-sm sm:text-base lg:text-xl">Рекомендуемые навыки для изучения</span>
                  </h3>
                  
                  {matchedSkills.length > 10 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {showAllSkills ? `Свернуть (${matchedSkills.length})` : `Показать все (${matchedSkills.length})`}
                    </button>
                  )}
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {(showAllSkills ? matchedSkills : matchedSkills.slice(0, 10)).map((skill) => {
                    const progress = Math.min((totalHours / skill.hours_required) * 100, 100);
                    const isStretch = skill.hours_required > totalHours;

                    return (
                      <div
                        key={skill.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover-lift"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{skill.name}</div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">{skill.category} • {skill.difficulty_level}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-blue-600 text-sm sm:text-base">{skill.hours_required}h</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress >= 100 ? 'bg-green-500' : 
                              progress >= 70 ? 'bg-blue-500' : 
                              'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        
                        {isStretch && (
                          <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            Нужно еще {(skill.hours_required - totalHours).toFixed(1)}ч для полного освоения
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
              </div>
            ) : null}
            
            
            {matchedSkills.length === 0 && totalHours > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Добавьте больше времени</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Отследите больше часов, чтобы увидеть персональные рекомендации навыков
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Начнем</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Введите ваше время выше, чтобы открыть возможности для обучения
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
