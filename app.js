// BUDGET CONTROLLER
var budgetController = (function() {
  ///////
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controler = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.with === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    // 1 get field input data
    var input = UICtrl.getinput();
    console.log(input);
    // 2 add the item to the budget controller
    // 3 add the item to the UI
    // 4 Calculate the budget
    // 5 display the budget on UI
  };
  return {
    init: function() {
      console.log("started");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controler.init();
