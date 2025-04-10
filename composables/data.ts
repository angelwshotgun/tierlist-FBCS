import { GameDataService } from '~/services/GameDataService';

export const useDataApi = () => {
  return useAsyncData('characters', () => GameDataService.getCharacters());
};
