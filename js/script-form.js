/* Author:
http://jkco.phonelog.ie/api/index.php/today
*/

//Backbone.sync = function(method, model) {
	// console.log("I've been passed " + method + " with " + JSON.stringify(model));
//};

window.Wall = Backbone.Model.extend({
	urlRoot: "http://127.0.0.1/xampp/pl2/api/index.php/today",
	idAttribute: "callid",
	defaults: function() {	
		var now = new Date();

		return {
			caller: "Ian Riley",
			cdate: dateFormat(now, "d mmmm yyyy"),
			ctimenozero: dateFormat(now, "H:MM"),
			message: "call back"
		};
	},
	
	validate : {
		caller : {
			required  : true,
			//pattern   : /[a-zA-Z]+/,
			minlength : 3,
			maxlength : 40
		}
	}
});

window.Walls = Backbone.Collection.extend({
	model: Wall,
	/* Method 1: This sorts by page number */
	comparator: function(m) {
	  return m.get("caller");
	}
	//localStorage: new Store("todos"),
});

window.WallView = Backbone.View.extend({

	el: $('#theCallForm'),
	
	initialize: function() {
		Backbone.ModelBinding.bind(this); //-- does this work with templates --> probably not needed anyway
		//this.model.bind("error", this.error, this);
		//this.model.bind('save', this.addOne, this);
		//console.dir(this.cid);
		//this.render();	
		
    },
	
	render: function() {
		var that = this; 		
		//var tmpl = $("#tmplForm").render(that.model.toJSON());
		//$(that.el).html(tmpl);
		
		return this;
	},
	
	addOne: function(todo) {
		
		//this.collection.sort(); // this works to sort the collection according to the comparator
		//console.dir(this.collection.toJSON());
		var view = new CaseView({model: todo});		
		
		//var index = this.collection.indexOf(todo);
		//console.log(index.toString());
		//$("#logTableBody tr:eq(" + index.toString() + ")").before(view.render().el).effect("highlight", {}, 2500);
				
		console.log("adding...");
    },
	
	error: function(model, errors) {
		//show the errors in each function
		
		$.each(errors, function(attr, err) { 
			var msg;
			if (err[0]==="required" || err[0]==="minlength") {
				msg = "You must enter a value";
			} else  {
				msg = "An error";
			}
			
			$('#'+attr+'-error').empty().fadeIn('slow').append(msg);  // fadeIn doesn't do this because it was not blocked out
			$('#'+attr+'-error').parent().addClass('error');
			
			setTimeout(function () {
				$('#'+attr+'-error').parent().removeClass('error');
			}, 2000);

			//console.log(err);
		});
	},
	
	events: {
		"click .save": "saveCall",
    },
	
	saveCall: function(e) {
		var s = this.model.set({
			caller: $('#caller').val(),
			calltime: $('#calltime').val(),
			calldate: $('#calldate').val()
		});
		//console.dir($('#caller').val());
			
		//this.model.save({ caller : $('#caller').val() });
		//this.collection.create({ caller : $('#caller').val() });
		//var view = new CaseView({model: s});
		
		//var index = coll.indexOf(this.model);
		//console.log(index.toString());
		
		//$("#logTableBody").prepend(view.render().el);
		
		//$("#logTableBody tr:eq(" + index.toString() + ")").before(view.render().el).effect("highlight", {}, 2500);
		console.dir(s.attributes);
		if (s) {
			var coll = new CallsList();
			//console.dir(coll);
			//coll.create( s );
			//this.model.save();
			//var view = new CaseView({model: this.model});	
			//console.dir(view);
		}
		e.preventDefault();
		return false;
	}
});
	
//var wallView = new WallView({collection: new Walls});
var wallView = new WallView({model: new Wall});