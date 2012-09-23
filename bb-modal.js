$(function($) {

    Contact = Backbone.Model.extend({
        defaults: {
            first_name: "John",
            last_name: "Smith",
            address: "123 Main St"
        }
    });

    Contacts = Backbone.Collection.extend({
        model: Contact,

       localStorage: new Store("contacts")
    });

    ContactRow = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, "render");
            this.template = _.template($("#contact-row").html());
        },
       
        tagName: 'tr',

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    ContactsView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, "render", "closeModal", "saveContact");
            $("#my-modal").modal({
                "backdrop": true
            });
            $("button#save-contact").bind("click", this.saveContact);
            this.headerTemplate = $("#contacts-table-header").html();
            this.collection.bind("add", this.renderContact, this);
            this.collection.bind("add", this.closeModal, this);
        },
        
        tagName: 'table',

        render: function() {
            $(this.el).html(this.headerTemplate);

            this.collection.each(function(contact) {
                this.renderContact(contact);
            }, this);

            return this;
        },

        renderContact: function(contact) {
            var contactView = new ContactRow({
                model: contact
            });
            $(this.el).append(contactView.render().el);
        },

        closeModal: function() {
            $("#my-modal").modal("hide");

        },

        saveContact: function() {
            var first = $("#first-name-input").val();
            var last = $("#last-name-input").val();
            var address = $("#address-input").val();
            this.collection.create({
                first_name: first,
                last_name: last,
                address: address
            });

            this.closeModal();
        },


    });




    //************* Kick some things off **************

    $(function() {
        // Create a 'contacts' collection
        contacts = new Contacts();

        // Create the main app view - which is ContactsView for now
        var view = new ContactsView({
            collection: contacts
        });
        $("body").append(view.render().el);


    });




}, jQuery);