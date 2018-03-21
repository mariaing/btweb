const PROXY_CONFIG = {
  "/api": {
      //"target": "http://localhost:58979/",
      "target": "http://btproject.cerverodev.com:8080",
      "secure": false,
      "logLevel": "debug"      
  },
  "changeOrigin": true
}

module.exports = PROXY_CONFIG;