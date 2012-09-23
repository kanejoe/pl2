// includes bindings for fetching/fetched

PaginatedCollection = Backbone.Collection.extend({
  initialize: function() {
    _.bindAll(this, 'parseM', 'pageInfo', 'nextPage', 'previousPage', 'changePage', 'layOut');
    this.page = 1; this.perPage = 7;
	this.myCalls = this;
	//const this.COLL_LENGTH = this.myCalls.length; // https://developer.mozilla.org/en/JavaScript/Reference/Statements/const -- limited support
	//console.log(this.myCalls);
	this.parseM(this.models);
	this.layOut(this);
  },
  
  layOut: function() {
	var myCars=new Array(); // regular array 
	var start=0, end=0;
	var start = (this.page*this.perPage)-(this.perPage); 
	var end = Math.min(this.myCalls.length-1, (this.page*this.perPage) ); 
	//console.log("this.perPage: "+this.perPage);
	console.log("this.page: "+this.page);
	/*console.log("this.myCalls.length: "+this.myCalls.length);
	console.log("start: "+start + " /// end: "+end);
	console.log("*******************");
	*/
	for (var i=start;i<=end;i++)
	{
		myCars.push(this.myCalls.at(i)); 
	}
	var newcc = {};
	newcc = new CallsList(myCars); 
	//console.dir(newcc);
	// empty the div first as it keeps adding
	$('#logTableBody').empty();
	courtListView = new CaseCollectionView({collection: newcc});
  },
  
  parseM: function(resp) {
    this.page = 1;
    this.total = resp.length;
    return resp.models;
  },
 
  pageInfo: function() {
    var info = {
      total: this.total,
      page: this.page,
      perPage: this.perPage,
      pages: Math.ceil(this.total / this.perPage),
	  arrPages: _.range(1, Math.ceil(this.total / this.perPage)+1),
      prev: false,
      next: false
    };
	
    var max = Math.min(this.total, this.page * this.perPage);

    if (this.total == this.pages * this.perPage) {
      max = this.total;
    }

    //info.range = [(this.page - 1) * this.perPage + 1, max];
	
    if (this.page > 1) {
      info.prev = this.page - 1;
    }

    if (this.page < info.pages) {
      info.next = this.page + 1;
    }
    return info;
  },
  nextPage: function() {
    this.page = this.page + 1;
	this.layOut();
  },
  previousPage: function() {
    this.page = this.page - 1;
    this.layOut();
  },
  changePage: function(toPage) {
	this.page = parseInt(toPage);
	this.layOut();
	//this.initialize();
	//console.dir(this.pageInfo());
  }

});


PaginatedView = Backbone.View.extend({
	el: $('#pagination'),
  initialize: function() {
    _.bindAll(this, 'previous', 'next', 'render');
    this.collection.bind('change', this.render);
    //this.collection.bind('change', function() { console.dir("changed")});
	
	//this.el.unbind();
	
	this.render();
	//console.dir(this.collection);
	//console.dir(this);
  },
  
  events: {
    'click .prev a'		: 'previous',
    'click .next a'		: 'next',
    'click .curPage a'	: 'changeActive'
  },
  render: function() {
   // console.dir(this.collection.pageInfo());
	//$(this.el).empty();
	//console.log("triggered");
	var tmpl = $("#tmplPagination").render(this.collection.pageInfo());
	//console.dir(tmpl);
	(this.$el).html(tmpl);
	return this;
  },
  
  changeActive: function(e) {
	this.collection.changePage(e.currentTarget.text);
	e.preventDefault();
  },
  
  previous: function() {
    this.collection.previousPage();
    return false;
  },

  next: function() {
    this.collection.nextPage();
    return false;
  },
  
  close: function(){
		this.remove();
		this.unbind();
  }
  
});

//var i = [{"callid":"12693","caller":"Joe Cunnane","calldate":"2012-01-25","calltime":"16:58:00","company":"","message":"call back.","answered_by":"3","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 19:40:36","action":"0"},{"callid":"12692","caller":"Malachy Steenson","calldate":"2012-01-25","calltime":"16:27:00","company":"","message":"He will call you in the morning.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 16:27:51","action":"0"},{"callid":"12690","caller":"Margaret Tarpey","calldate":"2012-01-25","calltime":"16:16:00","company":"Geoffrey Browne & Co","message":"Call her back today...If you call tomorrow or Friday ask for Jean Murphy.","answered_by":"9","phone":"091 568 100","numbers":"091568100","created":"0000-00-00 00:00:00","modified":"2012-01-25 16:17:54","action":"0"},{"callid":"12691","caller":"Darren Peavoy","calldate":"2012-01-25","calltime":"16:16:00","company":"Bannon","message":"checking to see where we were at with the AFL with Tesco.  I said I would update him on Friday if I had\/had not heard back from the other side.","answered_by":"3","phone":"647 7918","numbers":"6477918","created":"0000-00-00 00:00:00","modified":"2012-01-25 16:17:43","action":"0"},{"callid":"12689","caller":"Michael Schofield","calldate":"2012-01-25","calltime":"16:01:00","company":"","message":"he has an issue with some subsidance and wants to look at the advice he was given by the engineer.  He wants me to have a look at this and revert.","answered_by":"3","phone":"086 887 6374","numbers":"0868876374","created":"0000-00-00 00:00:00","modified":"2012-01-25 16:05:21","action":"0"},{"callid":"12688","caller":"Joe O'Connor","calldate":"2012-01-25","calltime":"15:50:00","company":"","message":"He is calling in at 9am on friday morning to sign the loan offer letter.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:51:04","action":"0"},{"callid":"12687","caller":"John Monahan","calldate":"2012-01-25","calltime":"15:47:00","company":"","message":"we are going to meet tomorrow instead.","answered_by":"3","phone":"087 770 8805","numbers":"0877708805","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:48:07","action":"0"},{"callid":"12686","caller":"Joe O'Connor","calldate":"2012-01-25","calltime":"15:44:00","company":"","message":"I updated him re my phone call with AIB.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:45:50","action":"0"},{"callid":"12684","caller":"Claire Reilly","calldate":"2012-01-25","calltime":"15:39:00","company":"","message":"Call her back.  Go ahead with that.  I will ring Malachy now and get in touch tomorrow.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:42:47","action":"0"},{"callid":"12685","caller":"Margaret Tarpey","calldate":"2012-01-25","calltime":"15:39:00","company":"Geoffrey Browne & Co","message":"re: Seamus Greaney - I left a message with her to call me.","answered_by":"3","phone":"091 568 100","numbers":"091568100","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:40:53","action":"0"},{"callid":"12683","caller":"Claire Reilly","calldate":"2012-01-25","calltime":"15:29:00","company":"","message":"Michael still has not heard from his solicitor.  I suggested that she advise him to look at another solicitor.","answered_by":"3","phone":"085 834 1808","numbers":"0858341808","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:33:35","action":"0"},{"callid":"12682","caller":"Mary","calldate":"2012-01-25","calltime":"15:10:00","company":"AIB","message":"Re O12 they are waiting on the following:\r\nDirect Debit Mandate\r\nHome Insurance\r\nLetter of offer\r\nLetter requesting funds.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:11:45","action":"0"},{"callid":"12681","caller":"Kate Dineen","calldate":"2012-01-25","calltime":"15:09:00","company":"A & L Goodbody","message":"re: T41 and the Galteemore\/Certus transaction.  She noted that there are participation and section 29 issues as well as a corporate benefit issue.  It has all been highlighted in the loan offer.  She asked if I could email her some initial details.","answered_by":"3","phone":"649 2345","numbers":"6492345","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:11:44","action":"0"},{"callid":"12680","caller":"Joe O'Connor","calldate":"2012-01-25","calltime":"14:38:00","company":"","message":"He said he would drop over to Barry Fitzsimons to get the loan offer signed.  He asked me to send him on a draft fee note.","answered_by":"3","phone":"087 610 7844","numbers":"0876107844","created":"0000-00-00 00:00:00","modified":"2012-01-25 14:40:19","action":"0"},{"callid":"12679","caller":"Jenny","calldate":"2012-01-25","calltime":"14:26:00","company":"AIB","message":"She said to email homemortgages@aib.ie requesting a copy letter of loan offer.","answered_by":"9","phone":"1890 252 008","numbers":"1890252008","created":"0000-00-00 00:00:00","modified":"2012-01-25 15:46:19","action":"0"},{"callid":"12678","caller":"Ross Philips","calldate":"2012-01-25","calltime":"12:23:00","company":"HG Donnelly","message":"re: P14 and his clients Gordon Allard and Arlene Butler and 16 Lake Avenue.  He is  waiting on BoI to issue him with the loan pack.","answered_by":"3","phone":"059 863 1284","numbers":"0598631284","created":"0000-00-00 00:00:00","modified":"2012-01-25 12:26:53","action":"0"},{"callid":"12677","caller":"Baskaran","calldate":"2012-01-25","calltime":"11:56:00","company":"","message":"Call him back.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 11:57:10","action":"0"},{"callid":"12676","caller":"Liam Tedford","calldate":"2012-01-25","calltime":"11:18:00","company":"","message":"he can meet at 11.30 tomorrow in this office.","answered_by":"3","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 11:18:26","action":"0"},{"callid":"12675","caller":"Stephen Moore","calldate":"2012-01-25","calltime":"11:12:00","company":"","message":"they are away next week and asked if I could update him on the sale via his hotmail address.","answered_by":"3","phone":"086 3307 404","numbers":"0863307404","created":"0000-00-00 00:00:00","modified":"2012-01-25 11:15:10","action":"0"},{"callid":"12674","caller":"John Hamill","calldate":"2012-01-25","calltime":"11:07:00","company":"","message":"call back.","answered_by":"3","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 11:07:57","action":"0"},{"callid":"12673","caller":"Niamh","calldate":"2012-01-25","calltime":"11:02:00","company":"","message":"I let her know that we had the letter of offer but it was not executed,I asked her to to arrange for Joseph to execute it. she is going to check with Barry but thinks that it should be fine.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 11:04:33","action":"0"},{"callid":"12672","caller":"Liam Tedford","calldate":"2012-01-25","calltime":"10:53:00","company":"","message":"he said that he is available for a consultation tomorrow with Alison McIntyre.  I said that I would ring him back with a time.","answered_by":"3","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 10:55:03","action":"0"},{"callid":"12671","caller":"Niamh","calldate":"2012-01-25","calltime":"10:41:00","company":"Barry Fitzsimons Secretary","message":"She wanted to know if we had the letter of offer signed by Joseph. I said we would call her back","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 10:43:05","action":"0"},{"callid":"12670","caller":"Niamh","calldate":"2012-01-25","calltime":"10:34:00","company":"Barry Fitzsimons Secretary","message":"I let her know we would be sending in a letter to AIB requesting a cheque for next tues Jan 31. She also wanted to know about the signed letter of offer.","answered_by":"9","phone":"","numbers":"","created":"0000-00-00 00:00:00","modified":"2012-01-25 10:36:15","action":"0"},{"callid":"12669","caller":"Niamh","calldate":"2012-01-25","calltime":"10:09:00","company":"Barry Fitzsimons Secretary","message":"Re Joe O&#039;Connor she emailed AIB a letter of indemnity  and Direct debit mandate this morning and wants to know when we will send in a cheque request. Call her back.","answered_by":"9","phone":"045 438 438","numbers":"045438438","created":"0000-00-00 00:00:00","modified":"2012-01-25 10:13:47","action":"0"},{"callid":"12668","caller":"Margaret","calldate":"2012-01-25","calltime":"09:32:00","company":"Northern Cross Dental","message":"I let her know that we had received a promissory note from Joe Daly along with a request for a standing order and told her we would put a copy of them in the post to her. She also said she would send us  an email with a list of outstanding debts.","answered_by":"9","phone":"867 3100","numbers":"8673100","created":"0000-00-00 00:00:00","modified":"2012-01-25 09:39:20","action":"0"}];
//var pagColl = new PaginatedCollection(i); 
//var pag = new PaginatedView({collection: pagColl});

//console.dir(pagColl);
