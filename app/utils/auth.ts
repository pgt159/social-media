const Cookies = require("js-cookie");

const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";
const objCookies = {
  expires: 3,
  domain: process.env.COOKIE_DOMAIN,
};

export const saveToken = (access_token: string, refresh_token: string) => {
  if (access_token && refresh_token) {
    Cookies.set(accessTokenKey, access_token, {
      ...objCookies,
    });
    Cookies.set(refreshTokenKey, refresh_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: "/",
    });
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: "/",
    });
  }
};

export const getToken = () => {
  const access_token = Cookies.get(accessTokenKey);
  const refresh_token = Cookies.get(refreshTokenKey);

  return {
    access_token,
    refresh_token,
  };
};

export const logout = () => {
  const access_token = Cookies.get(accessTokenKey);
  if (access_token) {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: "/",
    });
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: "/",
    });
  }
};
