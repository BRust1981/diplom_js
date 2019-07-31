class Profile {
  constructor(userObject){
    this.username = userObject.username;
    this.name = userObject.name;
    this.password = userObject.password;
  }

  createUser(callback){
    return ApiConnector.createUser({ username: this.username, 
                                     name:this.name, 
                                     password: this.password 
                                    }, callback);
  }

  performLogin(callback){
    return ApiConnector.performLogin({username: this.username, 
                                      password: this.password
                                    }, callback);
  }

  addMoney({ currency, amount }, callback) {
    return ApiConnector.addMoney({ currency, amount }, (err, data) => {
        console.log(`Adding ${amount} of ${currency} to ${this.username}`);
        callback(err, data);
    });
  }
}

function main() {

  const user1 = new Profile({
    username: 'vasya',
    name: { firstName: 'Uasiliy', lastName: 'Uasisdasov' },
    password: 'uaspass',
  });

  const user2 = new Profile({
    username: 'petya',
    name: { firstName: 'Petyunya', lastName: 'Petuhov' },
    password: 'petpass',
  });

  user1.createUser((err, data) => {
    if(err){
      console.error(`Error during creating user ${user1.username}`);
    } else {
      console.log(`Creating user ${user1.username}`);
      user1.performLogin((err, data) => {
                          if(err){
                            console.error(`Error during authorizing user ${user1.username}`);
                          } else {
                            console.log(`Authorizing user ${user1.username}`);
                          }
                        });
    }
  });
}

main();