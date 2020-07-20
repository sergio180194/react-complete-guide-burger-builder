import React,{Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios.orders';
import * as actionsTypes from "../../store/actions";



class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients:response.data})
        //     })
        //     .catch(err => {
        //         this.setState({error:true})
        //     });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el)=>{
                return sum + el;
            },0);
        
        return sum > 0;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updateCount = oldCount + 1;
    //     const updateIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updateIngredients[type] = updateCount;
    //     const priceAddition = INGREDIENTE_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;

    //     this.setState({totalPrice:newPrice,ingredients:updateIngredients});
    //     this.updatePurchaseState(updateIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updateCount = oldCount - 1;
    //     const updateIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updateIngredients[type] = updateCount;
    //     const priceReduction = INGREDIENTE_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceReduction;

    //     this.setState({totalPrice:newPrice,ingredients:updateIngredients});   
    //     this.updatePurchaseState(updateIngredients); 
    // }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {

    //   const queryParams = [];
    //   for (let i in this.state.ingredients) {
    //     queryParams.push(
    //       encodeURIComponent(i) +
    //         "=" +
    //         encodeURIComponent(this.state.ingredients[i])
    //     );
    //   }
    //   queryParams.push('price='+this.state.totalPrice)
    //   const queryString = queryParams.join("&");

      this.props.history.push('/checkout');
    };

    render(){
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p> :<Spinner/>

        if (this.props.ings) {
          burger = (
            <Aux>
              <Burger ingredients={this.props.ings} />
              <BuildControls
                ingredientAdded={this.props.onIngredientAdded}
                ingredientRemoved={this.props.onIngredientRemoved}
                disabled={disabledInfo}
                price={this.props.price}
                ordered={this.purchaseHandler}
                purchasable={this.updatePurchaseState(this.props.ings)}
              />
            </Aux>
          );
          orderSummary = (
            <OrderSummary
              ingredients={this.props.ings}
              price={this.props.price}
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

const mapStateToProps = state => {
    return {
        ings:state.ingredients,
        price: state.totalprice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type:actionsTypes.ADD_INGREDIENT,ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type:actionsTypes.REMOVE_INGREDIENT,ingredientName: ingName})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));