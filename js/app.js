// ? Budget Controller
const budgetController = (function () {
    let x = 23
    
    const add = function (a) {
        return x + a
    }
    
    return {
        publicTest : function (b) {
            return add(b)
        }
    }
})()

// ? UI Controller
// * Receives data from the UI and sends it to it.
const uiController = (function () {
    const DOMSelectors = {
        inputType: '#input-type',
        inputDescription: '#input-description',
        inputAmount: '#input-amount'  
    }
    return {
        getInputs: function () {
            return {
                type: document.querySelector(DOMSelectors.inputType).value, //either "income" or "expense"
                description: document.querySelector(DOMSelectors.inputDescription).value,
                amount: document.querySelector(DOMSelectors.inputAmount).value
            }
        }
    }
})()

// ? Global App Controller
const controller = (function (budgetCntlr, uiCntrlr) {
    
    const ctrlrAddItem = function () {
        // 1. Get the field input data
        const inputs = uiController.getInputs()
        console.log(inputs)

        // TODO 2. Add the item to the budget controller
        // TODO 3. Add the item to the UI
        // TODO 4. Calculate the budget
        // TODO 5. Display the budgey in the UI
        
        console.log('It works!')
    }

    document.querySelector('#button-add').addEventListener('click', ctrlrAddItem)
    
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            ctrlrAddItem()
        }
    })

})(budgetController, uiController)
