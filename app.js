var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0)
			this.percentage = Math.round(this.value / totalIncome * 100);
		else this.percentage = -1;
	}

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

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

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(item) {
				item.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPercentages = data.allItems.exp.map(function(item) {
				return item.getPercentage();
			});
			return allPercentages;
		},

		getBudget : function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		deleteItem : function(type, id) {
			var ids, index;
			var ids = data.allItems[type].map(function(item) {
				return item.id;
			});

			index = ids.indexOf(id);

			if(index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		testing : function() {
			return data;
		}
	};

})();



var UIController = (function() {

	var DOMstrings = {
		inpuType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
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
					html = `<div class="item clearfix" id="inc-${obj.id}">` +
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
					html = `<div class="item clearfix" id="exp-${obj.id}">` +
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

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
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

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}
			else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	}


	var updatebudget = function(type) {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget(type);
		// 2. Return budget
		var budget = budgetCtrl.getBudget();
		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {

		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();
		// 2. Readepercentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		// 3. Update the UI with new percentages

	}

	var controlAddItem = function() {
		var input, newItem;

		// 1. Get the filled input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI

			UICtrl.addListItem(newItem, input.type);
			UICtrl.clearFields();

			// 4. Calculate and update budget
			updatebudget(input.type);

			// 5. Calculate and update percentages

			updatePercentages();

		}
	};

	var ctrlDeleteItem = function(event) {
		var itemId, splitID, type, ID;

		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemId) {

			splitID = itemId.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete the item from the data structure

			budgetController.deleteItem(type, ID);

			// 2. Delete the item from the UI

			UICtrl.deleteListItem(itemId);

			// 3. Update and show new budget

			updatebudget(type);

			// 4. Calculate and update percentages

			updatePercentages();
		}

	};

	return {
		run : function() {
			setupEventListeners();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			budgetController.testing();
		}
	}

})(UIController, budgetController);

controller.run();