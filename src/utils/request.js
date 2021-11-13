import axios from "axios";

const service = axios.create({
  baseURL: window.API_PREFIX,
  responseType: "json",
});

// abort duplicate request
const pending = {};
const CancelToken = axios.CancelToken;

const getFetchKey = (config) => {
  const {
    url,
    data,
    method,
    headers: { timestamp },
  } = config;
  let token;
  if (method === "get") {
    token = [method, url, timestamp].join("&");
  } else {
    token = [method, url, timestamp, JSON.stringify(data)].join("&");
  }
  return token;
};

const removePending = (config, f) => {
  // stringify whole RESTful request with URL params
  const flagUrl = getFetchKey(config);
  if (flagUrl in pending) {
    if (f) {
      pending[flagUrl]("abort the request."); // abort the request
      delete pending[flagUrl];
      pending[flagUrl] = f; // store the cancel function
    } else {
      delete pending[flagUrl];
    }
  } else {
    if (f) {
      pending[flagUrl] = f; // store the cancel function
    }
  }
};
// axios interceptors
service.interceptors.request.use(
  (config) => {
    // you can apply cancel token to all or specific requests
    // e.g. except config.method == 'options'
    config.headers.timestamp = +new Date();
    config.cancelToken = new CancelToken((c) => {
      removePending(config, c);
    });
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    removePending(response.config);
    return response.data;
  },
  (error) => {
    removePending(error.config);
    if (!axios.isCancel(error)) {
      return Promise.reject(error);
    } else {
      // return empty object for aborted request
      return Promise.resolve({});
    }
  }
);

service.clear = () => {
  Object.keys(pending).map((e) => {
    if (pending[e]) {
      pending[e]("abort the request");
      delete pending[e];
    }
    return;
  });
};

export default service;
