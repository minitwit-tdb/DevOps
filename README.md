# ITU MiniTwit (TB)

## Dependencies

In order to run this application on your device you need to have installed the
following services:

* NodeJS (<https://nodejs.org/en/download/>)
* MariaDB (<https://linuxize.com/post/how-to-install-mariadb-on-ubuntu-18-04/>)
* Yarn (<https://classic.yarnpkg.com/en/docs/install/>)

## Tech stack

This application runs on the following tech stack

* **Languague**: Typescript
* **Javascript runtime**: NodeJS
* **Database**: MariaDB
* **Server**: Express (including express-flash, express-session)
* **Templating**: Nunjucks

## Recommendations

It is recommended to use the Visual Studio Code along with the Eslint extension.

## Setting up the application

In order to run this application, the following step should be taken:

* Configure the MariaDB connection by creating a file called ```mariadb.json``` in the source folder (i.e. ```./src/mariadb.json```)
  * This file should resemble the following structure:
    ```js
    {
      "host": "localhost",
      "user": "root",
      "password": "",
      "database": "minitwit"
    }
    ```

* Run the command ```yarn install```

## Running the application

In order to run the application use the following commands:

* ```yarn build```
* ```yarn start```

... or if you'd like to enable developer mode with live reloading, run the following command:

```yarn watch```

Once this is done you should be able to access the application from ```localhost:3000```

(NB: these commands and more can be found described in the file ```package.json```)

## Maintaining the application

Due to the naive implementation, then the following things should be considered while developing for this application:

* The compiler does **not** support absolute links for import/export statement. These must be relative.
