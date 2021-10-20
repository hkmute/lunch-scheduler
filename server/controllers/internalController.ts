import { InternalService } from '../services/internalService';
import { generateRandomNumbers } from '../utils/utils';

export function InternalController(service: ReturnType<typeof InternalService>) {
  return Object.freeze({
    getTodayVotes: async () => {
      try {
        const votes = await service.getTodayVotes();
        return votes;
      } catch (error) {
        console.error(error.message);
        return;
      }
    },

    generateOptions: async () => {
      try {
        const codesWithOptions = await service.getCodeIdWithOptionIds();
        const todayOptions = codesWithOptions.reduce<
          {
            codeId: number;
            optionId: any;
          }[]
        >((acc, code) => {
          const optionIds = JSON.parse(code.optionIds);
          const randomIndexes = generateRandomNumbers(3, optionIds.length - 1);
          randomIndexes.forEach((index) =>
            acc.push({
              codeId: code.codeId,
              optionId: optionIds[index],
            })
          );
          return acc;
        }, []);
        await Promise.all([service.insertTodayOptions(todayOptions), service.insertTodaySystemVote(todayOptions)]);
        return;
      } catch (error) {
        console.error(error.message);
        return;
      }
    },

    generateResults: async (
      todayVotes: {
        optionId: number;
        codeId: number;
        count: number;
      }[]
    ) => {
      try {
        const obj: { [key: number]: { optionId: number; count: number }[] } = {};
        // obj = {
        //   {codeId}: {optionId, count}[]
        // }
        for (let vote of todayVotes) {
          if (obj[vote.codeId]) {
            obj[vote.codeId].push({ optionId: vote.optionId, count: vote.count });
          } else {
            obj[vote.codeId] = [{ optionId: vote.optionId, count: vote.count }];
          }
        }
        const results: { optionId: number; codeId: number }[] = [];
        for (const codeId in obj) {
          const options = obj[codeId];
          const totalVotes = options.reduce((acc, cur) => acc + cur.count, 0);
          let random = Math.random();
          for (const option of options) {
            random = random - option.count / totalVotes;
            if (random <= 0) {
              results.push({ optionId: option.optionId, codeId: parseInt(codeId) });
              break;
            }
          }
        }
        await service.insertResults(results);
        return;
      } catch (error) {
        console.error(error.message);
        return;
      }
    },
  });
}
