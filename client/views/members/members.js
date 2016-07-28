var pageSession = new ReactiveDict();

Template.Members.rendered = function() {
	
};

Template.Members.events({
	
});

Template.Members.helpers({
	
});

var MembersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("MembersViewSearchString");
	var sortBy = pageSession.get("MembersViewSortBy");
	var sortAscending = pageSession.get("MembersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["_id", "name", "rfid", "token", "mobile"];
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

var MembersViewExport = function(cursor, fileType) {
	var data = MembersViewItems(cursor);
	var exportFields = ["_id", "name", "rfid", "token", "mobile"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.MembersView.rendered = function() {
	pageSession.set("MembersViewStyle", "table");
	
};

Template.MembersView.events({
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
				pageSession.set("MembersViewSearchString", searchString);
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
					pageSession.set("MembersViewSearchString", searchString);
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
					pageSession.set("MembersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("members.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		MembersViewExport(this.member_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		MembersViewExport(this.member_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		MembersViewExport(this.member_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		MembersViewExport(this.member_list, "json");
	}

	
});

Template.MembersView.helpers({

	"insertButtonClass": function() {
		return Members.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.member_list || this.member_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.member_list && this.member_list.count() > 0;
	},
	"isNotFound": function() {
		return this.member_list && pageSession.get("MembersViewSearchString") && MembersViewItems(this.member_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("MembersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("MembersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("MembersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("MembersViewStyle") == "gallery";
	}

	
});


Template.MembersViewTable.rendered = function() {
	
};

Template.MembersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("MembersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("MembersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("MembersViewSortAscending") || false;
			pageSession.set("MembersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("MembersViewSortAscending", true);
		}
	}
});

Template.MembersViewTable.helpers({
	"tableItems": function() {
		return MembersViewItems(this.member_list);
	}
});


Template.MembersViewTableItems.rendered = function() {
	
};

Template.MembersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("members.details", {memberId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Members.update({ _id: this._id }, { $set: values });

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
						Members.remove({ _id: me._id });
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
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("members.edit", {memberId: this._id});
		return false;
	}
});

Template.MembersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Members.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Members.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
