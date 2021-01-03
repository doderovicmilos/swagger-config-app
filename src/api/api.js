const url =  'https://l5ov8zep98.execute-api.us-west-2.amazonaws.com/api';

export const registerUser = async (user) => {
  return fetch(
    `${url}/register`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
};

export const logInUser = async (user) => {
  return fetch(
    `${url}/login`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
};


export const getConfigs = async () => {
  const token = localStorage.getItem('swaggerApiToken');
  return fetch(
    `${url}/config`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
};

export const getConfig = async (name, version) => {
  const token = localStorage.getItem('swaggerApiToken');
  return fetch(
    `${url}/config/${name}?version=${version}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
};

export const saveConfig = async (config) => {
  const token = localStorage.getItem('swaggerApiToken');
  return fetch(
    `${url}/config`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(config)
    });
};