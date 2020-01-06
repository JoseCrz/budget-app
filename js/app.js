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
        buttonAdd: '#button-add',
        tableIncome: '#table-income',
        tableExpense: '#table-expense'
    }

    function createRow ({id, description, amount}, type) {      // function that returns an HTML element (row) filled with the corresponding data from the object
        if (type === 'income') {
            return `<div class="c-table__row" id="income-${id}">
                        <p class="c-table__row-description">${description}</p>
                        <div class="c-table__row-division">
                            <p class="c-table__row-amount">+ ${amount}</p>
                            <button class="c-table__row-button"><i class="icon-cancel-circle"></i></button>
                        </div>
                    </div>`
        } else if (type === 'expense') {
            return `<div class="c-table__row" id="expense-${id}">
                        <p class="c-table__row-description">${description}</p>
                        <div class="c-table__row-division">
                            <p class="c-table__row-amount c-table__row-amount--expense">- ${amount}</p>
                            <p class="c-table__row-percentage c-table__row-percentage--expense"><span>21%</span></p>
                            <button class="c-table__row-button c-table__row-button--expense"><i class="icon-cancel-circle"></i></button>
                        </div>
                    </div>`
        }
    }

    return {
        
        getInputs: function () {        //Gets the data from the different UI inputs
            return {
                type: document.querySelector(DOMSelectors.inputType).value, //either "income" or "expense"
                description: document.querySelector(DOMSelectors.inputDescription).value,
                amount: document.querySelector(DOMSelectors.inputAmount).value
            }
        },

        clearInputs: function () {      // Sets the inputs values back to empty
            const inputs = document.querySelectorAll(`${DOMSelectors.inputDescription}, ${DOMSelectors.inputAmount}`)
            inputs.forEach(input => {
                input.value = ''
            })
            inputs[0].focus()
        },

        getDOMSelectors: function () {      //Allows outer controllers to have access to DOM Selectors Object
            return DOMSelectors
        },

        addListItem: function (item, type) {        //inserts the corresping row filled with the recieve data into the corresponding DOM Element (table)
            let table
            
            // get the correct DOM Element (table)
            if (type === 'income') {
                table = DOMSelectors.tableIncome
            } else if (type === 'expense') {
                table = DOMSelectors.tableExpense
            }

            // create the row to insert into the DOM
            const row = createRow(item, type)
            
            // insert the row into the table
            document.querySelector(table).insertAdjacentHTML('beforeend', row)
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

        // * 3. Add the item to the UI
        uiCntrlr.addListItem(newItem, inputData.type)

        // * 4. Clear input fields
        uiCntrlr.clearInputs()

        // TODO 4. Calculate the budget
        // TODO 5. Display the budget in the UI
        
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
