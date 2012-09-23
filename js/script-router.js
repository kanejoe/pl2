var ItemRouter = Backbone.Router.extend({
    //formAddEditEl: $("#add-edit-form"),

    routes: {
      ""			: 	"index",
	  "!/:date"		:	"thisDay",
      "/new"		: 	"add",
      "/edit/:id"	: 	"edit",
    },

    initialize: function(options){
      this.collection = options.collection;
      this.appView = options.appView;
    },

    index: function(){
		var now = new Date();
		var date = dateFormat(now, "yyyymmdd");
		this.navigate("!/"+date, {trigger: true, replace: false});
    },
	
	thisDay: function(date) {
		//console.dir(date);
		var coll, callListView, newColl;
		
		// if date == today then do nothing else if something else 
		
		//coll = this.collection.filterByDate(date);	// http://stackoverflow.com/a/6415174/578667
		coll = this.collection;	
		var newColl = new CallsList( coll );		
		
		//console.dir(coll);
		callListView = new CaseCollectionView({collection: coll});
		this.appView.showView(callListView);
		
	},
	
    add: function(){
		this._addEditItem(new Call());
		//console.dir( this.routes[Backbone.history.fragment] );
		//console.dir( this.routes );
    },

    edit: function(id){
		var call = this.collection.get(id);
		//console.dir(call);
		this._addEditItem(call);
    },

    _addEditItem: function(call){
		var addEditView = new AddEditView({model: call});
		//console.dir(call);
		addEditView.on("saved", function(){		
			if (call.isNew()){
				this.collection.add(call);
				//console.dir(this.collection.length);
			} 

		}, this);

		addEditView.on("close", function(){
			this.navigate("", {trigger: true, replace: true});
		}, this);
		
		//console.dir(this);
		this.appView.showView(addEditView);
    },
  });

var appView = new AppView();
var callsList = new CallsList();
callsList.fetch({success: function() { 
	var itemRouter = new ItemRouter({collection: callsList, appView: appView});
	Backbone.history.start();
	} 
});
