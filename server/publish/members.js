Meteor.publish("member_list", function() {
	return Members.find({ownerId:this.userId}, {sort:[["title","desc"]]});
});

Meteor.publish("member_empty", function() {
	return Members.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("member_details", function(memberId) {
	return Members.find({_id:memberId,ownerId:this.userId}, {});
});

