import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import sweetalert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

Template.registerHelper('login', function() {
  return Session.get("login");
});

Template.registerHelper('loading', function() {
  return Session.get("loading");
});

Template.loginform.onCreated(function() {
  this.autorun(() => {
    this.subscribe('userdata', {
      onReady: function () {
          //once data is ready set some session vars to have specific STATIC data ready (userpass, smartaddresses)
          if(UserData.findOne({key:"userpass"})) {
            Session.set("login", false);
          }
          else {
            Session.set("login", true);
          }
        }
      });
    });
});

Template.loginform.events({
  'submit .login'(event, instance){
    var pass = event.target.passphrase.value;
    Session.set("loading", true);
    Meteor.call('startWallet', pass, function(error) {
      if(error) {
        swal("Oops!", error, "error");
        //if(error.error === "") Session.set("login", true);
        Session.set("login", true);
        Session.set("loading", false);
      }
      else{
        Session.set("loading", false);
        Session.set("login", false);
        //console.log("login_event");
        swal("Thank you!", "Your passphrase is: " + pass + "\n"
        + "Login procedure can take up to 1 minute...", "success");
        //Session.set("login", flase);
      }
    });

    //swal("Login ", pass, "error");
    // Clear form
    event.target.passphrase.value = "";
    return false;
  }
});