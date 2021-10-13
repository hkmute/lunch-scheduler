import { InternalService } from '../services/internalService';

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
        const options = await service.getCodeIdWithOptionIds();
        const todayOptions = options.map((option) => {
          const optionIds = JSON.parse(option.optionIds);
          const randomIndex = Math.floor(Math.random() * optionIds.length);
          return {
            codeId: option.codeId,
            optionId: optionIds[randomIndex],
          };
        });
        await service.insertTodayOptions(todayOptions);
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
          const totalVotes = options.reduce((acc, cur) => acc + cur.count, options.length);
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
