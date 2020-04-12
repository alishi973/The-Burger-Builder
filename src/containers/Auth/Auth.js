import React, { Component } from "react";
import styles from "./Auth.module.css";
import Button from "./../../components/UI/Button/Button";
import Input from "./../../components/UI/Input/Input";
import { connect } from "react-redux";
import * as actions from "./../../store/actions/index";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Mail",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your Password",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  inputChangeHandler = (e, formElementIdentifier) => {
    const newOrderForm = {
      ...this.state.controls,
    };
    const updatedOrderForm = {
      ...newOrderForm[formElementIdentifier],
    };

    updatedOrderForm.value = e.target.value;
    updatedOrderForm.valid = this.checkValidity(
      updatedOrderForm.value,
      updatedOrderForm.validation
    );
    updatedOrderForm.touched = true;
    newOrderForm[formElementIdentifier] = updatedOrderForm;

    let formIsValid = true;
    for (let identifier in newOrderForm) {
      formIsValid = newOrderForm[identifier].valid && formIsValid;
    }

    this.setState({ controls: newOrderForm, formIsValid: formIsValid });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value
    );
  };

  render() {
    let formElementArray = [];
    for (let key in this.state.controls) {
      formElementArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    let form = (
      <form onSubmit={this.submitHandler}>
        {formElementArray.map((formElement) => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              inValid={!formElement.config.valid}
              shouldValidation={formElement.config.validation}
              touched={formElement.config.touched}
              changed={(e) => this.inputChangeHandler(e, formElement.id)}
            />
          );
        })}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          SUBMIT
        </Button>
      </form>
    );

    return <div className={styles.Auth}>{form}</div>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => {
      actions.auth(email, password);
    },
  };
};

export default connect(null, mapDispatchToProps)(Auth);
