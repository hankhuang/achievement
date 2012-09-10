// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Achievement Model
  // ----------

  // basic Achievement model has `title`, and `description` attributes.
  var Achievement = Backbone.Model.extend({

    // Default attributes for the Achievement item.
    defaults: function() {
      return {
        title: "Guru",
        description: "You are a master of all languages. You have earned the maximum badge!"
      };
    },

    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
      if (!this.get("description")) {
      	this.set({"description": this.defaults().description});
      }
    },
    
    clear: function() {
      this.destroy();
    }

  });

  // Achievement Collection
  // ---------------

  // The collection of achievements is backed by *localStorage* instead of a remote
  // server.
  var AchievementList = Backbone.Collection.extend({

    model: Achievement,

    localStorage: new Backbone.LocalStorage("achievements-backbone")

  });

  // An array of achievements that users can earn
  // usually this will come from the server, but since I don't have access to the server, I'll just create some here
  var Badges = new Backbone.Collection([
  	new Achievement({
  		title: "Apprentice",
  		description: "You have practiced for more than 1 hour!"
  	}),
  	new Achievement({
  		title: "Explorer",
  		description: "You have practiced for more than 5 hours!"
  	}),
  	new Achievement({
  		title: "Fanatic",
  		description: "You have practiced for more than 10 hours!"
  	}),
  	new Achievement({
  		title: "Expert",
  		description: "You have practiced for more than 50 hours!"
  	}),
  	new Achievement({
  		title: "Star",
  		description: "You have practiced for more than 100 hours!"
  	}),
  	new Achievement({
  		title: "Grand Master",
  		description: "You have practiced for more than 1000 hours!"
  	}),
  	new Achievement()
  	  	
  ]);

  // Create our global collection of **Achievements**.
  var Achievements = new AchievementList;

  // Achievement Notification View
  // --------------
  var NotificationView = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#item-template').html()),

    events: {
      "click a.destroy" : "clear"
    },

    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    
    clear: function() {
      this.model.clear();
    }

  });

  // The Application
  // ---------------
  var AppView = Backbone.View.extend({

    el: $("#achieveapp"),

    statsTemplate: _.template($('#stats-template').html()),

    events: {
      "click #practice": "earnOnClick",
      "click #hide-all": "hideAll"
    },

    initialize: function() {

      this.button = this.$("#practice");

      Achievements.on('add', this.addOne, this);
      Achievements.on('reset', this.addAll, this);
      Achievements.on('all', this.render, this);

      this.footer = this.$('footer');
      this.main = $('#main');

      Achievements.fetch();
    },

    render: function() {
      if (Achievements.length) {
        this.main.show();
        this.footer.show();
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    addOne: function(badge) {
      var view = new NotificationView({model: badge});
      this.$("#badge-list").append(view.render().el);
    },

    addAll: function() {
      Achievements.each(this.addOne);
    },

    earnOnClick: function() {
      if (Badges.length > Achievements.length) {
      	var badge = Badges.at(Achievements.length);
      	var achievement = new Achievement({
      	  title: badge.get("title"),
      	  description: badge.get("description")
        });
        Achievements.create(achievement);
        
      	this.render();
	    // I'll probably do the ajax call here to save to server
	    // $.ajax({
		//	type: 'POST',
		//	url: "saveBadge",
		//	data: achievement,
		//});
      } else {
      	this.render();
      }
    },

    hideAll: function() {
	  this.main.hide();
      this.footer.hide();
    },

  });

  var App = new AppView;

});
