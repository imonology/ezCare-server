[ ![Codeship Status for imonology/ezCare](https://codeship.com/projects/96b35120-5b42-0134-1c18-421b0673279f/status?branch=master)](https://codeship.com/projects/173356)
[![CircleCI](https://circleci.com/gh/imonology/ezCare.svg?style=svg&circle-token=41f6e828603a71074d5e5e16e391b3f0bbdf218e)](https://circleci.com/gh/imonology/ezCare)

# ezCare
Interactions for Elders (傳遞關懷, 傳承經驗, 傳播希望)

# Install

## Install node.js LTS (4.5.0)

`sudo apt-get install nodejs`

## Install mongodb (server and client)

`sudo apt-get install mongodb`

## Setup MongoDB admin account (change user / pwd to your own DB admin account and password)
You should change YOUR_DB_ADMIN_PASSWORD to your own passowrd.

`mongo`

for mongodb 2.4, use:

	use admin
	db.addUser("dbadmin", "YOUR_DB_ADMIN_PASSWORD");
	quit();


for mongodb 3.0, use:

	use admin
	db.createUser(
	  {
	    user: "dbadmin",
	    pwd: "YOUR_DB_ADMIN_PASSWORD",
	    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
	  }
	);
	quit();


					  
## clone ezCare repo

  `git clone https://github.com/imonology/ezCare.git`

## configure local settings
DB_ADMIN password should be changed.

  ```
  cp settings.js.example settings.js
  vim settings.js
  ```


## install required libs

  ```npm install```

## start server

  ```npm start```
