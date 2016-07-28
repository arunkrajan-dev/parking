this.MembersInsertController = RouteController.extend({
	template: "MembersInsert",
	

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
			Meteor.subscribe("member_empty"),
			Meteor.subscribe("member_list")
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
			member_empty: Members.findOne({_id:null}, {}),
			member_list: Members.find({}, {sort:[["title","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});