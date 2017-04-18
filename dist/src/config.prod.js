module.exports = {
  "development": {
    "env": "dev",
    "rsBaseDir": "/var/www/clients/client0/web1/web/",
    "port":"80",
    "rsImgServer": "http://test.recspec.de",
    "defaultLocale": "de-DE",
    "db": {
      "connection": {
        "host": "www.recruitment-specialist.de",
        "user": "recruitment",
        "password": "DykaybUdIEd7",
        "database": "recruitment"
      },
      "client": "mysql"
    },
    "errorHandlerOptions": {
      "dumpExceptions": true,
      "showStack": true
    }
  },
  "production": {
    "env": "prod",
    "defaultLocale": "de-DE",
    "rsBaseDir": "/var/www/clients/client0/web1/web",
    "db": {
      "connection": {
        "host": "www.recruitment-specialist.de",
        "user": "recruitment",
        "password": "DykaybUdIEd7",
        "database": "recruitment"
      },
      "client": "mysql"
    },
    "errorHandlerOptions": {
      "dumpExceptions": false,
      "showStack": false
    }
  }
}
