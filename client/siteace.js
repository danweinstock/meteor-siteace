	/////
	// template helpers 
	/////
Router.configure({
	  layoutTemplate: 'ApplicationLayout'
	})
	Router.route('/', function () {
		this.render('navbar', {
			to: 'navbar'
		});
	  this.render('websites',{
	  	to: 'main'
	  });
	});

	Router.route('websites/:_id', function(){
		this.render('navbar', {
			to: 'navbar'
		});
		this.render('website_details' , {
			to: 'main', 
			data: function(){ 
				return {website: Websites.findOne({_id: this.params._id}),
								comments: Comments.find({websiteId: this.params._id})																														 }
   		}
   });
	});
	Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort: { rating: -1 , createdOn: -1 }});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			Websites.update({_id: website_id } , { $inc: {rating: + 1 }})
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			Websites.update({_id: website_id } , {$inc: {rating: - 1}})
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			// var url, = event.target.url.value;
			var title, url, description;

				title = event.target.title.value;
				url = event.target.url.value;
				description = event.target.description.value;

			console.log("The url they entered is: "+url);
			
			//  put your website saving code in here!	
			Websites.insert({
				title:title,
				url:url,
				description:description,
				createdOn:new Date(),
				createdBy:Meteor.user()._id

			});
			return false;// stop the form submit from reloading the page

		}
	});
	Template.comment_form.events({
		"click .js-toggle-comment-form": function(event, template) {
			$("#comment_form").toggle('slow');
		},
		"submit .js-save-comment-form": function(event, template){
       var text = event.target.text.value;
			 var websiteId = event.target.websiteId.value;
			  console.log(Session.get('websiteId'));
					 if(Meteor.user()) {
						 Comments.insert({
							 websiteId: websiteId,
		           createdBy: Meteor.user()._id,
							 createdOn: new Date(),
							 text: text
						 });
					 }
					$("#comment_form").hide('slow');
					return false;// stop the form submit from reloading the page
		}
	});
 // comment
  Template.comment.helpers( {
		author: function(userId) {
			var user = Meteor.users.findOne({ _id: userId});
			if(user) {
				return user.username;
			} else {
				return "anonymous";
			}

		}
	})




