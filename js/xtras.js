defaults: function() {
		var now = new Date();

		return {
			caller		: "Rhona Kane",
			calldate	: dateFormat(now, "yyyy-mm-dd"),
			cdate		: dateFormat(now, "d mmmm yyyy"),
			ctimenozero	: dateFormat(now, "H:MM"),
			calltime	: dateFormat(now, "H:MM:ss"),
			message		: "call back",
			phone		: "286 8387"
		};
		
	},
	
	
	<script type="text/x-jquery-tmpl" id="add-edit-template">
	<div class="well aeForm">
		<a class="close closeForm">&times;</a>
		<div class="input-prepend">
			<div><label for="cdate" class="add-on">Date</label>
			<input id="cdate" type="text" class="span2" value="{{=cdate}}"></div>
			
			<div><label for="ctimenozero" class="add-on">@</label>
			<input class="span1" id="ctimenozero" size="16" type="text" value="{{=ctimenozero}}"></div>
		</div>
		
		<label for="caller" class="">Caller</label><input type="text" id="caller" value="{{=caller}}"><br/>
		<label for="phone" class="">Number</label><input type="text" id="phone" value="{{=phone}}"><br/><br/>
		
		<legend>Staff</legend>
		<input type="checkbox" name="genre" id="action" value="action" />
		<label for="action">Action / Adventure</label>

		<input type="checkbox" name="genre" id="comedy" value="comedy" />
		<label for="comedy">Comedy</label>

		<input type="checkbox" name="genre" id="check-3" value="epic" />
		<label for="check-3">Epic / Historical</label>
		
		<a href="#" class="closeForm" id="cancel">&times; Cancel</a>&nbsp; <input type="button" id="save" value="Save" class="btn btn-info">
  </div>
</script>


.label { text-transform: capitalize !important;}