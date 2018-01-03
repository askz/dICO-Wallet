import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import sweetalert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

const numcoin = Number(100000000);
const defaultValueMIN = 5;
const defaultValueMAX = 1000;

priceCoins = function(value){
  if (Session.get("coin") == "KMD") {
    // CALL PRICE FOR ONE KMZ_MNZ and replace priceKMZ_MNZ variable.
    var priceKMZ_MNZ = 6666666;
    Session.set("currentvalue", (value * priceKMZ_MNZ) / numcoin);
  } else if (Session.get("coin")=="BTC") {
    // CALL PRICE FOR ONE BTC_MNZ and replace priceBTC_MNZ variable.
    var priceBTC_MNZ = 1666;
    Session.set("currentvalue", (value * priceBTC_MNZ) / numcoin) ;
  } else {
    return 0;
  }
};

handleBuyButton = function(value){
  if (!isDecimal((value / defaultValueMIN)) 
    && value >= defaultValueMIN
    && value <= defaultValueMAX) {
    Session.set("disableBuy", false);
  } else {
    Session.set("disableBuy", true);
  }

  if (UserData.findOne({coin:Session.get("coin")})) {
    value = Number(value)*numcoin;
    var userBalance = UserData.findOne({coin:Session.get("coin")}).balance;
    if (userBalance > (value + 10000)) {
      Session.set("disableBuy", false);
    } else {
      Session.set("disableBuy", true);
    }
  }

};

isDecimal = function(n) {
   return n % 1 != 0;
};

Template.buyview.onCreated(function() {
  this.autorun(() => {
    Session.set("currentvalue", defaultValueMIN);
    Session.set("isBuying", false);
    priceCoins(defaultValueMIN);
    handleBuyButton(defaultValueMIN);
    });
});

Template.buyview.helpers({
  currentvalue: function(){
     return Session.get("currentvalue");
  },
  disableBuy: function(){
    return Session.get("disableBuy");
  },
  isBuying: function(){
    //if SWAP IN ON THE WAY Session.set("isBuying", true);
    //else Session.set("isBuying", false);
    return Session.get("isBuying");
  },
  defaultValueMIN: function(){
    return defaultValueMIN;
  },
  defaultValueMAX: function(){
    return defaultValueMAX;
  }
});

Template.buyview.events({
  'click .buy'(event, instance) {
    if (Session.get("disableBuy") == false) {
      //simulate CALL BUY
      Session.set("isBuying", true);
      setTimeout(function(){
        Session.set("isBuying", false);
        swal("Buy success");
      }, 2000);
    }
  },
  "click [type='number']"(event, instance) {
    event.preventDefault();
  },
  "keypress [type='number']"(event, instance) {
    event.preventDefault();
  },
  'keyup .inputmnz'(event, instance) {
    handleBuyButton(event.target.value);
    priceCoins(event.target.value);
  }
});