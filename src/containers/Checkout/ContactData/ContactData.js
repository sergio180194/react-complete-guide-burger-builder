import React, { Component } from "react";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from "../../../axios.orders";
import Input from '../../../components/UI/Input/Input';

import classes from "./ContactData.css";

class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
    },
    loading: false,
  };
  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "Sergio Rodriguez",
        address: {
          street: "1",
          zipCode: "12345",
          country: "Mexico",
        },
        email: "a@a.com",
      },
      deliveryMethod: "fast",
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        console.log(response);
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  render() {
    let form = (
      <form>
        <Input
        inputtype="input"
          type="text"
          name="name"
          placeholder="Your Name"
        ></Input>
        <Input
        inputtype="input"
          type="email"
          name="email"
          placeholder="Your Email"
        ></Input>
        <Input
        inputtype="input"
          type="text"
          name="street"
          placeholder="Street"
        ></Input>
        <Input
        inputtype="input"
          type="text"
          name="postal"
          placeholder="Postal Code"
        ></Input>
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
