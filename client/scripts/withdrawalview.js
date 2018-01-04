import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

const numcoin = Number(100000000);

Template.withdrawalview.onCreated(function() {
  this.autorun(() => {
      Session.set("isSending", false);
      this.subscribe('userdata', {
        onReady: function () {
          if(UserData.findOne({key:"userpass"})) {
            Session.set("login", false);
          }
          else {
            Session.set("login", true);
          }
        },
        onError: function () {
        }
      });
    });
});

Template.withdrawalview.onRendered(function() {
  var clipboard = new Clipboard('.btn-copy-link');
});

Template.withdrawalview.helpers({
  currentcoin: function(){
    return Session.get("coin");
  },
  balance: function(){
      return UserData.findOne({coin:Session.get("coin")}) && parseFloat(UserData.findOne({coin:Session.get("coin")}).balance/numcoin).toFixed(8);
  },
  activeSendButton: function(){
    return Session.get("activeSendButton");
  },
  activeAdressButton: function(){
    return Session.get("activeAdressButton");
  },
  disableSendCoins: function(){
    return Session.get("disableSendCoins");
  },
  isSending: function(){
    return Session.get("isSending");
  }
});

Template.withdrawalview.events({
  'keyup .amount': _.throttle(function(event) {
    var value = Number(event.target.value)*numcoin;
    var userBalance = UserData.findOne({coin:Session.get("coin")}).balance;

    if(userBalance > (value + 10000) && value > 0) {
      Session.set("activeSendButton", true);
    } else {
      Session.set("activeSendButton", false);
    }
  }),
  'keyup .address': _.throttle(function(event) {
    if (event.target.value != "" && event.target.value.length == 34) {
      Session.set("activeAdressButton", true);
    } else {
      Session.set("activeAdressButton", false);
    }
  }),
 "click .sendcoins": function (event, template) {
    event.preventDefault();
    const amount = Number(Number(template.find(".amount").value).toFixed(8)) * numcoin;
    const addr = template.find(".address").value;

    if(Number(UserData.findOne({coin:Session.get("coin")}).balance) > (amount + Number(0.00010000*numcoin)))
    {
      Meteor.call("sendtoaddress", Session.get("coin"), addr, amount, function(error, result) {
        if(error) {
          swal("Oops!", error, "error");
        }
        else{
          swal("Transaction sent", "txid: " + result, "success");
        }
      });
    }
    else swal("Shit!", "Not enough balance or txfee ignored.", "error");
  }
});
