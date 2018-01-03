const numcoin = Number(100000000);

Template.walletview.onCreated(function() {
  this.autorun(() => {
      this.subscribe('userdata', {
        onReady: function () {
          console.log("render");
          if(UserData.findOne({key:"userpass"})) {
            Session.set("login", false);
            Session.set("logout", false);
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

Template.walletview.onRendered(function() {
  var clipboard = new Clipboard('.btn-copy-link');
});

Template.registerHelper('logout', function() {
  return Session.get("logout");
});

Template.walletview.helpers({
  coins: function(){
     return ["KMD", "MNZ", "BTC"];
  },
  currentcoin: function(){
    return Session.get("coin");
  },
  coinsString: function() {
    if (Session.get("coin") == "KMD") {
      return "Komodo";
    } else if (Session.get("coin") == "BTC") {
      return "Bitcoin";
    } else if (Session.get("coin") == "MNZ") {
      return "Monaize";
    }
  },
  balance: function(){
      return UserData.findOne({coin:Session.get("coin")}) && parseFloat(UserData.findOne({coin:Session.get("coin")}).balance/numcoin).toFixed(8);
  },
  address: function(){
    return UserData.findOne({coin:Session.get("coin")}) && UserData.findOne({coin:Session.get("coin")}).smartaddress.toString();
  },
  addrx: function(){
    return UserData.findOne({coin:Session.get("coin")}).smartaddress.toString();
  },
  activecoinKMD: function(){
    if (Session.get("coin") == "KMD") {
      return true;
    } else {
      return false;
    }
  },
  activecoinBTC: function(){
    if (Session.get("coin") == "BTC") {
      return true;
    } else {
      return false;
    }
  },
  activecoinMNZ: function(){
    if (Session.get("coin") == "MNZ") {
      return true;
    } else {
      return false;
    }
  },
  activeSendButton: function(){
    //return Session.get("activeSendButton");
  },
  activeAdressButton: function(){
    //return Session.get("activeAdressButton");
  },
  price: function(){
    //return TradeData.findOne({key:"mnzprice"}).price.toString;
  },
  swaps: function(){
    return SwapData.find({}, {sort: {sorttime: -1}});
  }
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});

Session.set("activeSendButton", true);
Template.walletview.events({
  'click .kmd'(event, intance) {
    Session.set("coin", "KMD");
    //Meteor.call('sendtoaddress', amount, address, coin);
  },
  'click .btc'(event, intance) {
    Session.set("coin", "BTC");
    //Meteor.call('sendtoaddress', amount, address, coin);
  },
  'click .mnz'(event, intance) {
    Session.set("coin", "MNZ");
    //Meteor.call('sendtoaddress', amount, address, coin);
  },
  "change #coin-select": function (event, template) {
      var coin = $(event.currentTarget).val();
      Session.set("coin", coin);
      // alert(coin);

  },
  'keyup .amount': _.throttle(function(event) {
    var value = Number(event.target.value)*numcoin;
    var userBalance = UserData.findOne({coin:Session.get("coin")}).balance;

    if(userBalance > (value + 10000) && value > 0) {
      //Session.set("activeSendButton", true);
    } else {
    //  Session.set("activeSendButton", false);
    }
  }),
  'keyup .address': _.throttle(function(event) {
    if (event.target.value != "" && event.target.value.length == 34) {
    //  Session.set("activeAdressButton", true);
    } else {
    //  Session.set("activeAdressButton", false);
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
  },
  "click .stop": function (){
    Session.set("loading", true);
    Session.set("logout", true);
    Meteor.call('stopwallet', function(error, result){
      if(error){
        swal("Shit!", error, "error");
        Session.set("loading", false);
      }
      else{
        Session.set("loading", false);
        Session.set("login", true);
        swal("Wallet successfully closed!", "Getting back to loginpage", "success");
      }
    });
},
"click .buy": function (event, template) {
   event.preventDefault();
   const amount = Number(Number(template.find(".buyamount").value).toFixed(8)) * numcoin;

   if(amount > 0){
     Meteor.call("buy", amount, "KMD", function(error, result){
       if(error) {
         swal("Oops!", error, "error");
       }
       else{
         swal("Buy called", "id: " + result, "success");
       }
     });
   }else {
     {
       swal("Oops!", "Amount needs to be bigger than 0.", "error");
     }
   }

 }
});

Template.registerHelper('showbuyview',() =>{
  if (!(Session.get("coin") == "MNZ")) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('coinsString',() =>{
    if (Session.get("coin") == "KMD") {
      return "Komodo";
    } else if (Session.get("coin") == "BTC") {
      return "Bitcoin";
    } else if (Session.get("coin") == "MNZ") {
      return "Monaize";
    }
});

Template.registerHelper('currentcoin',() =>{
  return Session.get("coin");
});

Template.registerHelper('and',(a,b)=>{
  return a && b;
});
Template.registerHelper('or',(a,b)=>{
  return a || b;
});
