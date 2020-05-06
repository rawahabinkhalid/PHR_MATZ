import React, {Component} from 'react'
import {Header,Title, Image} from 'native-base'
import {Container,Button, Statusbar,ImageView,Textview} from '../../default'
import {ActivityIndicator} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage'

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            order_items: [],
            loading:false
        }
    }
    navigateToPlaceOrder(){
        this.props.navigation.navigate("PlaceOrder", {productsData:this.state.order_items})
    }
    navigateToOrderHistory(){
        this.props.navigation.navigate("OrderHistory")
    }
    Logout(){
        firebase.auth().signOut().then(()=>{
            AsyncStorage.setItem('registered', '').then(() => {
                this.props.navigation.navigate('Login');
            });  
        }).catch(()=>{
            Snackbar.show({
                title: 'Error while logging you out',
                duration: Snackbar.LENGTH_INDEFINITE,    
                action: {
                    title: 'OK',
                    color: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });
        });
    }
    render(){
        if(this.state.loading){
            return(
                <ActivityIndicator size="large" animating color="#0000ff" style={{flex:1,alignSelf:'center'}} />
            )
        }
        else{  
            return(
            <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                <Header style={{flexDirection:'row',height:70, width:'100%', alignItems:'center', backgroundColor:'#3F3F3F'}}>
                    <Statusbar backgroundColor="#3F3F3F"/>
                    <Title style={{fontSize:25, color:'#F5F5F5',alignSelf:'center'}}>Place Your Order</Title>
                    <Button onPress={()=>{this.Logout()}} style={{position:'absolute',right:5,alignItems:'center'}} title='LOGOUT' textStyle={{fontSize:10,color:'#fff',}}>
                        <Icon name="md-log-out" size={24} color="#fff"/>
                    </Button>
                </Header>
                <Container>
                    <ImageView imgSource={require('../../../assets/images/logovital.png')} imageStyle={{height:150,width:150,alignSelf:'center'}}/>
                    <Textview text="VITAL CAFE" textStyle={{fontSize:28,color:'black',textAlign:'center',fontWeight:'bold'}}/>
                </Container>
                <Container ContainerStyle={{alignItems:'center',marginTop:'20%'}}>
                    <Container ContainerStyle={{flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                        <Button onPress={()=>{this.navigateToOrderHistory()}}title="View Order History" style={{padding:20,backgroundColor:'#3F3F3F', borderRadius:15, height:65, width:'75%', justifyContent:'center', alignItems:'center',alignSelf:'center'}} textStyle={{fontWeight:'bold',fontSize:22, color:'#F5F5F5'}}/>
                    </Container>
                    <Container ContainerStyle={{marginTop:35,flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                        <Button onPress={()=>this.navigateToPlaceOrder()}title="Place Order" style={{padding:20,backgroundColor:'#3F3F3F', borderRadius:15,  height:65, width:'75%', justifyContent:'center', alignItems:'center',alignSelf:'center'}} textStyle={{fontWeight:'bold',fontSize:22, color:'#F5F5F5'}}/>
                    </Container>
                </Container>
                <Container ContainerStyle={{alignItems:'center',width:'100%',position:'absolute',bottom:0,backgroundColor:'#3F3F3F',padding:5}}>
                    <Textview text=" © Powered By MATZ Solutions" textStyle={{fontSize:14,color:'white',textAlign:'center'}}/>
                </Container>
            </Container>
            )    
        }
    }
}