import axios from 'axios';

const BASE_URL = 'https://sandbox.dibuiltadi.com';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
