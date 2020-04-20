var budgetController = (function() {

})();


var IUController = (function() {

})();



var controller = (function(front,back) {

	var controlAddItem = function() {
		//1. Get the filled input data

		//2. Add the item to the budget controller

		//3. Add the item to the UI

		//4. Calculate the budget

		//5. Display the budget on the UI
	}

	document.querySelector('.add__btn').addEventListener('click', controlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keyCode === 13 || event.which === 13) {
			controlAddItem();
		}
	});

})(IUController, budgetController);