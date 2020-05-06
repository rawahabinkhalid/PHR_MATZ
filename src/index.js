import React, {Component} from 'react'
import { createAppContainer } from 'react-navigation';
import { createRootNavigator } from './components/router/router'
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {

    state = { loading: true, registercheck: true}

    componentDidMount(){
        AsyncStorage.getItem('registered').then((value) => {
            if (value != null) {
                this.setState({registercheck:false})
            }
            SplashScreen.hide()
            this.setState({loading:false})
        });
    }

    render(){
        if(this.state.loading){
            return null;
        }
        if(this.state.registercheck){
            const AppLayout = createAppContainer(createRootNavigator('GOTOREGISTER'))
            return(
                <AppLayout/>
            )
        }
        else{
            const AppLayout = createAppContainer(createRootNavigator('GOTOPLACEORDER'))
            return(
                <AppLayout/>
            )
        }
    }
}