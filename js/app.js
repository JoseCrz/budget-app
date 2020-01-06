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

const uiController = (function () {

})()

const controller = (function (budgetCntlr, uiCntrlr) {
    
    const ctrlrAddItem = function () {
        // TODO 1. Get the field input data
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
