const PROXY_CONFIG = {
  "/api": {
      "target": "http://localhost:58979/",
      // "target": "http://btproject.cerverodev.com/",
      "secure": false,
      "logLevel": "debug"      
  }
}

module.exports = PROXY_CONFIG;