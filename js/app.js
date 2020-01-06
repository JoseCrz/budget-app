// ? Budget Controller
const budgetController = (function () {
    
    class Income {
        constructor (id, description, amount) {
            this.id = id
            this.description = description
            this.amount = amount
        }
    }
    
    class Expense {
        constructor (id, description, amount) {
            this.id = id
            this.description = description
            this.amount = amount
        }
    }

    const data = {
        allItems: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        }
    }

    return {
        addItem: function ({type, description, amount}) {
            let newItem
            let id = 0

            // calculate last item position in their corresponding array
            const lastItemPosition = data.allItems[type].length - 1
            
            // if there's at least one item
            if (lastItemPosition >= 0 ) {
                
                // generate the new id based on the id of the last element in the array
                id = data.allItems[type][lastItemPosition].id + 1
            }

            // According of the type we create its corresponding object
            if (type === 'income') {

                newItem = new Income(id, description, amount)
            } else if (type === 'expense') {

                newItem = new Expense(id, description, amount)
            }
            // Push the newly created object into it's corresponding array in the structure
            data.allItems[type].push(newItem)

            // return the object
            return newItem
        },
        seeData: function () {
            console.log(data)
        }
    }
})()

// ? UI Controller
// * Receives data from the UI and sends it to it.
const uiController = (function () {
    
    const DOMSelectors = {      // Object that will make refactoring easy if needed
        inputType: '#input-type',
        inputDescription: '#input-description',
        inputAmount: '#input-amount',
        buttonAdd: '#button-add' 
    }

    return {
        
        getInputs: function () {        //Gets the data from the different UI inputs
            return {
                type: document.querySelector(DOMSelectors.inputType).value, //either "income" or "expense"
                description: document.querySelector(DOMSelectors.inputDescription).value,
                amount: document.querySelector(DOMSelectors.inputAmount).value
            }
        },

        getDOMSelectors: function () {      //Allows outer controllers to have access to DOM Selectors Object
            return DOMSelectors
        }
    }
})()

// ? Global App Controller
const globalController = (function (budgetCntlr, uiCntrlr) {
    
    const setupEventListener = function () {        //function that setups all the event listeners needed to use the app
        const DOMSelectors = uiController.getDOMSelectors()
        
        document.querySelector(DOMSelectors.buttonAdd).addEventListener('click', ctrlrAddItem)
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlrAddItem()
            }
        })
    }

    const ctrlrAddItem = function () {
        // * 1. Get the field input data
        const inputData = uiController.getInputs()
        console.log(inputData)

        // * 2. Add the item to the budget controller
        const newItem = budgetCntlr.addItem(inputData)

        // TODO 3. Add the item to the UI
        // TODO 4. Calculate the budget
        // TODO 5. Display the budgey in the UI
        
        // console.log('It works!')
    }

    return {
        initApp: function () {
            console.log('App has started!')
            setupEventListener()
        }
    }

})(budgetController, uiController)

globalController.initApp()
