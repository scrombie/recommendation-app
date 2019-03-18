import qs from 'querystring';

export const getKeys = (list, key) => list.reduce((a, c) => {
  a.push(c[key]); return a;
}, []);

export const get = (url, data) => fetch(`${url}${data ? `?${qs.stringify(data)}` : ''}`)
  .then(res => res.json());

export const post = (url, data) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})
  .then(res => res.json());

export const listFilter = (list, exclude = [], key) => list
  .filter(i => exclude.indexOf(i[key]) === -1);
