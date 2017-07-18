# Game of Thrones Battle API

### Tools needed to run and test app
1. Nodejs, npm and yarn


###### Note: Mongodb is not required as current code is configured with mlab, 
however if you want to run mongodb on local machine, then create 'battles' 
collection and point mongodb uri in routes/battles.js to your database;


### Steps to install app
1. git clone https://github.com/jaspreet57/got-battle-api.git
2. cd got-battle-api
3. yarn install (if don't have yarn, you can use npm or do 'npm install -g yarn')
4. yarn start (this will start app and listen at localhost:8080


### Using the api (I suggest to use postman to test rest end points)
##### below end points have been designed and working according to given 
assignment requirement

###### GET localhost:8080/count
###### GET localhost:8080/list
###### GET localhost:8080/stats
###### GET localhost:8080/search

##### Search api receives query params or else throw 404 error
###### example
###### localhost:8080/search?king=Robb Stark
###### localhost:8080/search?king=Robb Stark&location=Darry&type=pitched battle



