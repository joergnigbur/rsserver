module.exports = {
  "development": {
    "env": "dev",
    "rsBaseDir": "C:\\xampp\\htdocs\\recspec",
    "rsImgServer": "http://jnigbur.synology.me/",
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
