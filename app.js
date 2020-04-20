var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp : [],
			inc : []
		},
		totals : {
			exp : 0,
			inc : 0
		}
	};

})();



var UIController = (function() {

	var DOMstrings = {
		inpuType : '.add__type',
		inputDescription : '.add__description',
		inputValue : '.add__value',
		inputButton : '.add__btn'
	}


	return {
		getInput : function() {
			return {
				type : document.querySelector(DOMstrings.inpuType).value, // Will be inc or exp
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : document.querySelector(DOMstrings.inputValue).value
			}
		},

		getDOMstrings : function() {
			return DOMstrings;
		}
	}

})();



var controller = (function(UICtrl, budgetCtrl) {

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);

		document.addEventListener('keypress', function(event) {
			if(event.keyCode === 13 || event.which === 13) {
				controlAddItem();
			}
		});
	}

	var controlAddItem = function() {

		//1. Get the filled input data
		var input = UICtrl.getInput();
		console.log(input);

		//2. Add the item to the budget controller

		//3. Add the item to the UI

		//4. Calculate the budget

		//5. Display the budget on the UI
	}

	return {
		run : function() {
			setupEventListeners();
		}
	}

})(UIController, budgetController);

controller.run();