import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/api/data/consist.js';
import './main.html';
import { Session } from 'meteor/session';
import swal from 'sweetalert2'
import './scripts/loginform.js';
import './scripts/walletview.js';

Meteor.startup(function(){
	Session.set("coin", "KMD"); //default coin is KMD

});

Template.body.onCreated(function() {
  this.autorun(() => {
      	Session.set("balance-view", true);
    	Session.set("buy-view", false);
    	Session.set("withdrawal-view", false);
    });

      sAlert.config({
        effect: '',
        position: 'bottom',
        // timeout: 1000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });
});


Template.walletview.onCreated(function() {
  this.autorun(() => {
		Session.set("balance-view", true);
		Session.set("buy-view", false);
		Session.set("withdrawal-view", false);
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

Template.body.helpers({
  balanceView: function(){
    return Session.get("balance-view");
  },
  buyView: function(){
    return Session.get("buy-view");
  },
  withdrawalView: function(){
    return Session.get("withdrawal-view");
  }
});

Template.body.events({
 'click #balance-view': function (event, template) {
    Session.set("balance-view", true);
    Session.set("buy-view", false);
    Session.set("withdrawal-view", false);
    $('#balance-view').addClass('active');
    $('#buy-view').removeClass('active');
    $('#withdrawal-view').removeClass('active');
  },
  'click #buy-view': function (event, template) {
    Session.set("balance-view", false);
    Session.set("buy-view", true);
    Session.set("withdrawal-view", false);
    $('#balance-view').removeClass('active');
    $('#buy-view').addClass('active');
    $('#withdrawal-view').removeClass('active');
  },
  'click #withdrawal-view': function (event, template) {
    Session.set("balance-view", false);
    Session.set("buy-view", false);
    Session.set("withdrawal-view", true);
    $('#balance-view').removeClass('active');
    $('#buy-view').removeClass('active');
    $('#withdrawal-view').addClass('active');
  },
  'click #logout': function (){
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
	}
});
