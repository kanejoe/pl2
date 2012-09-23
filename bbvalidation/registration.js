// Basic page for the registration page
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function() {

    $(".errorsection").each(function() {
        $(this).hide();
    });

    // Model
    var RegisterUser = Backbone.Model.extend({
        //urlRoot : '/users',
		defaults: {
			calldate : "17 January 2012",
			calldate_alt : "2012-01-17",
			playername : "Tim Tebow",
			email : "TimTebow@broncos.com"
		},
		
        validate : {
			playername : {
                required : true,
                pattern : /[a-zA-Z]+/,
                minlength : 4,
                maxlength : 100
            },
			 email : {
                type : "email"
            },
			calldate_alt : {
				type : "mysql-date"
			}
        },

        initialize : function() {
			//console.dir(this);
        }
    });

    var register = new RegisterUser();

    //View
    RegisterView = Backbone.View.extend({
        el : "#registration_form",
		
        initialize : function() {
			Backbone.ModelBinding.bind(this);
            this.model.bind("error", this.error);
            this.model.bind("update", this.update);
			
			$('#calldate').datepicker({ 	dateFormat: 'd MM yy',
											altField: "#calldate_alt",
											altFormat: "yy-mm-dd",
											maxDate: '+0d',
											showAnim: 'slideDown'
			
			}).children().show();
			
			var countryList = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
				$("#playername").autocomplete({
					source: countryList
				});
			
        },
		render: function() {
		},
		
        events : {
            "click input[type=button]" : "register",
        },

        register : function(event) {
			var n = this.model.set({
				playername: 	"444",
				email: 			"eeejkdo.ie",
				calldate_alt:	"2011-02-29"
			});
			
			// if (n) -- can save here.
			
        },
		
        error : function(model, errors) {
            //show the errors in each function
            $.each(errors, function(attr, message) {
				$('#' + attr +  '_error').empty();
				$('#' + attr +  '_error').fadeIn().append('<span>'+message+'</span>').delay(1800).fadeOut(400);
				//console.dir(message);
            });

			//console.dir(errors);
        },
        
        update :function (){
             $('.error').removeClass('error');
        }
    });

    // The initialize function is always called when instantiating a Backbone View.
    // Consider it the constructor of the class.
    var register_view = new RegisterView({
        model : register
    });
	
	
	// http://jqueryui.com/demos/autocomplete/#custom-data
	var Autocomplete = Backbone.View.extend({
	  render: function() {
		var choices = this.options.choices,
			selected = this.options.selected,
			iterator = this.options.iterator,
			label = this.options.label,
			allowDupes = this.options.allowDupes,
			selValue = this.options.selValue,
			$el = $(this.el); //console.dir(label);
		$el.autocomplete({
		  minLength: 0,
		  source: function(request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');  
			response(choices.filter(function(model) {
			  return iterator(model, matcher);
			}));
		  },
		  focus: function(event, ui) {
			$el.val(label(ui.item));
			return false;
		  },
		  select: function(event, ui) {
			selected.add(ui.item);  //console.dir(choices);
			/*if (!allowDupes) {
			  choices.remove(ui.item);
			}*/
			//$el.val(''); console.dir(ui.item.get("name"));
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

	var Item = Backbone.Model.extend({
	initialize: function(e) {
			var m = this.get("caller");
			if (e.caller) {
				var str = m.replace(/&#039;/g, "'");
				this.set({caller: str})
			}
		}
	}),
		Items = Backbone.Collection.extend({model: Item, url: 'http://jkco.phonelog.ie/api/index.php/init'});

	var choices = new Items({
		
	});
	choices.fetch({ success: function(e) {
            // this is now global
            //setTimeout(this.update, 5000);
			console.dir("now loaded");
			$("#autocomplete").fadeIn();
        }});
	
	
	choices.comparator = function(chapter) {
	  return chapter.get("countCaller");
	};
	//console.dir(choices);
	// http://jkco.phonelog.ie/api/index.php/init
	
	
	var selected = new Items();
	selected.bind('add', function(model) {
	  $('#selected').prepend($('<li/>').text(model.get('caller')));
	  $('#numbers').prepend($('<li/>').text(model.get('numbers')).addClass('label success'));
	  $('#companies').prepend($('<li/>').text(model.get('companies')).addClass('label warning'));
	});

	var input = new Autocomplete({
	  el: '#autocomplete',
	  choices: choices,
	  selected: selected,
	  iterator: function(model, matcher, selected) {
		var data = model.toJSON();
		return matcher.test(data.caller);
	  },
	  label: function(model) {
		var data = model.toJSON();
		//return 'Item #' + data.callid + ': ' + data.caller;
		return data.caller + " (" + data.countCaller + ")";
	  },
	  selValue: function(model) {  
		var data = model.toJSON();
		return data.caller;  // the value which is left in the input box after a selection has been made
	  }
	}).render();
	
	
	
	$('input').customInput();
	
	$('.toggle').each(function(){
		$('div:first',this).addClass('first');
		$('div:last',this).addClass('last');	
	}); 
	
	
});



				