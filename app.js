// BUDGET CONTROLLER
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // CREATE NEW ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1
      } else {
        ID = 0;
      }

      // CREATE NEW ITEM BASED ON INC OR EXP
      if (type === 'exp') {
        newItem = new Expense(ID, des, val)
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val)
      }
      //PUSH ON ARRY
      data.allItems[type].push(newItem);
      return newItem;
    }
  };

})();

// UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContiner: ".expenses__list"
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function (obj, type) {
      var html, newHTML, element;
      //CREATE HTML STRING WITH PLACEHOLDER
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expenseContiner;
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //REPLACE PLAYHOLDER TEXT WITH ACTUAL DATA
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      //INSERTTHE HTML INTO THE DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

    },
    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controler = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.with === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1 get field input data
    input = UICtrl.getinput();
    // 2 add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

    // 3 add the item to the UI
    UICtrl.addListItem(newItem, input.type)
    // 4 Calculate the budget
    // 5 display the budget on UI
  };
  return {
    init: function () {
      console.log("started");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controler.init();