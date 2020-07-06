import React,{Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios.orders';

const INGREDIENTE_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients:null,
        totalPrice: 1,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients:response.data})
            })
            .catch(err => {
                this.setState({error:true})
            });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el)=>{
                return sum + el;
            },0);
        
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients
        }
        updateIngredients[type] = updateCount;
        const priceAddition = INGREDIENTE_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice:newPrice,ingredients:updateIngredients});
        this.updatePurchaseState(updateIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients
        }
        updateIngredients[type] = updateCount;
        const priceReduction = INGREDIENTE_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceReduction;

        this.setState({totalPrice:newPrice,ingredients:updateIngredients});   
        this.updatePurchaseState(updateIngredients); 
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
       // alert('You continue...!');
       this.setState({loading:true});
       const order = {
           ingredients: this.state.ingredients,
           price: this.state.totalPrice,
           customer:{
               name: 'Sergio Rodriguez',
               address:{
                   street: '1',
                   zipCode: '12345',
                   country: 'Mexico'
               },
               email: 'a@a.com'
           },
           deliveryMethod: 'fast'
       }
       axios.post('/orders.json',order)
        .then(response => {
            console.log(response);
            this.setState({loading:false, purchasing:false});
        })
        .catch(err => {
            console.log(err);
            this.setState({loading:false, purchasing:false});
        });

    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p> :<Spinner/>

        if (this.state.ingredients) {
          burger = (
            <Aux>
              <Burger ingredients={this.state.ingredients} />
              <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                price={this.state.totalPrice}
                ordered={this.purchaseHandler}
                purchasable={this.state.purchasable}
              />
            </Aux>
          );
          orderSummary = (
            <OrderSummary
              ingredients={this.state.ingredients}
              price={this.state.totalPrice}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinue={this.purchaseContinueHandler}
            />
          );
        }

        if(this.state.loading){
            orderSummary = <Spinner/>
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);