window.Call = Backbone.Model.extend({

});

window.CallsList = Backbone.Collection.extend({
	model: Call,
	url: "http://127.0.0.1:8888/intranet/developer/pl2/cro/sample2.php"

});	


var cro = new CallsList();
cro.fetch({
	success: function() {
		console.log("success");
		console.log(this);
	},
	error: function() {
		console.log("error");
		console.log(this);
	}
});

