/* Author:
http://jkco.phonelog.ie/api/index.php/today
*/

window.Caller = Backbone.Model.extend({
	defaults: {
		"numbers": ''
	}
});

window.CallerList = Backbone.Collection.extend({
	model: Caller
});

window.CallerView = Backbone.View.extend({

	tagName: "tr",
	
	initialize: function() {
		
	},
	
	render: function() {
				
		var that = this; 
		that.model.set({ "cdate": that.convDate(that.model.get("calldate")) });
		that.model.set({ "ctime": that.convTime(that.model.get("calldate") +' '+ that.model.get("calltime")) });
		that.model.set({ "callDay": that.convDay(that.model.get("calldate")) });
		
		var tmpl = $("#tmplCase").render(that.model.toJSON());
		$(that.el).html(tmpl);
		return this;
	},
	
	convDate: function(string) {
        return dateFormat(string, "d mmm yyyy");
    },
	
	convTime: function(string) {
		var ct = dateFormat(string, "shortTime");
		return ct; 
    },

	convDay: function(string) {
		var ct = dateFormat(string, "dddd");
		return ct; 
    },
	
	events: {
		"click"				: "editRow",
		"mouseenter .blob"	: "show",
		"mouseleave .blob"	: "hide"
	},
	
	show: function() {
		var that=this;
		var id = '#' + that.el.children[3].children[0].id;
		$(id).twipsy({trigger: "manual",
                              placement: "right",
                              offset: 10,
                              html: true,
                              title: function(){return that.model.get("message");}
                              });
		$(id).twipsy("show");	
	},
	
	hide: function(){
		var that=this;
		var id = '#' + that.el.children[3].children[0].id;
		$(id).twipsy("hide");
	},
	
	editRow: function() {
		console.log("clicked");
		$("#form-modal").modal("show");
	}
});

window.CallerCollectionView = Backbone.View.extend({
	el: $("#logTableBody"),
	initialize: function() {
		_.bindAll(this, 'render');
		this.render();
	},

	render: function() {
		var that = this;
		that._cViews = [];
		/*that.el.fadeOut('medium', function() {
			that.collection.each(function(m) {
				that._cViews.push(new CallerView({
					model: m
				}).render().el);
				$(that.el).append(that._cViews).fadeIn('medium');
			});

		});*/
		that.collection.each(function(m) {
				that._cViews.push(new CaseView({
					model: m
				}).el);
				//}));
				//console.dir(that._cViews);
				//$(that.el).append(that._cViews).fadeIn('slow');
				that.$el.append(that._cViews).fadeIn('medium');
				
			});
		return this;
	}
	
});
