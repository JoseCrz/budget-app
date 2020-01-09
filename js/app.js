// ? Budget Controller
const budgetController = (function () {
    
    class Income {
        constructor (id, description, amount) {
            this.id = id
            this.description = description
            this.amount = amount
            this.percentage = -1
        }
    }
    
    class Expense {
        constructor (id, description, amount) {
            this.id = id
            this.description = description
            this.amount = amount
        }
    }

    Expense.prototype.calculatePercentage = function () {
        if (data.totals.income > 0 ) {
            this.percentage = Math.round((this.amount / data.totals.income) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }

    const data = {
        allItems: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        },
        budget: 0,
        expPercentage: -1
    }

    const generateTotals = function (type) {        // Generates the total according to the types and stores in its correspinding total
        let sum = 0
            
        data.allItems[type].forEach(element => {
            sum += element.amount
        })

        data.totals[type] = sum
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

        deleteItem: function (type, id) {
            const idsArray = data.allItems[type].map(item => {
                return item.id
            })

            const desiredIndex = idsArray.indexOf(id)

            if (desiredIndex !== -1) {
                data.allItems[type].splice(desiredIndex, 1)
                console.log('Element deleted!')
            }
        },

        calculateBudget: function () {
            // * 1. generate totals
            generateTotals('income')
            generateTotals('expense')
            
            // * 2. Calculate expense percentage and store it
            if (data.totals.income > 0 ) {
                data.expPercentage = Math.round((data.totals.expense / data.totals.income) * 100)
            } else {
                data.expPercentage = -1
            }
            
            // * 3. calculate the budget and store it
            data.budget = data.totals.income - data.totals.expense

        },

        calculatePercentages: function () {
            data.allItems.expense.forEach(element => {
                element.calculatePercentage()
            })
        },

        getPercentages: function () {
            return data.allItems.expense.map(element => {
                return element.getPercentage()
            })
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                expPercentage: data.expPercentage
            }
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
        tableExpense: '#table-expense',
        textBudget: '#text-budget',
        textIncome: '#text-income',
        textExpense: '#text-expense',
        textPercentage: '#text-percentage',
        textRowPercentage: '.c-table__row-percentage--expense>span',
        main: '#main'
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
                amount: parseFloat(document.querySelector(DOMSelectors.inputAmount).value)
            }
        },

        clearInputs: function () {      // Sets the inputs values back to empty
            const inputs = document.querySelectorAll(`${DOMSelectors.inputDescription}, ${DOMSelectors.inputAmount}`)
            inputs.forEach(input => {
                input.value = ''
            })
            inputs[0].focus()
        },

        getDOMSelectors: () => DOMSelectors,    //Allows outer controllers to have access to DOM Selectors Object

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
        },
        deleteListItem: function (type, elementId) {        //Deletes the desired row from the correspinding table
            let desiredTable
            
            if (type === 'income') {
                desiredTable = document.querySelector(DOMSelectors.tableIncome)
            } else if (type === 'expense') {
                desiredTable = document.querySelector(DOMSelectors.tableExpense)
            }
            
            desiredTable.removeChild(document.getElementById(elementId))

        },
        updatePercentages: function (percentages) {
            percentageLabels = document.querySelectorAll(DOMSelectors.textRowPercentage)
            console.log(percentageLabels)
            percentageLabels.forEach((label, index) => {
                label.textContent = `${percentages[index]}%`
            })

        },

        displayBudget: function ({budget, totalIncome, totalExpense, expPercentage}) {      // recieves the budget data structure and display its content into the corresponding UI Elements
            document.querySelector(DOMSelectors.textBudget).textContent = budget
            document.querySelector(DOMSelectors.textIncome).textContent = `+ ${totalIncome}`
            document.querySelector(DOMSelectors.textExpense).textContent = `- ${totalExpense}`
            
            if (expPercentage > 0) {
                document.querySelector(DOMSelectors.textPercentage).textContent = `${expPercentage}%`
            } else {
                document.querySelector(DOMSelectors.textPercentage).textContent = '~'
            }
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

        document.querySelector(DOMSelectors.main).addEventListener('click', ctrlrDeleteItem)
    }

    const validInput = ({description, amount}) => description !== '' &&  !isNaN(amount) && amount > 0
    
    const updateBudget = function () {

        // * 1. Calculate the budget
        budgetCntlr.calculateBudget()

        // * 2. Get the budget
        const budget = budgetCntlr.getBudget()

        // * 3. Display the budget in the UI
        uiCntrlr.displayBudget(budget)
    }

    const updatePercentages = function () {
        // * 1. Calculate the percentages
        budgetCntlr.calculatePercentages()

        // * 2. Get percentages
        const allPercentages = budgetCntlr.getPercentages()

        // * 3. Update UI with new percentages
        uiCntrlr.updatePercentages(allPercentages)

    }

    const ctrlrAddItem = function () {
        // * 1. Get the field input data
        const inputData = uiController.getInputs()
        console.log('input data:', inputData)
        
        // * 2. Validate input
        if (validInput(inputData)) {
            
            // * 3. Add the item to the budget controller
            const newItem = budgetCntlr.addItem(inputData)
    
            // * 4. Add the item to the UI
            uiCntrlr.addListItem(newItem, inputData.type)
    
            // * 5. Clear input fields
            uiCntrlr.clearInputs()
            
            // * 6. Update budget
            updateBudget()
    
            // * 7. Update percentages
            updatePercentages()
            // console.log('It works!')

        } else {
            alert('Invalid input')
        }

    }

    const ctrlrDeleteItem = function (event) {
        
        // * 0. Confirm that the click element its a valid row 
        const element = event.target.parentNode.parentNode.parentNode
        const elementClass = element.classList[0]
        // console.log(elementClass)
        if (elementClass === 'c-table__row') {
            
            // * 1. Delete item from the budget
            const elementID = element.id
            const splitedID = elementID.split('-')
            const type = splitedID[0]
            const id = parseInt(splitedID[1])

            budgetCntlr.deleteItem(type, id)

            // * 2. Delete item from the UI
            uiCntrlr.deleteListItem(type, elementID)

            // * 3. Update budget
            updateBudget()

            // * 4. Update percentages
            updatePercentages()
        }

    }

    return {
        initApp: function () {
            console.log('App has started!')
            setupEventListener()
        }
    }

})(budgetController, uiController)

globalController.initApp()
