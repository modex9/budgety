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

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(item) {
			sum += item.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp : [],
			inc : []
		},
		totals : {
			exp : 0,
			inc : 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem : function(type, desc, value) {
			var newItem, id, allItems;

			// create ID
			allItems = data.allItems[type];
			if(allItems.length > 0)
				id = allItems[allItems.length - 1].id + 1;
			else id = 0;

			// create either expense or a income
			if(type === 'exp') {
				newItem = new Expense(id, desc, value);
			}
			else if(type === 'inc') {
				newItem = new Income(id, desc, value);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},

		calculateBudget: function(type) {
			// Calculate total income and expenses
			calculateTotal(type);
			// Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			// Calculate the percentage of income that we spent
			if(data.totals.inc > 0)
				data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
		},

		getBudget : function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		}
	};

})();



var UIController = (function() {

	var DOMstrings = {
		inpuType : '.add__type',
		inputDescription : '.add__description',
		inputValue : '.add__value',
		inputButton : '.add__btn',
		incomeContainer : '.income__list',
		expensesContainer : '.expenses__list'
	}


	return {
		getInput : function() {
			return {
				type : document.querySelector(DOMstrings.inpuType).value, // Will be inc or exp
				description : document.querySelector(DOMstrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem : function(obj, type) {
			var html, element;

			if(type === 'inc') {
					element = DOMstrings.incomeContainer;
					html = `<div class="item clearfix" id="income-${obj.id}">` +
	                            `<div class="item__description">${obj.description}</div>` +
	                            '<div class="right clearfix">' +
	                                `<div class="item__value">${obj.value}</div>` +
	                                '<div class="item__delete">' +
	                                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
	                                '</div>' +
	                            '</div>' +
	                  		'</div>';
			}

			else if (type === 'exp') {
					element = DOMstrings.expensesContainer;
					html = `<div class="item clearfix" id="expense-${obj.id}">` +
								`<div class="item__description">${obj.description}</div>` +
			                    '<div class="right clearfix">' +
			                        `<div class="item__value">${obj.value}</div>` +
		                            '<div class="item__percentage">21%</div>' +
			                            '<div class="item__delete">' +
			                                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
			                 			'</div>' +
			                	'</div>' +
				            '</div>';
			}

			// Insert either expense or an income to the DOM
			document.querySelector(element).insertAdjacentHTML('beforeEnd', html);

		},

		clearFields : function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +
				DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(item, i, array) {
				item.value = '';
			});
		},

		getDOMstrings : function() {
			return DOMstrings;
		}
	}

})();



var controller = (function(UICtrl, budgetCtrl) {

	var input;

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);

		document.addEventListener('keypress', function(event) {
			if(event.keyCode === 13 || event.which === 13) {
				controlAddItem();
			}
		});
	}


	var updatebudget = function() {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget(input.type);
		// 2. Return budget
		var budget = budgetCtrl.getBudget();
		// 3. Display the budget on the UI
	}

	var controlAddItem = function() {
		var newItem;

		// 1. Get the filled input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI

			UICtrl.addListItem(newItem, input.type);
			UICtrl.clearFields();

			// 4. Calculate and update budget
			updatebudget();

		}
	}

	return {
		run : function() {
			setupEventListeners();
		}
	}

})(UIController, budgetController);

controller.run();