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
    const z = budgetCntlr.publicTest(10)

    return {
        anotherPublicMethod : function () {
            console.log(z)
        }
    }
})(budgetController, uiController)