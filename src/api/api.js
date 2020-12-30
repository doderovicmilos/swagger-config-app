export const registerUser = async (user) => {
  return fetch(
    'https://l5ov8zep98.execute-api.us-west-2.amazonaws.com/api/register',
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
    'https://l5ov8zep98.execute-api.us-west-2.amazonaws.com/api/login',
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
    'https://l5ov8zep98.execute-api.us-west-2.amazonaws.com/api/config',
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
    `https://l5ov8zep98.execute-api.us-west-2.amazonaws.com/api/config/${name}?version=${version}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
      //body: JSON.stringify({})
    });
};