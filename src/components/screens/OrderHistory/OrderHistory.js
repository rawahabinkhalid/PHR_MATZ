import React, {Component} from 'react'
import {Textview, Container, Button, Statusbar} from '../../default'
import {Header, Title} from 'native-base'
import {FlatList,Dimensions,ActivityIndicator, Alert} from 'react-native'
import firebase from 'react-native-firebase'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const {height, width} = Dimensions.get('window');

var invoice_status = '';
var flag = 0;
var orders_history = [];
var orderdate = '', ordertime = '';
export default class OrderHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            order_history: [],
            refresh: false
        }
    }
    componentDidMount(){
        this.take_order_history();
    }
    take_order_history(){
        var tmp = [];
        if(flag == 0){
            var userid = firebase.auth().currentUser.uid; 
            var dbref = firebase.database().ref(`users/customers/${userid}/orderinfo/`);
            dbref.on("value", (snapshot)=>{
                snapshot.forEach((data)=>{
                    tmp.push(data.val())
                    // console.log("order history .... ",tmp);
                })
                orders_history = tmp;
                if(orders_history!=undefined || orders_history!='' || orders_history!=null){   
                    this.setState({order_history: orders_history}, ()=>{
                        this.state.order_history.reverse();
                        console.log("order history .... ",orders_history);
                        for(var i=0; i<orders_history.length; i++){
                            orderdate = orders_history[i].order_date + "/" + orders_history[i].order_month;
                            ordertime = orders_history[i].order_hours + ":" + orders_history[i].order_minutes;    
                        }
                        console.log("order date ... ",orderdate);
                        console.log("order time ... ",ordertime);
                        this.setState({loading:false,refresh: !this.state.refresh})
                    })
                    tmp = [];                                    
                }
            })
        }
    }
    cancelOrder(item){
        console.log("invoice status",item.invoice);
        if(item.invoice != undefined || item.invoice != null || item.invoice != ''){
            if(item.invoice == 'printed'){
                Alert.alert("Sorry, Your Order is being processed")
            }
            else{
                this.setState({loading:true})
                var userid = firebase.auth().currentUser.uid; 
                var dbref = firebase.database().ref(`users/customers/${userid}/orderinfo/`);
        
                dbref.on("value", (snapshot)=>{
                    snapshot.forEach((data)=>{
                        if(item.key == data.key){
                            var changeStatus = firebase.database().ref(`users/customers/${userid}/orderinfo/${data.key}/`);
                            changeStatus.update({status:"cancelled by customer"})
                        }
                    })
                    this.setState({loading:false})
                })
            }
        }
        
    }
    onViewDetailsPressed(item){
        console.log("view details:  ", item.demand)
        this.props.navigation.navigate("ViewDetails",{demand: item.demand})
    }
    render(){
        if( this.state.loading) { 
            return(
                <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                    <ActivityIndicator size="large" animating color="#3F3F3F" style={{flex:1,alignSelf:'center'}} />
                </Container>
            )
        }
        else{
            return(
                <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                    <Header style={{height:70, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#3F3F3F'}}>
                        <Statusbar backgroundColor="#3F3F3F"/>
                        <Title style={{fontSize:25, color:'#F5F5F5'}}>View Order History</Title>
                    </Header>
                    <Container ContainerStyle={{ marginTop:20,height:'90%'}}>
                        <FlatList
                            data={this.state.order_history}
                            extraData={this.state}
                            refreshing={this.state.refresh}
                            renderItem={({ item, index }) => (   
                                <Container ContainerStyle={{padding:20,alignSelf:'center',marginBottom:20,height:160,backgroundColor:'#3F3F3F',width:'90%',borderRadius:10,flexDirection:'row'}}>
                                    <Container ContainerStyle={{flex:1,width:'30%',alignItems:'center',flexDirection:'row'}}>
                                        <FontAwesome5 name="history" size={35} color="white"/>
                                        <Container ContainerStyle={{marginLeft:10,width:'100%'}}>
                                            <Textview textStyle={{fontSize:18,color:'white'}} text={item.order_date+"/"+item.order_month}/>
                                            <Textview textStyle={{fontSize:18,color:'white'}} text={item.order_hours+":"+item.order_minutes}/>
                                            <Textview textStyle={{fontSize:14,color:'white'}} text={item.status}/>
                                        </Container>    
                                    </Container>
                                    <Container ContainerStyle={{flexDirection:'column',alignSelf:'center'}}>
                                        <Container ContainerStyle={{justifyContent:'center',alignItems:'center',marginLeft:25}}>
                                            <Button title="View Details" onPress={()=>{this.onViewDetailsPressed(item)}} style={{padding:5,justifyContent:'center',alignItems:'center',width:85,height:40,backgroundColor:'#FEB914',borderRadius:15}} textStyle={{textAlign:'center',fontSize:14,color:'black',fontWeight:'bold'}}/>
                                        </Container>    
                                        <Container ContainerStyle={{justifyContent:'center',alignItems:'center',marginLeft:25,marginTop:10}}>
                                            <Button title="Cancel Order" onPress={()=>{item.status=='deliver' ? {} : item.status=='cancelled by admin' ? {} : this.cancelOrder(item)}} style={{padding:5,justifyContent:'center',alignItems:'center',width:85,height:40,backgroundColor:'#FEB914',borderRadius:15}} textStyle={{textAlign:'center',fontSize:14,color:'black',fontWeight:'bold'}}/>
                                        </Container>
                                    </Container>
                                </Container>
                            )}
                            keyExtractor={(item,index) => index.toString()}
                        />
                    </Container>
                </Container>
            )
        }
    
    }
}