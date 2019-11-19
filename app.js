// BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentages = function() {
    return this.percentage;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // CREATE NEW ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // CREATE NEW ITEM BASED ON INC OR EXP
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      //PUSH ON ARRY
      data.allItems[type].push(newItem);
      return newItem;
    },
    deliteItem: function(type, id) {
      var ids, index;
      // id =3
      // data.allItems[type][]

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      // CALCULATE TOTAL INCOME AND EXPENSE
      calculateTotal("exp");
      calculateTotal("inc");
      // CLACULATE BUDGET: INCOME - EXPENSE
      data.budget = data.totals.inc - data.totals.exp;
      // CALCULATE THE PERCENTAGE OF INCOME THAT WE SPEND
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentages();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totoalExpense: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContiner: ".expenses__list",
    budgetLabel: ".budget__value",
    IncTotal: ".budget__income--value",
    ExpTotal: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHTML, element;
      //CREATE HTML STRING WITH PLACEHOLDER
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContiner;
        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //REPLACE PLAYHOLDER TEXT WITH ACTUAL DATA
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);

      //INSERTTHE HTML INTO THE DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el); // DELETE CHILD CLASNAME LITTLE WIRD
    },
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDesc + ", " + DOMstrings.inputValue
      ); // LIKE CSS CLASS, NEXT CLASS

      fieldsArr = Array.prototype.slice.call(fields); //CHANGE FOR A ARRAY
      fieldsArr.forEach(function(current) {
        ///CURENT IS A JS FUNCTION DEFINITE CONTENT
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.IncTotal).textContent = obj.totalIncome;
      document.querySelector(DOMstrings.ExpTotal).textContent =
        obj.totoalExpense;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var UpdateBudget = function() {
    // 1 Calculate the budget
    budgetCtrl.calculateBudget();
    // 2 return the budget
    var budget = budgetCtrl.getBudget();
    // 3 display the budget on UI
    UICtrl.displayBudget(budget);
  };

  // UPDATE PERCENTAGES ON THE EVERY ELEMENT IN THE LIST

  var updatePercentage = function() {
    // calculate percentage
    budgetCtrl.calculatePercentage();
    // read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    //update the ui with the new percentages
    console.log(percentages);
  };

  // ADD ITEMS ON THE LIST

  var ctrlAddItem = function() {
    var input, newItem;

    // 1 get field input data
    input = UICtrl.getinput();
    if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {
      // 2 add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

      // 3 add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // CLEAR FIELDS
      UICtrl.clearFields();

      // CALCULATE AND UPDATE BUDGET
      UpdateBudget();
      //calculate and update percentage
      updatePercentage();
    }
  };

  // DELITE ITEMS ON THE LIST

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //FOUND BUTTON WHEN ON NEW LOAD PAGE THAT BUTTON DOESNT EXIST
    if (itemID) {
      // inc-1
      splitID = itemID.split("-"); // get part od string for two without - on array
      type = splitID[0];
      ID = parseFloat(splitID[1]);
      //delite the item from the data structure
      budgetCtrl.deliteItem(type, ID);
      // delite the item from the UI
      UICtrl.deleteListItem(itemID);
      //update and show the nwe budget
      UpdateBudget();
    }
  };

  // STARTED FUNCTION
  return {
    init: function() {
      console.log("started");
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totoalExpense: 0,
        percentage: 0
      });
    }
  };
})(budgetController, UIController);

controler.init();
