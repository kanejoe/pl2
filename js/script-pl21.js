SimpleBBModule = (function($){
  var Item = Backbone.Model.extend({
    initialize: function(){
      this.memento = new Backbone.Memento(this);
      this.store = this.memento.push;
      this.restore = this.memento.pop;
    },

    destroy: function(){
      this.collection.remove(this);
    }

  });

  var ItemCollection = Backbone.Collection.extend({
    model: Item,

    initialize: function(){
      this.bind("add", this.itemAdded);
    },

    itemAdded: function(model){
      var id = this.length;
      model.id = id;
      model.set({id: id});
    }
  });

  var AddEditView = Backbone.View.extend({
    tagName: "form",
    template: $("#add-edit-template"),

    events: {
      "click #save": "saveModel",
      "click #cancel": "cancel"
    },

    initialize: function(options){
      this.router = options.router;
    },

    cancel: function(e){
      e.preventDefault();
      this.trigger("cancelled");
      this.model.restore();
      this.close();
    },

    saveModel: function(e){
      e.preventDefault();
      this.trigger("saved");
      this.close();
    },

    close: function(){
      this.trigger("close");
    },

    render: function(){
      this.model.store();
      var html = this.template.render(this.model.toJSON());
      $(this.el).html(html);
     // Backbone.ModelBinding.call(this);
      return this;
    }
  });

  var ListView = Backbone.View.extend({
    template: $("#list-template"),

    renderItem: function(item){
      var itemView = new ItemView({model: item});
      this.list.append(itemView.render().el);
    },

    render: function(){
      var html = this.template.render();
      $(this.el).append(html);

      this.list = this.$("#list");
      this.collection.each(this.renderItem, this);

      return this;
    }
  });

  var ItemView = Backbone.View.extend({
    tagName: "li",
    template: $("#item-template"),

    events: {
      "click .delete": "destroy"
    },

    destroy: function(){
      this.model.destroy();
      this.unbind();
      this.remove();
    },

    render: function()
    {  
      var html = this.template.render(this.model.toJSON());
      $(this.el).html(html);
      //Backbone.ModelBinding.call(this);
      return this;
    }
  });

  var AppView = Backbone.View.extend({
    el: $("#app-view"),

    showView: function(view){
      var closingView = this.view;

      this.view = view;
      this.view.render();
      $(this.view.el).hide();
      this.el.append(this.view.el);

      this.openView(this.view);
      this.closeView(closingView);
    },

    openView: function(view){
      $(view.el).slideToggle(500);
    },

    closeView: function(view){
      if (view){
        view.unbind();
        $(view.el).slideToggle(500, function(){
          $(this).remove();
        });
      }
    }
  });

  var ItemRouter = Backbone.Router.extend({
    formAddEditEl: $("#add-edit-form"),

    routes: {
      "": "index",
      "/new": "add",
      "/edit/:id": "edit",
    },

    initialize: function(options){
      this.collection = options.collection;
      this.appView = options.appView;
    },

    index: function(){
      var listView = new ListView({collection: this.collection});
      this.appView.showView(listView);
    },

    add: function(){
      this._addEditItem(new Item());
    },

    edit: function(id){
      var item = this.collection.get(id);
      this._addEditItem(item);
    },

    _addEditItem: function(item){
      var addEditView = new AddEditView({model: item});

      addEditView.bind("saved", function(){
        if (item.isNew()){
          this.collection.add(item);
        }
      }, this);

      addEditView.bind("close", function(){
        this.navigate("", true);
      }, this);

      this.appView.showView(addEditView);
    },
  });

  return {
    Application: function(initialItems){
      return {
        start: function(){
          var itemCollection = new ItemCollection(initialItems);
          var appView = new AppView();
          var itemRouter = new ItemRouter({collection: itemCollection, appView: appView});
          Backbone.history.start();
        }
      }
    }
  }
    });