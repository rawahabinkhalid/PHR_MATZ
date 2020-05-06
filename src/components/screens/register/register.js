import React, {Component} from 'react'
import {Textview, Container, Button, Input, Statusbar} from '../../default'
import {Header, Title} from 'native-base'
import firebase from 'react-native-firebase'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import SpinKit from 'react-native-spinkit';
import Snackbar from 'react-native-snackbar';

var errorEmail = '';
var errorPass = '';
var errorPhone = '';

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            fullname:'',
            phone:null,
            password:'',
            loading:false,
            company:''
        } 
    }

    onRegisterPressed(){
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        const {email,password} = this.state;
        if(email != '' && password !=''&& this.state.phone !='' && this.state.fullname!='' && this.state.company!=''){
            this.setState({loading:true})
            if(email != '' && password != ''){
                if(reg.test(email) != false && password.length > 7 && this.state.phone.length == 11 ){
                    firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
                        let userID = firebase.auth().currentUser.uid;
                        firebase.database().ref(`users/customers/${userID}/`).child('personalinfo').set({
                            email: this.state.email,
                            fullname: this.state.fullname,
                            phone: this.state.phone,
                            company: this.state.company
                        }).then(
                            firebase.database().ref(`users/customers/${userID}/`).child('userid').set({
                                userID: userID
                            })
                        )
                        this.setState({loading:false})
                        AsyncStorage.setItem('registered', 'true').then(()=>{
                            this.props.navigation.navigate("NavigateToOrder")
                        });
                    }).catch(()=>{
                        this.setState({loading:false})
                        Snackbar.show({
                            text: 'Email Address Already Registered',
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
                    if(this.state.phone.length != 11 ){
                        errorPhone = "Phone Number badly formatted";
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
    onLoginScreen(){
        this.props.navigation.navigate("Login");
    }
    render(){
        return(
            <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                <Header style={{height:70, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#3F3F3F'}}>
                    <Statusbar backgroundColor="#3F3F3F"/>
                    <Title style={{fontSize:25, color:'#F5F5F5'}}>Register</Title>
                </Header>
                <ScrollView style={{marginBottom:5}}>
                    <Container ContainerStyle={{alignSelf:'center',alignItems:'center',marginTop:15, width:'90%'}}>
                        <Textview textStyle={{fontSize:18, color:'#544444'}} text="Please Register Yourself "/>
                        <Textview textStyle={{fontSize:18, color:'#544444'}} text="before you can order"/>
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
                        <Input
                            placeholder="Your Full Name"
                            placeholderTextColor="#3F3F3F"
                            returnKeyType={"next"}
                            inputStyle={styles.input}
                            blurOnSubmit={true}
                            onChangeText={(event) => {this.setState({fullname:event})}}
                        />
                        <Input
                            placeholder="Your Phone Number"
                            placeholderTextColor="#3F3F3F"
                            returnKeyType={"next"}
                            inputStyle={styles.input}
                            blurOnSubmit={true}
                            onChangeText={(event) => {
                                this.setState({phone:event})
                                errorPhone = ''
                            }}
                            keyboardType="numeric"
                        />
                        {errorPhone == '' ? null : <Textview text={errorPhone} textStyle={{color:'red',alignSelf:'center'}}/>}
                        <Input
                            placeholder="Your Company Name"
                            placeholderTextColor="#3F3F3F"
                            returnKeyType={"next"}
                            inputStyle={styles.input}
                            blurOnSubmit={true}
                            onChangeText={(event) => {
                                this.setState({company:event})
                                errorEmail = ''
                            }}
                            keyboardType="email-address"
                        />
                    </Container>
                    <Container ContainerStyle={{marginTop:25,alignSelf:'flex-end', height:30, width:'100%'}}>
                        <Textview  text="Already Registered?" textStyle={{ fontWeight:'bold',alignSelf:'center',fontSize:18, color:'#000'}} />
                    </Container>
                    <Container ContainerStyle={{alignSelf:'center', height:30, borderBottomWidth:1,borderBottomColor:'#0000EE',marginBottom:15}}>
                        <Button onPress={()=>{this.onLoginScreen()}} title="LOGIN HERE" style={{ height:30, justifyContent:'center', alignItems:'center'}} textStyle={{fontSize:18, color:'#0000EE'}}/>
                    </Container>
                </ScrollView>
                {
                    this.state.loading ? 
                    <Container ContainerStyle={{alignSelf:'flex-end', height:70, width:'100%',backgroundColor:'#3F3F3F',alignItems:'center',justifyContent:'center'}}>
                        <SpinKit isVisible={this.state.loading} color={'transparent'} size={40} type={'ThreeBounce'}/>
                    </Container>
                    
                        :
                    <Container ContainerStyle={{alignSelf:'flex-end', height:70, width:'100%',backgroundColor:'#3F3F3F',}}>
                        <Button onPress={()=>{this.onRegisterPressed()}} title="REGISTER" style={{backgroundColor:'#3F3F3F',height:70, width:'100%', justifyContent:'center', alignItems:'center'}} textStyle={{fontSize:22, color:'#F5F5F5'}}/>
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
        marginTop:20,
        width:'100%',
        backgroundColor:'white',
        borderRadius:5,
    }
}