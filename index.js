import { menuArray } from '/data.js'

let order = []
let foodNames = []

const orderForm = document.getElementById('order-form');
const completedOrder = document.getElementById('completed-order')
const formModal = document.getElementById('form-modal')


document.addEventListener('click', function(event){
    if(event.target.dataset.btn){
       addToOrder(event.target.dataset.btn) 
    } else if(event.target.dataset.add) {
        addToOrder(event.target.dataset.add)
    } else if(event.target.dataset.delete) {
        removeFromOrder(event.target.dataset.delete)
    } else if(event.target.id === 'complete-order-btn') {
        openForm();
    }
})


function addToOrder(btnId) {
    const targetArrayObj = menuArray.filter(function(food){
        return food.uuid === btnId
    })[0]
    
    order.push(targetArrayObj)
    foodNames.push(targetArrayObj.name)
    
    getOrderHtml();
}

function removeFromOrder(btnId) {
    order.splice(btnId -= 1, 1);
    foodNames.splice(btnId, 1);

    getOrderHtml();
}


// get 30% discounts
function getTotalpcent( total ) {
    return (total/100)*30
}

function getOrderHtml() {
    completedOrder.classList.add('hidden')
    
    const getCompletedOrder = document.getElementById('selected-order')  
    if(order.length > 0) {
        getCompletedOrder.classList.remove('hidden');
        
        let getOrderSelected = ''
        let total = 0
        let removeBtn = 0;
        order.forEach(function(items) {
        getOrderSelected += `
            <div class="order-item-con">
                <div class="order-con">
                    <h3 class="order-name">${items.name}</h3>
                    <button class="removeItem-btn" data-delete="${removeBtn += 1}">remove</button>
                    <p class="order-price">$${items.price}</p>
                </div>
            </div>
        ` 
        total += items.price
        })
    
        let discounts = 'hidden'
         // discount on beer
        if (foodNames.includes('Hamburger') && foodNames.includes('Beer') || 
            foodNames.includes('Pizza') && foodNames.includes('Beer')) {
            total -= getTotalpcent(total).toFixed(0)
            discounts = ''
        } else {
            discounts = 'hidden'
        }
        
        getCompletedOrder.innerHTML = `
            <h3 class="your-order">Your Order</h3>
            <p class="discounts ${discounts}">
            ! You just 30% discounts for adding beer to your order !</p>
            ${getOrderSelected}
            <div class="total-price-container">
                <h3 class="total-price-txt">Total price:</h3>
                <p class="total-price">$${total}</p>    
            </div>
            <div class="complete-order-btn-con">
                <button class="complete-order-btn" 
                    id="complete-order-btn">
                    Complete order
                </button>
            </div> 
        `
    } else {
        getCompletedOrder.classList.add('hidden');
    }
}



function openForm(){
    formModal.classList.remove('hidden');
}

orderForm.addEventListener('submit', function(event) {
    event.preventDefault();
    formModal.classList.add('hidden');
    
    const formData = new FormData(orderForm);
    const fullName = formData.get('name')
    
    completeOrder(fullName)
})

function completeOrder(name) {
    order = []
    getOrderHtml()
    completedOrder.classList.remove('hidden')
    completedOrder.innerHTML =`
    <div class="processing-container">
        <p class="processing-txt">
            Wait ${name} your order is been processing...
        </p>
    </div>`
    setTimeout(() => {
        completedOrder.innerHTML =`
        <div class="processing-container">
            <p class="confirmation-text">
                Thanks, ${name} ! Your order is on its way!
            <p>
        </div>`
    },4000)

    
}

function getMenuHtml() {
    let menuHtml = ''
    
    menuArray.forEach(function(food) {
        menuHtml += `
        <div class="order-selection">
            <p class="emoji">${food.emoji}</p> 
            <div>
                <h2>${food.name}</h2>
                 <p class="ingredients">${food.ingredients}</p>
                 <p class="price">$${food.price}</p>
            </div>
            <div class="select-order">
                <button class="select-order-btn" data-btn="${food.uuid}">
                    <span class="add" data-add="${food.uuid}">+</span>
                </button>
            </div>
        </div>`
    })
    
    return menuHtml
}


function render() {
    document.getElementById('container').innerHTML = getMenuHtml();
}

render();