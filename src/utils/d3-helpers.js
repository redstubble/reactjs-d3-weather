export const canvas = {
  dataset: [
    5,
    10,
    13,
    19,
    21,
    25,
    22,
    18,
    15,
    13,
    11,
    12,
    15,
    20,
    18,
    17,
    16,
    18,
    23,
    25,
  ],
};

export const formatDate = (dt) => {
  const date = new Date(dt);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return (
    date.getMonth() +
    1 +
    '/' +
    date.getDate() +
    '/' +
    date.getFullYear() +
    '  ' +
    strTime
  );
};
