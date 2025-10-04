import { useEffect, useState } from 'react';
import { TimeCalculator } from './components/TimeCalculator';
import { SkillsBrowser } from './components/SkillsBrowser';
import { allSkillsData } from './data';
import type { Skill } from './lib/types';

function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = () => {
      try {
        const sortedSkills = [...allSkillsData].sort((a, b) => 
          a.category.localeCompare(b.category)
        );
        setSkills(sortedSkills);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(loadSkills, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Загрузка навыков...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <TimeCalculator skills={skills} />
        <SkillsBrowser skills={skills} />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Начните свое обучающее путешествие
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Каждый навык, который вы осваиваете, открывает новые двери. Выберите тот, который вас вдохновляет, и начните сегодня.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{skills.length}+</div>
              <div className="text-gray-600 text-sm sm:text-base">Доступные навыки</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">1-24h</div>
              <div className="text-gray-600 text-sm sm:text-base">Время на освоение</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">∞</div>
              <div className="text-gray-600 text-sm sm:text-base">Ценность на всю жизнь</div>
            </div>
          </div>

          <div className="space-y-4">
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
