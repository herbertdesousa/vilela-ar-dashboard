import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ce1a-179-190-170-181.ngrok.io',
});

export const internalApi = axios.create({
  // eslint-disable-next-line prettier/prettier
  baseURL: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.browser && window.location.host}/api`
});
