class Profile {
  constructor(userObject){
    this.username = userObject.username;
    this.name = userObject.name;
    this.password = userObject.password;
  }

  createUser(callback){
    return ApiConnector.createUser({ username: this.username, 
                                     name: this.name, 
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
        //console.log(err);
        //console.log(data);
        callback(err, data);
    });
  }

  convertMoney(){

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
                            let money = {currency: 'EUR', 
                                         amount: 3500
                                        };
                            user1.addMoney(money, (err, data) => {
                                            if(err){
                                              console.error(`Error during adding money to user ${user1.username}`);
                                            } else {
                                              console.log(`Added ${money.amount} of ${money.currency} to user ${user1.username}`);
                                            }
                                          });
                          }
                        });
    }
  });
}

function getStocks (){
  return ApiConnector.getStocks((err, data) => {
    if(err){
      console.error('Error getting stocks: '+ err);
    } else {
      console.log('Got stocks: ');
      console.log(data);
      return data;
    }
  });
}

//let a = getStocks();
//console.log(a);
console.log(getStocks());


//main();