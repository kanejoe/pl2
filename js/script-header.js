
/* Author:
http://jkco.phonelog.ie/api/index.php/today
*/

// http://jqueryui.com/demos/autocomplete/#custom-data
var Autocomplete = Backbone.View.extend({
  render: function() {
	var choices = this.options.choices,
		selected = this.options.selected,
		iterator = this.options.iterator,
		label = this.options.label,
		allowDupes = this.options.allowDupes,
		selValue = this.options.selValue,
		$el = $(this.el); 
		//console.dir($el);
	$el.autocomplete({ // http://docs.jquery.com/UI/Autocomplete
		delay: 400,
		autoFocus: false,
		minLength: 0,
		source: function(request, response) {
		
			//request.term = request.term.replace(/'/gi,"\\'"); // replace globally  --  http://stackoverflow.com/a/8222523/578667
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i'); 
			response(choices.filter(function(model) {
			  return iterator(model, matcher);
			}));
		},
	  focus: function(event, ui) {
		$el.val(label(ui.item));
		//console.dir(ui.item.attributes.caller);
		return false;
	  },
	  select: function(event, ui) {
		//console.dir(ui.item);
		//selected.add(ui.item);  
		/*if (!allowDupes) {
		  choices.remove(ui.item);
		}*/
		//$el.val(''); 
		//console.dir(ui.item.attributes.caller);
		$el.val(selValue(ui.item)); 
		return false;
	  }
	}).data('autocomplete')._renderItem = function(ul, item) {
	  return $('<li/>')
		.data('item.autocomplete', item)
		.append($('<a/>').text(label(item)))
		.appendTo(ul);
		
	};
	return this;
  }
});

window.TopBarView = Backbone.View.extend({
	el: "#header",
	initialize: function() {
		// puts the date into the .curDate span
		var now = new Date(); now= now.toString();
		var cur = dateFormat(now, "dddd, d mmmm yyyy");
		$('#curDate').text(cur);
	}
	
})

window.SideBarView = Backbone.View.extend({

	el: "#sidebar",
	
	initialize: function() {
		_.bindAll(this, "closeModal", "saveCall");
		
		/*$("#form-modal").modal({
			"backdrop": true,
			"keyboard": true
		});*/
		$("a#save-call").bind("click", this.saveCall);
		$("a#close-call").bind("click", this.closeModal);
		
		// put the datepicker in the call date field
		$('#calldate').datepicker({ 	dateFormat: 'd MM yy',
										altField: "#calldate_alt",
										altFormat: "yy-mm-dd",
										maxDate: '+0d',
										showAnim: 'slideDown'
		}).children().show();
		
		$('#datepicker').datepicker({
				dateFormat: 'yy-mm-dd',
				maxDate: '+0d',
				onSelect: function(dateText, inst)
				{
					var altDateList = new CallsList(); 					
					altDateList.url = 'http://jkco.phonelog.ie/api/index.php/day/'+dateText;
					altDateList.fetch({
						error: function() { console.log(arguments); },
						success: function(e) { 
							//console.dir(e);
							if(e.length>0) { 
														
								$('.noCallsMessage').fadeOut('slow', function() {
									//$('#logTableBody').empty();
									//courtListView = new CaseCollectionView({collection: altDateList});
									
									//var pagColl = new PaginatedCollection(e.models); 
									//console.dir(e.models);
									// need to remove the existing view from the DOM
									
									//var pag = $("#pagination");
									// console.dir(pag);
									// $("#pagination").children().remove();
									//var pagView = new PaginatedView({collection: pagColl});

									//console.dir(e);
									
									$('.callsTable').fadeIn();
									var calls = altDateList.length + " calls"; 
									$('.nCalls').text(calls);
									callListView = new CaseCollectionView({collection: e});
									callListView.render();
									//appView.showView(callListView); // not in the correct format
									
								});
							} else {
								$('.noCallsMessage').fadeIn('slow');
								$('.callsTable').css({'display':'none'});
								$('.nCalls').text("");
							}
							
							var now = new Date(); now= now.toString();
							now = dateFormat(now, "yyyy-mm-dd");

							if (now==dateText) {
								$('.gDate').text("Today's List");
							} else {
								var cur = dateFormat(dateText, "dddd, d mmmm yyyy");
								$('.gDate').text(cur);
							}
						}
					});
					
				}
		}).children().show();
		
		
		$('#caller').focus(); // this does not seem to work
		
	},

	render: function() {
		
	},
	
	events: {
		"mouseover .sHide" : "showOpts",
		"mouseout .sHide"  : "hideOpts",
		"click .hideSugg"  : "hideSugg",
		"click .editSugg"  : "editSugg",
		"click .showCaller": "showAllCaller"
	},
	
	showAllCaller: function(e) {
		var callerList = new CallerList(); 
		var caller = $('#callerSugg').text();
		var v = caller.toLowerCase();
		// convert the space to '+'
		v = v.replace(/\s/g, "+");
		
		callerList.url = 'http://jkco.phonelog.ie/api/index.php/caller/'+v;
		callerList.fetch({
			error: function() { console.log(arguments); },
			success: function(e) { 
				if(e.length>0) { 								
					$('.noCallsMessage').fadeOut('slow', function() {
						$('#logTableBody').empty();
						callerListView = new CallerCollectionView({collection: callerList});
						$('.callsTable').fadeIn();
						$('.nCalls').text("");
						var res = "Calls from " + caller;
						$('.gDate').text(res);
					});
				}
			}
		});

	},
	
	editSugg: function(e) {
		var ph = $(e.currentTarget).parent().parent().siblings().children().text();
		ph = ph.replace(/\s/g, "");  // remove all spaces
		var caller = $('#callerSugg').text().toLowerCase();
		caller = caller.replace(/\s/g, "+");
		
		var delNum = new CallerList(); 
		delNum.url = 'http://jkco.phonelog.ie/api/index.php/delbynum/'+ph+"/"+caller;
		delNum.fetch({
			error: function() { console.log(arguments); },
			success: function(data) { 
				$(e.currentTarget).parent().parent().parent().fadeOut(); // need also to remove it from the model so it does not return again in the search.
			}
		});
		
	},
	
	showOpts: function(e) {
		$(e.currentTarget).children().fadeIn().stop(false, true);
	},
	
	hideOpts: function(e) {
		$(e.currentTarget).children().fadeOut().stop(false, true);
	},
	
	hideSugg: function(e) {
		$('.cSuggestions').fadeOut();
		$('#autocomplete').focus();
		e.preventDefault();
		//console.dir(e);
	},
	
	closeModal: function() {
		$("#form-modal").modal("hide");
    },

	saveCall: function() {
		/*var s = this.model.set({
			caller: $('#caller').val(),
			calltime: $('#calltime').val(),
			calldate: $('#calldate_alt').val()
		});
		
		if (s) {
			//this.model.save();
			console.dir(this);
		}*/
		console.dir(this);
		this.closeModal();
	}
	
});

var Item = Backbone.Model.extend({
	initialize: function(e) {
		var m = this.get("caller");
		if (e.caller) {
			//var str = m.replace(/&#039;/g, "'");
			//this.set({caller: str})
		}
		//console.dir(m);
	}
	
});
	
var Items = Backbone.Collection.extend({model: Item, url: 'http://jkco.phonelog.ie/api/index.php/init'});
var sideBar = new SideBarView({});
var topBar = new TopBarView({});

var choices = new Items({});
choices.fetch({ success: function(e) {
	$("#autocomplete").fadeIn();
}});

var selected = new Items({});

selected.bind('add', function(model) {
		//console.log("hi");
	$('#suggestions').empty();

	// iterate
	var nms = model.get('numbers');
	while(nms.charAt(0) == ',')
		nms = nms.substr(1);
	var array = nms.split(',');
	array=_.compact(array);  // underscore function to remove duplicate values
	
	// construct the html
	var cTable;
	cTable = "<table class='cSuggestions table table-condensed'><thead>";
	cTable += "<tr><th id='callerSugg'>";
	cTable += model.get("caller");
	cTable += "</th><th><span class='link'><a href='#' class='showCaller'>show all</a></span></th></tr></thead><tbody>";
	
	if (array.length>0) {
		for (var i = 0; i < array.length; i++) {
			if (array[i]) {
				cTable += "<tr><td><span class='label label-success'>&nbsp;"+array[i]+"</span></td>"
				cTable += "<td class='sHide'><span><a href='#' class='label default'>add</a>&nbsp;<a href='#' class='label important editSugg'>edit</a></span></td></tr>"
				}
		}
	} else {
		cTable += "<tr class='suggNums'><td><span class='label important'>&nbsp;no number</span></td>"
		cTable += "<td><span>&nbsp;<span></td></tr>"
	}
	
	cTable += "</tbody><tfoot><tr><td>"+model.get("countCaller")+"&nbsp;calls</td>";
	cTable += "<td><a href='' class='hideSugg'>close</a></td></tr></tfoot>";
	cTable += "</table>";
	
	$('#suggestions').append(cTable).hide().fadeIn(800);
});
	
var input = new Autocomplete({
	el: '#autocomplete',
	choices: choices,
	selected: selected, // this is the collection we are binding to 
	iterator: function(model, matcher, selected) {
		var data = model.toJSON();
		//var cur = this.input.el.value; console.log(cur);
		return matcher.test(data.caller);
	},
	label: function(model) {
		var data = model.toJSON();
		//return 'Item #' + data.callid + ': ' + data.caller;
		return data.caller + " (" + data.countCaller + ")";
	},
	selValue: function(model) {  
		var data = model.toJSON();
		//console.dir(data);
		//return data.caller;  // the value which is left in the input box after a selection has been made
		selected.add(data);  
		return;
	}
}).render();

	
	
	// this binds the caller element
	var callerSelected = new Items();
	callerSelected.bind('add', function(model) {
		
		var res = $('#numberSuggestions');
		res.empty();
		// iterate through numbers
		var nms = model.get('numbers');
		while(nms.charAt(0) == ',')
			nms = nms.substr(1);
		var array;
		array=_.compact( nms.split(','));
		
		for (var i = 0; i < array.length; i++) {
			if (array[i])
				res
					.prepend($('<li/>').text(" "+array[i])
					.addClass('label default'));
		}

		var resC = $('#companySuggestions');
		resC.empty();
		// iterate through numbers
		var cp = model.get('companies');
		while(cp.charAt(0) == ',')
			cp = cp.substr(1);
		var arraycp = cp.split(',');
		arraycp=_.compact(arraycp);  
		
		for (var i = 0; i < arraycp.length; i++) {
			if (arraycp[i])
				resC
					.prepend($('<li/>').text(" "+arraycp[i])
					.addClass('label default'));
		}

	});
	
/*var callerSelectedInput = new Autocomplete({
	  el: '#caller',
	  choices: choices,
	  selected: callerSelected,
	  iterator: function(model, matcher, selected) {
		var data = model.toJSON();
		return matcher.test(data.caller);
	  },
	  label: function(model) {
		var data = model.toJSON();
		return data.caller;
	  },
	  selValue: function(model) {  
		var data = model.toJSON();
		return data.caller;  // the value which is left in the input box after a selection has been made
		//return;
	  }
	}).render();*/
