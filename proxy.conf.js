const PROXY_CONFIG = {
  "/api": {
      "target": "http://localhost:58979/",
      "secure": false,
      "logLevel": "debug"      
  }
}

module.exports = PROXY_CONFIG;