this.ParkingsInsertController = RouteController.extend({
	template: "ParkingsInsert",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("parking_empty"),
			Meteor.subscribe("parking_list")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			parking_empty: Parkings.findOne({_id:null}, {}),
			parking_list: Parkings.find({}, {sort:[["title","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});