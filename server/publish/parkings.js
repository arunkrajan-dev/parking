Meteor.publish("parking_list", function() {
	return Parkings.find({ownerId:this.userId}, {sort:[["title","desc"]]});
});

Meteor.publish("parking_empty", function() {
	return Parkings.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("parking_details", function(parkingId) {
	return Parkings.find({_id:parkingId,ownerId:this.userId}, {});
});

