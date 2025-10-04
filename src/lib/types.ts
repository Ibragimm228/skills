export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  hours_required: number;
  difficulty_level: 'Начинающий' | 'Средний' | 'Продвинутый';
  learning_outcomes: string[];
  resources_needed: string[];
  icon: string;
  created_at: string;
}

export type SkillCategory = 
  | 'Творчество'
  | 'Техническое' 
  | 'Физическое'
  | 'Языки'
  | 'Образ жизни'
  | 'Бизнес'
  | 'Кулинария'
  | 'Рукоделие'
  | 'Музыка'
  | 'Искусство';

export type DifficultyLevel = 'Начинающий' | 'Средний' | 'Продвинутый';
