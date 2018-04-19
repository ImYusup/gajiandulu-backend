# bibitnomic-api

>

## About

This project uses [Node](https://nodejs.org/). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1.  Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
    Required version:
    ```
    "node": "^9.0.0",
    "yarn": ">= 0.18.0"
    ```
2.  Install your dependencies

    ```
    cd path/to/gajiandulu-api; npm install
    ```

    or

    ```
    cd path/to/gajiandulu-api; yarn
    ```

3.  Configure your database connection

    > config/config.json

    ```
    "development": {
        "username": "your_username",
        "password": "your_password",
        "database": "bibitnomic_dev",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    ```

    > config/default.json

    ```
    "mysql": "mysql://your_username:your_password@127.0.0.1:3306/gajian_dulu"
    ```

    ### Never Commit/Push your changes in this file!

4.  Migrate database using sequelize
    Run these commands in order

    ```
    node_modules/.bin/sequelize db:create
    ```

    ```
    node_modules/.bin/sequelize db:migrate
    ```

    ```
    node_modules/.bin/sequelize db:seed
    ```

5.  Start your app

    ```
    npm start
    ```

## Specification

* [User register](https://gitlab.com/refactory-bibitnomic/gajian-dulu/wikis/Registration-Specification)
* [User setting](https://gitlab.com/refactory-bibitnomic/gajian-dulu/wikis/Setting-Spesification)

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Changelog

**0.1.0**

* Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
