

/* Author:
http://jkco.phonelog.ie/api/index.php/today
*/
Backbone.View.prototype.close = function () {
    //console.log('Closing view ' + this);
    //console.dir(this);
    if (this.beforeClose) {
        this.beforeClose();
    }
	
    this.remove();
    this.unbind();
};


var AppView = Backbone.View.extend({
    el: $("#app-view"),

    showView: function(view){
		var closingView = this.view;
		this.closeView(closingView);
		
		this.view = view;
		this.view.render(); 
		
		$(this.view.el).hide();
		this.$el.append(this.view.el);	
		
		this.openView(this.view);
		
		//console.dir(view);
    },

    openView: function(view){
      $(view.el).fadeIn();
    },

    closeView: function(view){
      if (view){
        view.unbind();
        $(view.el).fadeToggle(200, function(){
          $(this).remove();
		  
        });
      }
    }
  });
 

window.Call = Backbone.Model.extend({
	defaults: function() {
		var now = new Date();
			
		return {
			caller		: "",
			calldate	: dateFormat(now, "yyyy-mm-dd"),
			cDateRoute	: dateFormat(now, "yyyymmdd"),
			cdate		: dateFormat(now, "d mmmm yyyy"),
			ctimenozero	: dateFormat(now, "H:MM"),
			calltime	: dateFormat(now, "H:MM:ss"),
			message		: "",
			callDir		: "in",
			phone		: ""
		};		
	},
	
	validate : {
		caller: {
			//required: true // if this is included, the calldate and calltime as formatted do not render
		}   
	},
	
	idAttribute: "callid",
	
	initialize: function() {
		var that = this;	
		//that.memento = new Backbone.Memento(that);
		//that.store = that.memento.push;
		//that.restore = that.memento.pop;
				
		(that.get("calldate")) ? that.set({ "cdate": that.convDate(that.get("calldate")) }) : that.set({ "cdate": ""});
		(that.get("calldate")) ? that.set({ "cdateS": that.convDateS(that.get("calldate")) }) : that.set({ "cdate": ""});
		(that.get("calldate")) ? that.set({ "ctime": that.convTime(that.get("calldate") +' '+ that.get("calltime")) }) : that.set({ "ctime": ""});
		(that.get("calldate")) ? that.set({ "ctimenozero": that.convTimeNoZero(that.get("calldate") +' '+ that.get("calltime")) }) : that.set({ "ctimenozero": ""});
		(that.get("calldate")) ? that.set({ "cDateRoute": that.convDateRoute(that.get("calldate")) }) : that.set({ "cDateRoute": ""});
	},
	
	convDate: function(string) {
        return dateFormat(string, "d mmmm yyyy");
    },
	
	convDateS: function(string) {
        return dateFormat(string, "d mmm yyyy");
    },
	
	convTime: function(string) {
		var ct = dateFormat(string, "shortTime");
		//console.log(ct);
		return ct; //dateFormat(string, "d mmm yyyy");
    },
	
	convTimeNoZero: function(string) {
		var ct = dateFormat(string, "H:MM");
		return ct; 
    },
	
	convDateRoute: function(string) {
		var ct = dateFormat(string, "yyyymmdd");
		return ct; 
    }
});

window.CallsList = Backbone.Collection.extend({
	model: Call,
	url: "http://jkco.phonelog.ie/api/index.php/day/111",
	//url: "http://127.0.0.1/xampp/pl2/api/index.php/today",
	
	initialize: function() {
		this.bind("add", this.callAdded, this);
	},
	
	comparator: function(call) {
		var c = call.get('calldate') + " " + call.get('calltime')
		var d = new Date( c );
        return -d.getTime();
    },
	
	stats: function() {
		return {
			total		: 	this.length,
			incoming	:	this.inComing().length,
			outgoing	: 	this.length-this.inComing().length
		}
	},
	
	inComing: function() {
		return this.filter(function(n) { return n.get('callDir')=="in"; });
	},
	
	filterByDate: function(d) {
		return (this.filter(function(n) { return n.get('cDateRoute')===d}));
	},
	
	callAdded: function(model){
		//this.sort();  // does not seem to work
		index = this.indexOf(model);
		//console.log(model);
		//model.save();
    },
	
	sync: function(method, model, options){  
		//options.timeout = 10000;  
		//options.withCredentials = true;
		//options.username = "jkane";
		//options.dataType = "json";  
		//console.dir(options);
		var new_options =  _.extend({
			beforeSend: function(xhr) {
				var token = $('meta[name="csrf-token"]').attr('content');
				if (token) xhr.setRequestHeader('X-CSRF-Token', token);
				
				//xhr.setRequestHeader('username', 'jkane')
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown);
			},
			statusCode: {
				200: function() {
					//console.dir("page found");
				}
			}
		}, options)
		return Backbone.sync(method, model, new_options);  
	}, 
	
	filterPagin: function (start, end) {
        return this.filter(function(m) {
            return m.get("cid")==start;
        });
    }
});


window.CaseView = Backbone.View.extend({

	tagName: "tr",
	
	initialize: function() {
	
		//this.model.on('change', this.render, this);
		this.model.on('updateModel', this.updateModel, this);
	},
	
	render: function() {
		var that = this; 		
		var tmpl = $("#tmplCase").render( that.model.toJSON() );
		that.$el.html(tmpl);
		return this;
	},
	
	updateModel: function(diff) {
		var that = this;		
		//this.remove();  -- if we do this, the bound events (read: message) is not operative
		//$('#logTableBody').prepend( that.render().el );
		
		// find the index of the call in the collection
		var i = callsList.indexOf( that.model );
		var elm = $("tr:eq(" + i.toString() + ")");
		elm.after( that.render().el );
		
		//console.log( i );
		//console.log( that.render().el );
	},
	
	events: {
		"click"				: "editRow",
		"mouseenter .blob"	: "show",
		"mouseleave .blob"	: "hide",
		//"mouseleave .opts"	: "showOpts",
		//"mouseleave .opts"	: "hidepts"
	},
	
	show: function() {
		var that=this;
		var id = '#' + that.el.children[3].children[0].id;
		$(id).popover({trigger: "manual",
						  placement: "right",
						  offset: 10,
						  html: true,
						  title: function(){return that.model.get("caller") + " @ " + that.model.get("ctime"); },
						  content: function(){return that.model.get("message");}
					});
		$(id).popover("show");	
	},
	
	hide: function(){
		var that=this;
		var id = '#' + that.el.children[3].children[0].id;
		$(id).popover("hide");
	},
	
	/*showOpts: function(e) {
		console.log("shown");
		$(e.currentTarget).children().fadeIn().stop(false, true);
	},*/
	
	editRow: function(evt) {
		if (wallView)
			console.dir(wallView.cid);
		var wallView = new WallView({model: this.model});
		
	}
});

window.CaseCollectionView = Backbone.View.extend({
	el: $("#callsTable"),
	
	initialize: function() {

		//this.logTableBody = this.$('#logTableBody');
		//this.logTableBody.empty(); 
		
		this.collection.on('add', this.addCall, this);
	},
	
	addCall: function(call){

		var index = this.collection.indexOf(call);
		var	i = index-1;		
		var cView = new CaseView({	model: call });
		//console.log(cView);
		
		// check if logTableBody is display:none and make visible if it is	
		/*$("#logTableBody tr:eq(" + index.toString() + ")")
			.after( cView.render().el );*/
		
		$(".callsTable")
			.css({'display' : 'table'});
			
		$("#logTableBody")
			.prepend( cView.render().el );

			
		$("#logTableBody tr:eq(" + (i).toString() + ")")
			.effect( "highlight", {} , 1500); // applies the effect to the wrong tr
		
		this.renderStats();
	},
	
	renderItem: function(call){
		
		var $e = this.$el.find('#logTableBody');
		var singleCallView = new CaseView({	model: call});
		$e.append( singleCallView.render().el );
	},
	
	renderStats: function() {
		var tmpl = $("#stats-template").render( this.collection.stats() );
		//console.log( tmpl );
		var elm = $('#stats');
		elm.fadeOut('medium', function() {
			elm.html(tmpl).fadeIn('slow');
		});
		
		// change the title element
		document.title = "Phonelog v2.0 (" + this.collection.stats().incoming + ")";
	},
	
	render: function() {
		var that = this;
		that.renderStats();
		
		var len = that.collection.length;
		var tmpl = $("#tableH-template").render();
		
		if (len) {
			that.$el.html(tmpl);
			
			//var d = that.collection.filterByDate();
			//$(d).each(function(){ that.renderItem(this); });  // keep an eye on the stats as that gets updated.
			
			that.collection.each(this.renderItem, this); 
		} /*else {
			//$('.noCallsMessage').fadeIn('slow');
			$('.callsTable').css({'display':'none'})
		}*/
		
		return this;
	},
	

});

	var pusher = new Pusher('b4ecb0e71bc6c0677fa1'); // 584b9a95d39155301944
	var channel = pusher.subscribe('phonelog_jkco');
	channel.bind('newcalls', function(data) {		
		
		// check if the id attribute is in the collection already
		var mdl = callsList.get(data.id); //console.dir(data);
		//console.dir(data);
		//console.dir(mdl);
		if (mdl) {			
			mdl.on('change', function() {
				var diff = mdl.changedAttributes();
				mdl.trigger('updateModel', diff);
			});
			
			mdl.set(data);  // change the model all at once
			
		} else {
			callsList.add(data);  // this should only be triggered if the day in view is the same as the day being updated
			//callsList.sort();
		}
		
    });
	
	/*
	[
		{
			"caller": "Joe Kane",
			"message": "he needs a call back",
			"calldate": "2012-02-20",
			"calltime": "11:08",
			"id": "13094"
		}
	]
	*/