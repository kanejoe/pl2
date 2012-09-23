

var AddEditView = Backbone.View.extend({
    tagName: "form",
    template: $("#add-edit-template"),

    events: {
      "click #save": "saveModel",
      "click .cancel": "cancel"
    },

    initialize: function(options){
		this.router = options.router;
		this.model.bind("error", this.error, this);
	},

	serialize : function() {
		return {
			caller		: this.$("#caller").val(),
			company		: this.$("#company").val(),
			phone		: this.$("#phone").val(),
			calltime	: this.$("#ctimenozero").val(),
			ctime		: this.model.convTime(this.$("#calldate").val() + " " + this.$("#ctimenozero").val()),
			cdate		: this.$("#cdate").val(),
			calldate	: this.$("#calldate").val(),
			callDir		: this.$("#callDir").val(),
			sendemail	: this.$("#sendemail").val(),
			message		: this.$("#message").val()
		};
	},
	
	error: function(model, errors) {
		
		$.each(errors, function(attr, message) {
			$('#' + attr).addClass('error');
			$('#' + attr).siblings('label').empty().append( attr + " - " + message[0] );
		});
		
	},
		
    cancel: function(e){
		e.preventDefault();
		this.trigger("cancelled");
		//this.model.restore();
		this.close();
    },

    saveModel: function(e){
		e.preventDefault();
		
		//this.model.validate();
		var attrs = this.serialize();
		//console.log(attrs);
		
		if (this.model.set(attrs)) {
			this.trigger("saved");
			this.close();
		} else {
			//console.log("error");
		}
		
    },

    close: function(){
		this.trigger("close");
    },

    render: function(){
		var html = this.template.render(this.model.toJSON());
		$(this.el).html(html);
		
		// put the datepicker in the call date field
		this.$el.find('#cdate').datepicker({ 	dateFormat: 'd MM yy', altField: "#calldate", altFormat: "yy-mm-dd",
												maxDate: '+0d',
												showAnim: 'slideDown'
		}).children().show();
		
		
		this.afterRender();
		return this;
    },
	
	afterRender: function() {
		var tx = this.$el.find('#message');		
		tx.autoResize({
			animate : false,
			extraSpace : 10
		});
	}
	
  });
  
  //var addEditView = new AddEditView({model: Call});