var pageSession = new ReactiveDict();

Template.ParkingsInsert.rendered = function() {
	
};

Template.ParkingsInsert.events({
	
});

Template.ParkingsInsert.helpers({
	
});

Template.ParkingsInsertInsertForm.rendered = function() {
	

	pageSession.set("parkingsInsertInsertFormInfoMessage", "");
	pageSession.set("parkingsInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ParkingsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("parkingsInsertInsertFormInfoMessage", "");
		pageSession.set("parkingsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var parkingsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(parkingsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("parkingsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("parkings");
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("parkingsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Parkings.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("parkings", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ParkingsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("parkingsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("parkingsInsertInsertFormErrorMessage");
	}
	
});
