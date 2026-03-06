export const http = {
  get: async url => {
    const response = await fetch(url);
    return response.json();
  }
};