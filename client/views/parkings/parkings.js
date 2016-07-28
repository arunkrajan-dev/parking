var pageSession = new ReactiveDict();

Template.Parkings.rendered = function() {
	
};

Template.Parkings.events({
	
});

Template.Parkings.helpers({
	
});

var ParkingsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ParkingsViewSearchString");
	var sortBy = pageSession.get("ParkingsViewSortBy");
	var sortAscending = pageSession.get("ParkingsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["_id", "name", "device", "status"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var ParkingsViewExport = function(cursor, fileType) {
	var data = ParkingsViewItems(cursor);
	var exportFields = ["_id", "name", "device", "status"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ParkingsView.rendered = function() {
	pageSession.set("ParkingsViewStyle", "table");
	
};

Template.ParkingsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("ParkingsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("ParkingsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("ParkingsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("parkings.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ParkingsViewExport(this.parking_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ParkingsViewExport(this.parking_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ParkingsViewExport(this.parking_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ParkingsViewExport(this.parking_list, "json");
	}

	
});

Template.ParkingsView.helpers({

	"insertButtonClass": function() {
		return Parkings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.parking_list || this.parking_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.parking_list && this.parking_list.count() > 0;
	},
	"isNotFound": function() {
		return this.parking_list && pageSession.get("ParkingsViewSearchString") && ParkingsViewItems(this.parking_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ParkingsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ParkingsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ParkingsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ParkingsViewStyle") == "gallery";
	}

	
});


Template.ParkingsViewTable.rendered = function() {
	
};

Template.ParkingsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ParkingsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ParkingsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ParkingsViewSortAscending") || false;
			pageSession.set("ParkingsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ParkingsViewSortAscending", true);
		}
	}
});

Template.ParkingsViewTable.helpers({
	"tableItems": function() {
		return ParkingsViewItems(this.parking_list);
	}
});


Template.ParkingsViewTableItems.rendered = function() {
	
};

Template.ParkingsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Parkings.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Parkings.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click .fill-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Fill? Please confirm?",
			title: "Fill Parking",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Parkings.update({ _id: me._id }, {$set:{status: "1"}});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click .free-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Free? Please confirm?",
			title: "Free Parking",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Parkings.update({ _id: me._id }, {$set:{status: "0"}});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click .assign-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Assign? Please confirm?",
			title: "Assign Parking",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Parkings.update({ _id: me._id }, {$set:{status: "2"}});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}	
});

Template.ParkingsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Parkings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Parkings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"statusColor": function(status) {
		if (status == "0") {
			return "text-success";
		} 
		if (status == "1") {
			return "text-danger";
		}
		if(status == "2") {
			return "text-warning";
		}
	},
	"statusText": function(status) {
		if (status == "0") {
			return "Available";
		} 
		if (status == "1") {
			return "Full";
		}
		if(status == "2") {
			return "Assigned";
		}
	},
	
	"statusChk": function(a, b) {
		if (a == b) {
			return true;
		} else {
			return false;
		}
	}
});
