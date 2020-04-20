var budgetController = (function() {

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

	var DOM = UICtrl.getDOMstrings();

	var controlAddItem = function() {

		//1. Get the filled input data
		var input = UICtrl.getInput();
		console.log(input);

		//2. Add the item to the budget controller

		//3. Add the item to the UI

		//4. Calculate the budget

		//5. Display the budget on the UI
	}

	document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keyCode === 13 || event.which === 13) {
			controlAddItem();
		}
	});

})(UIController, budgetController);