import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import sweetalert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

const numcoin = Number(100000000);
const defaultValueMIN = 0.1;
const defaultValueMAX = 100;

priceCoins = function(value){
  if (Session.get("currentBuyCoin") == "KMD") {
    // CALL PRICE FOR ONE KMZ_MNZ and replace priceKMZ_MNZ variable.
    var priceKMZ_MNZ = Session.get("price");
    console.log (priceKMZ_MNZ);
    Session.set("currentvalue", (value * priceKMZ_MNZ));
  } else if (Session.get("currentBuyCoin") == "BTC") {
    // CALL PRICE FOR ONE BTC_MNZ and replace priceBTC_MNZ variable.
    var priceBTC_MNZ = 6666;
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

  if (UserData.findOne({coin:Session.get("currentBuyCoin")})) {
    value = Number(value)*numcoin;
    var userBalance = UserData.findOne({coin:Session.get("currentBuyCoin")}).balance;
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
    Session.get("currentBuyCoin", "KMD");
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
  },
  categories: function(){
    return ["KMD", "BTC"];
  }
});

Template.buyview.events({
  'click .buy'(event, instance) {
    if (Session.get("disableBuy") == false) {
      event.preventDefault();
      const amount = Number(Number(instance.find("#buyamount").value).toFixed(8)) * numcoin;
      console.log(amount);
      if(amount > 0){
        Session.set("isBuying", true);
        Meteor.call("buy", amount, Session.get("currentBuyCoin"), function(error, result){
          if(error) {
            Session.set("isBuying", false);
            swal("Oops!", error, "error");
          }
          else{
            Session.set("isBuying", false);
            swal("Buy called", "id: " + result, "success");
          }
        });
      } else {
        swal("Oops!", "Amount needs to be bigger than 0.", "error");
      }
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
  },
  'change #category-select'(event, template) {
      Session.set("currentBuyCoin", event.target.value.toString());
      $('#buyamount').val(defaultValueMIN);
  }
});