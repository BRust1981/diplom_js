'use strict';

//Первая часть задания
class Profile {
  constructor(userObject){
    this.username = userObject.username;
    this.name = userObject.name;
    this.password = userObject.password;
    this.wallet = {};
  }
  //метод Добавление нового пользователя
  createUser(callback){
    return ApiConnector.createUser({ username: this.username, 
                                     name: this.name, 
                                     password: this.password 
                                    }, callback);
  }
  //метод Авторизация
  performLogin(callback){
    return ApiConnector.performLogin({username: this.username, 
                                      password: this.password
                                    }, callback);
  }
  //метод Добавление денег в личный кошелек
  addMoney({ currency, amount }, callback) {
    console.log(`Adding ${amount} of ${currency} to ${this.username}`);
    return ApiConnector.addMoney({ currency, amount }, (err, data) => {
        callback(err, data);
    });
  }
  //метод Конвертация валют
  convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback){
    console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
    return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      callback(err, data);
    });
  }
  //метод Перевод токенов другому пользователю
  transferMoney({ to, amount }, callback){
    console.log(`Transfering ${amount} of Netcoins to ${to}`);
    return ApiConnector.transferMoney({ to, amount }, (err, data) => {
      callback(err, data);
    });
  }

}

// Функция получения курса валют
function getStocks (callback){
  return ApiConnector.getStocks(callback);
}

//Вторая часть задания
function main() {
  //экземпляр №1 класса Profile
  const user1 = new Profile({
    username: 'vasya',
    name: { firstName: 'Basilio', lastName: 'Uasisdasov' },
    password: 'uaspass',
  });

  //экземпляр №2 класса Profile
  const user2 = new Profile({
    username: 'petya',
    name: { firstName: 'Petyunya', lastName: 'Petuhov' },
    password: 'petpass',
  });

  //Сумма зачисляемая пользователям
  let initMoney = {currency: 'EUR', 
                   amount: 3500
                  };
  //Валюта в которую переводим из начальной
  let targetCurrency = 'NETCOIN';

  //Вызов метода создания пользователя для одной из созданых переменных
  user1.createUser((err, data) => {
    if(err){
      console.error(`Error during creating user ${user1.username}.`);
    } else {
      console.log(`Creating user ${user1.username}.`);
      //В случае удачного создания пользователя вызов метода авторизации для того же пользователя
      user1.performLogin((err, data) => {
                          if(err){
                            console.error(`Error during authorizing user ${user1.username}.`);
                          } else {
                            console.log(`Authorizing user ${user1.username}.`);
                            //В случае удачной авторизации вызов метода добавления денег на счёт для авторизованного пользователя
                            user1.addMoney(initMoney, (err, data) => {
                                            if(err){
                                              console.error(`Error during adding money to user ${user1.username}.` + err);
                                            } else {
                                              if(user1.wallet[initMoney.currency] !== undefined){
                                                user1.wallet[initMoney.currency] += initMoney.amount;    //Если такой счет уже есть, то добавить деньги к счету
                                              } else{
                                                user1.wallet[initMoney.currency] = initMoney.amount;     //Иначе создать счет
                                              }
                                              console.log(`Added ${initMoney.amount} of ${initMoney.currency} to user ${user1.username}.`);
                                              getStocks((err, data) => {
                                                          if(err){
                                                            console.error(`Error converting ${initMoney.currency} to Netcoins: `, err);
                                                          } else {
                                                            //для корректной работы метода необходимо передавать уже конвертированную (целевую) сумму
                                                            let convertedMoney = initMoney.amount * data[0][initMoney.currency + '_' + targetCurrency];

                                                            //console.log(initMoney.currency, targetCurrency, convertedMoney);
     
                                                            //В случае удачного добавления денег на счёт вызов метода конвертации денег из текущей валюты в Неткоины
                                                            user1.convertMoney({fromCurrency: initMoney.currency, 
                                                                                targetCurrency: targetCurrency,
                                                                                targetAmount: convertedMoney
                                                                              }, (err, data) => {
                                                                                if(err){
                                                                                  console.error(`Error during converting ${initMoney.currency} to Netcoins: `, err );
                                                                                } else {
                                                                                  if(user1.wallet[targetCurrency] !== undefined){
                                                                                    user1.wallet[targetCurrency] += convertedMoney;    //Если такой счет уже есть, то добавить деньги к счету
                                                                                  } else{
                                                                                    user1.wallet[targetCurrency] = convertedMoney;     //Иначе создать счет
                                                                                  }
                                                                                  user1.wallet[initMoney.currency] = 0;                 //По условию мы все переводим в неткоины
                                                                                  console.log('Converted to coins', user1);
                                                                                  //В случае удачной конвертации вызов метода создания второго пользователя
                                                                                  user2.createUser((err, data) => {
                                                                                    if(err){
                                                                                      console.error(`Error during creating user ${user2.username}.`);
                                                                                    } else {
                                                                                      console.log(`Creating user ${user2.username}.`);

                                                                                      user1.transferMoney({ to: user2.username, 
                                                                                                            amount: user1.wallet[targetCurrency]
                                                                                                          }, (err, data) => {
                                                                                                            if(err){
                                                                                                              console.error(`Error during transfering ${user1.wallet[targetCurrency]} Netcoins to ${user2.username}: `, err );
                                                                                                            } else {
                                                                                                              if(user2.wallet[targetCurrency] !== undefined){
                                                                                                                user2.wallet[targetCurrency] += user1.wallet[targetCurrency];    //Если такой счет уже есть, то добавить деньги к счету
                                                                                                              } else{
                                                                                                                user2.wallet[targetCurrency] = user1.wallet[targetCurrency];     //Иначе создать счет
                                                                                                              }
                            
                                                                                                              console.log(`${user2.username} has got ${user2.wallet[targetCurrency]} ${targetCurrency}.`);
                                                                                                            }
                                                                                                            });
                                                                                    }
                                                                                  });
                                                                                }
                                                                        });
                                                          }
                                                        });
                                            }
                                          });
                          }
                        });
    }
  });
}


main();