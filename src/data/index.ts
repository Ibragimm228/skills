import { Skill } from '../lib/types';
import { skillsData, getSkillsByCategory, getSkillsByDifficulty, getSkillsByTimeRange, getCategories } from './skills-data';
import { extendedSkillsData, getExtendedSkillsByCategory, getExtendedSkillsByDifficulty, getExtendedSkillsByTimeRange } from './skills-data-extended';
import { advancedSkillsData, getAdvancedSkillsByCategory, getAdvancedSkillsByDifficulty, getAdvancedSkillsByTimeRange } from './skills-data-advanced';

export const allSkillsData: Skill[] = [...skillsData, ...extendedSkillsData, ...advancedSkillsData];

export { skillsData, extendedSkillsData, advancedSkillsData };

export const getAllSkillsByCategory = (category: string): Skill[] => {
  return allSkillsData.filter(skill => skill.category === category);
};

export const getAllSkillsByDifficulty = (difficulty: string): Skill[] => {
  return allSkillsData.filter(skill => skill.difficulty_level === difficulty);
};

export const getAllSkillsByTimeRange = (minHours: number, maxHours: number): Skill[] => {
  return allSkillsData.filter(skill => 
    skill.hours_required >= minHours && skill.hours_required <= maxHours
  );
};

export const getAllCategories = (): string[] => {
  return [...new Set(allSkillsData.map(skill => skill.category))].sort();
};

export const getSkillsCountByCategory = (): { [key: string]: number } => {
  const categories = getAllCategories();
  const counts: { [key: string]: number } = {};
  
  categories.forEach(category => {
    counts[category] = getAllSkillsByCategory(category).length;
  });
  
  return counts;
};

export const getTotalSkillsCount = (): number => {
  return allSkillsData.length;
};

export const searchSkills = (query: string): Skill[] => {
  const lowercaseQuery = query.toLowerCase();
  return allSkillsData.filter(skill => 
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.description.toLowerCase().includes(lowercaseQuery) ||
    skill.learning_outcomes.some(outcome => outcome.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRandomSkills = (count: number): Skill[] => {
  const shuffled = [...allSkillsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export {
  getSkillsByCategory,
  getSkillsByDifficulty,
  getSkillsByTimeRange,
  getCategories,
  getExtendedSkillsByCategory,
  getExtendedSkillsByDifficulty,
  getExtendedSkillsByTimeRange,
  getAdvancedSkillsByCategory,
  getAdvancedSkillsByDifficulty,
  getAdvancedSkillsByTimeRange
};
