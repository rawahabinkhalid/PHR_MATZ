import { createSwitchNavigator, createDrawerNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack'
import PlaceOrder from "../screens/place_order/PlaceOrder";
import Register from "../screens/register/register";
import Home from "../screens/home/homescreen";
import OrderHistory from "../screens/OrderHistory/OrderHistory";
import ViewDetails from "../screens/OrderHistory/ViewDetails";
import Login from "../screens/login/Login";

const RegisterNavigator = createStackNavigator({
    Register: {
      screen: Register,
      navigationOptions: {
          header:null
      }
    },
    Login:{
      screen: Login,
      navigationOptions: {
          header:null
      }
    }
  });
const OrderNavigator = createStackNavigator({
    HomeScreen:{
      screen:Home,
      navigationOptions: {
        header:null
      }
    },
    PlaceOrder: {
      screen: PlaceOrder,
      navigationOptions: {
          header:null
      }
    },
    OrderHistory: {
      screen: OrderHistory,
      navigationOptions: {
          header:null
      }
    },
    ViewDetails: {
      screen: ViewDetails,
      navigationOptions: {
          header:null
      }
    }
});

export const createRootNavigator = (signedIn) => {
    return createSwitchNavigator(
      {
        NavigateToOrder: {
          screen: OrderNavigator,
        },
        NavigateToRegister: {
          screen: RegisterNavigator
        },
      },
      {
        initialRouteName: signedIn === 'GOTOREGISTER' ? "NavigateToRegister" : signedIn === 'GOTOPLACEORDER' ? "NavigateToOrder" : null
      }
    )
  }
  
  