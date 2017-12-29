import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/api/data/consist.js';
import './main.html';
import { Session } from 'meteor/session';
import sweetalert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

Meteor.startup(function(){
	Session.set("coin", "KMD"); //default coin is KMD
	// $.getScript('https://cdn.rawgit.com/zenorocha/clipboard.js/master/dist/clipboard.min.js');
});
//return Addrs.findOne().count();
