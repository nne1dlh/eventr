import sampleData from "./sampleData";

const delay = ms => {
  return new Promise(res => setTimeout(res, ms));
};

export const fetchSampleData = () => {
  return delay(1800).then(() => {
    return Promise.resolve(sampleData);
  });
};
