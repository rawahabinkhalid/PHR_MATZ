import React, {Component} from 'react'
import {Textview, Container, Button, Input, Statusbar,ImageView} from '../../default'
import {Header, Title} from 'native-base'
import firebase from 'react-native-firebase'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import SpinKit from 'react-native-spinkit';
import Snackbar from 'react-native-snackbar';

var errorEmail = '';
var errorPass = '';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            loading:false,

        }
    }
    onLoginPressed(){
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        const {email,password} = this.state;
        if(email != '' && password != ''){
            this.setState({loading:true})
            if(email != '' && password != ''){
                if(reg.test(email) != false && password.length > 7 ){
                    firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
                        this.setState({loading:false},()=>{
                            AsyncStorage.setItem('registered', 'true').then(()=>{
                                this.props.navigation.navigate("NavigateToOrder")
                            });    
                        })
                    }).catch(()=>{
                        this.setState({loading:false})
                        Snackbar.show({
                            text: 'Invalid Email or Password combination',
                            duration: Snackbar.LENGTH_INDEFINITE,    
                            action: {
                                text: 'OK',
                                textColor: 'green',
                                onPress: () => { Snackbar.dismiss() },
                            },
                        });
                    })
                }
                else{
                    this.setState({loading:false})
    
                    if(reg.test(email) == false ){
                        errorEmail = "Email badly formatted";
                    }
                    if(password.length < 7 ){
                        errorPass = "Password badly formatted";
                    }
                }
            }
        }
        else{
            this.setState({loading:false})
            Snackbar.show({
                text: 'Please enter all required Fields.',
                duration: Snackbar.LENGTH_INDEFINITE,    
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });
        }
    }
    forgotPassword(){
        if(this.state.email == ''){
            Snackbar.show({
                text: 'Please enter your email to reset password.',
                duration: Snackbar.LENGTH_INDEFINITE,    
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });
        }
        else{
            firebase.auth().sendPasswordResetEmail(this.state.email).then(()=>{
                Snackbar.show({
                    text: 'Email has been sent to reset your password.',
                    duration: Snackbar.LENGTH_INDEFINITE,    
                    action: {
                        text: 'OK',
                        textColor: 'green',
                        onPress: () => { Snackbar.dismiss() },
                    },
                });
            }).catch(()=>{
                Snackbar.show({
                    text: 'Error occured while resetting password.',
                    duration: Snackbar.LENGTH_INDEFINITE,    
                    action: {
                        text: 'OK',
                        textColor: 'green',
                        onPress: () => { Snackbar.dismiss() },
                    },
                });
            })
    
        }
    }
    render(){
        return(
            <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                <Header style={{height:70, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#3F3F3F'}}>
                    <Statusbar backgroundColor="#3F3F3F"/>
                    <Title style={{fontSize:25, color:'#F5F5F5'}}>Login</Title>
                </Header>
                <Container>
                    <ImageView resizeMode="stretch" imgSource={require('../../../assets/images/logovital.png')} imageStyle={{height:120,width:120,alignSelf:'center'}}/>
                    <Textview text="VITAL CAFE" textStyle={{fontSize:20,color:'black',textAlign:'center',fontWeight:'bold'}}/>
                </Container>
                <ScrollView style={{marginBottom:5}}>
                    <Container ContainerStyle={{alignSelf:'center',alignItems:'center',marginTop:15, width:'90%'}}>
                        <Textview textStyle={{fontSize:18, color:'#544444'}} text="Please Login to your Account "/>
                        <Container ContainerStyle={{borderBottomColor: '#666666',borderBottomWidth: 3,width: '50%',marginTop: 5}}/>
                    </Container>
                    <Container ContainerStyle={{marginTop:10,alignSelf:'center',width:'90%'}}>
                        <Input
                            placeholder="Your Email"
                            placeholderTextColor="#3F3F3F"
                            returnKeyType={"next"}
                            inputStyle={styles.input}
                            blurOnSubmit={true}
                            onChangeText={(event) => {
                                this.setState({email:event})
                                errorEmail = ''
                            }}
                            keyboardType="email-address"
                        />
                        {errorEmail == '' ? null : <Textview text={errorEmail} textStyle={{color:'red',alignSelf:'center'}}/>}
                        <Input
                            placeholder="Your Password"
                            placeholderTextColor="#3F3F3F"
                            returnKeyType={"next"}
                            secureTextEntry={true}
                            inputStyle={styles.input}
                            blurOnSubmit={true}
                            onChangeText={(event) => {
                                this.setState({password:event})
                                errorPass = ''
                            }}
                        />
                        {errorPass == '' ? null : <Textview text={errorPass} textStyle={{color:'red',alignSelf:'center'}}/>}
                        <Container ContainerStyle={{marginTop:25,alignSelf:'center', height:30, borderBottomWidth:2,borderBottomColor:'red',marginBottom:15}}>
                            <Button onPress={()=>{this.forgotPassword()}} title="Forgot Password?" style={{ height:30, justifyContent:'center', alignItems:'center'}} textStyle={{fontSize:18, color:'red',fontWeight:'bold'}}/>
                        </Container>
                    </Container>
                </ScrollView>
                {
                    this.state.loading ? 
                    <Container ContainerStyle={{alignSelf:'flex-end', height:70, width:'100%',backgroundColor:'#3F3F3F',alignItems:'center',justifyContent:'center'}}>
                        <SpinKit isVisible={this.state.loading} color={'transparent'} size={40} type={'ThreeBounce'}/>
                    </Container>
                    
                        :
                    <Container ContainerStyle={{alignSelf:'flex-end', height:70, width:'100%',backgroundColor:'#3F3F3F',}}>
                        <Button onPress={()=>{this.onLoginPressed()}} title="LOGIN" style={{backgroundColor:'#3F3F3F',height:70, width:'100%', justifyContent:'center', alignItems:'center'}} textStyle={{fontSize:22, color:'#F5F5F5'}}/>
                    </Container>
                }
            </Container>
        )
    }
}
const styles = {
    input:{
        paddingLeft:10,
        fontSize:18,
        height:55,
        marginTop:25,
        width:'100%',
        backgroundColor:'white',
        borderRadius:5,
    }
}