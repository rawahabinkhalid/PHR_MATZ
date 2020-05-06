import React, {Component} from 'react'
import {Textview, Container, Button, Input, Statusbar} from '../../default'
import {Header, Title} from 'native-base'
import {FlatList, Alert,TouchableOpacity, Image,Dimensions,ActivityIndicator} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import firebase from 'react-native-firebase'
import SpinKit from 'react-native-spinkit';
import AwesomeIcon from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'

const {height, width} = Dimensions.get('window');
var products = [];
var order_to_send = [];
var userUID = '';
var userFullname = '';
var userPhone = ''
var order_date = '';
var order_month = '';
var order_hours = ''
var order_minutes = ''; 
var flag = 0;
var inverted_array = [];
var origninalList = [];
export default class PlaceOrder extends Component{
    constructor(props) {
        super(props);
        this.state = {
            order_items: [],
            order_items_backup: [],
            quantity: 0,
            hallnumber:'',
            stallnumber:'',
            enableScrollViewScroll: true,
            loading:true,
            refresh:false,
            userFullname:'',
            userPhone: '',
            category_selected:''
        }
        
    }
    takeData(){
        console.log("into takeData()")
        userUID = firebase.auth().currentUser.uid;
        console.log("uid of users....",userUID)
        var refr = firebase.database().ref(`users/customers/${userUID}/personalinfo/`)
        refr.on("value", (snapshot)=>{
            userFullname = snapshot.val().fullname,
            userPhone = snapshot.val().phone
            this.setState({userFullname:snapshot.val().fullname,userPhone:snapshot.val().phone},()=>{
                console.log(':this.takeData():::::',this.state.userFullname);
                console.log(':this.takeData():::::',this.state.userPhone);
            })
            
        })

    }
    componentDidMount(){
        console.log("loading::::componentDidMount",this.state.loading)
        this.takeProductsData()
        
    }
    onRemovePressed(item){
        console.log("Asdasdasdasd")
        console.log("itemm...", item)
        if(item.productquantity!=0){
            let q = parseInt(item.productquantity);
            q-=1;
            item.productquantity = q.toString();
            order_to_send.push(item)
            this.setState({quantity:item.productquantity});
       }
    }
    onAddPressed(item){
        console.log("order list..", this.state.order_items)
        console.log("item.......", item)
        let q = parseInt(item.productquantity);
        q+=1;
        item.productquantity = q.toString();
        console.log("item.productquantity..", item.productquantity);
        console.log("item of ... ", item)
        order_to_send.push(item)
        this.setState({quantity:item.productquantity});
    }
    onChangeInput(event,item){
        // temp = item;
        if(event!=''){
            item.productquantity = event;
            console.log("item updated...", item)
            order_to_send.push(item)
            console.log("order to send...", order_to_send)
        }
    }
    async takeProductsData(){
        var tmp = [];
        if(flag == 0){
            console.log("loading::::takeProductsData",this.state.loading)
            console.log("into takeData()")
            var dbref = firebase.database().ref(`users/product/`).orderByChild("productcategory");
            dbref.on("value", (snapshot)=>{
                snapshot.forEach((data)=>{
                    tmp.push(data.val())
                    console.log("snapshot products... ", tmp)
                })
                products = tmp;
                origninalList = tmp;
                if(products!=undefined || products!='' || products!=null){   
                    tmp = [];
                    // for(var i=0;i<products.length;i++){
                    //     for(var j=products.length-1; j>=0; j--){
                    //         inverted_array[i] = products[j];
                    //     }
                    // }
                    // inverted_array = products.reverse();               
                    this.setState({order_items: products}, ()=>{
                        this.takeData();
                        this.setState({loading:false,refresh: !this.state.refresh})
                    })
                }
            })
            
        }
        
        else{
            this.setState({order_items:products}, ()=>{
                this.setState({loading:false})
            })
        }
    }
    onOnderPressed(){
        if(order_to_send == null || order_to_send == undefined || order_to_send == ''){
            Snackbar.show({
                text: 'Please choose items to order.',
                duration: Snackbar.LENGTH_INDEFINITE,    
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });    
        }
        else if( this.state.hallnumber =='' || this.state.stallnumber ==''){
            Snackbar.show({
                text: 'Please choose hall and stall number.',
                duration: Snackbar.LENGTH_INDEFINITE,    
                action: {
                    text: 'OK',
                    textColor: 'green',
                    onPress: () => { Snackbar.dismiss() },
                },
            });    
        }
        else{
            order_date = new Date().getDate();
            order_month = new Date().getMonth() + 1;
            order_hours = new Date().getHours();
            order_minutes = new Date().getMinutes();
            
            this.setState({loading:true})
            const distinct = (value, index, self) => {
                return self.indexOf(value) === index;
            }
            const distinctOrder = order_to_send.filter(distinct);
            let userID = firebase.auth().currentUser.uid;
            let status = "pending"
            let key = firebase.database().ref(`users/customers/${userID}/`).child('orderinfo').push().key;
            firebase.database().ref(`users/customers/${userID}/`).child('orderinfo').child(key).set({
                fullname: userFullname,
                phone: userPhone,
                userid: userUID,
                hallnumber: this.state.hallnumber,
                stallnumber: this.state.stallnumber,
                demand: distinctOrder,
                status: status,
                order_date: order_date,
                order_month: order_month,
                order_hours: order_hours,
                order_minutes: order_minutes,
                key:key
            }).then(()=>{
                order_to_send = [];
                this.setState({loading:false})
                Alert.alert("Your Order is being processed")
                this.props.navigation.navigate("HomeScreen")
            })
        }
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
                        <Title style={{fontSize:25, color:'#F5F5F5'}}>Place Your Order</Title>
                    </Header>
                    <Container ContainerStyle={{backgroundColor:'white', width:'90%',height:'65%', alignSelf:'center', marginTop:10, borderRadius:5}}>
                        <FlatList
                            data={this.state.order_items}
                            extraData={this.state}
                            refreshing={this.state.refresh}
                            renderItem={({ item, index }) => (   
                                <Container ContainerStyle={{width:'31.5%',marginRight:7,borderWidth:1,borderColor:'#D3D3D3', flexDirection: 'column', marginBottom:10,justifyContent:'center',alignItems:'center'}}>
                                    <Container ContainerStyle={{width:'100%',alignSelf:'center',backgroundColor: 'white',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                        <Container ContainerStyle={{width:'100%',alignSelf:'center',height:100}}>
                                            <Image 
                                                style={{resizeMode: 'cover',justifyContent: 'center',alignItems: 'center',height:100}} 
                                                source={
                                                    item.productimage
                                                    ?
                                                    {uri:item.productimage}
                                                    :
                                                    require('../../../assets/images/02.png')
                                                } />
                                        </Container>
                                        <Textview textStyle={{alignSelf:'center',fontSize:12, color:'black',textAlign:'center'}} text={item.productname}/>
                                        <Container ContainerStyle={{position:'relative',bottom:0,alignSelf:'center',height:30,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                            <Container ContainerStyle={{borderColor:'#D3D3D3', borderWidth:1,alignItems:'center',width:30,height:30,}}>
                                                <TouchableOpacity onPress={()=>{this.onRemovePressed(item)}}>
                                                    <AwesomeIcon name="md-remove" size={30} />
                                                </TouchableOpacity>
                                            </Container>
                                            <Textview text={item.productquantity} textStyle={{borderColor:'#D3D3D3',borderTopWidth:1,borderBottomWidth:1,textAlign:'center',alignSelf:'center',width:30,height:30,fontSize:20,marginTop:1, color:'#3F3F3F'}}/>
                                            <Container ContainerStyle={{borderColor:'#D3D3D3', borderWidth:1,alignItems:'center',width:30,height:30,}}>
                                                <TouchableOpacity onPress={()=>{this.onAddPressed(item)}}>
                                                    <AwesomeIcon name="md-add" size={30} />
                                                </TouchableOpacity>
                                            </Container>
                                        </Container>
                                    </Container>
                                </Container>
                            )}
                            numColumns={3}
                            keyExtractor={(item,index) => index.toString()}
                        />
                    </Container>
                    <Container ContainerStyle={{flexDirection:'row', marginTop:10}}>
                        <Container ContainerStyle={{marginRight:15,position:'absolute',left:20,flexDirection:'column'}}>
                            <Container ContainerStyle={{justifyContent:'center',alignItems:'center',height:35, backgroundColor:'white', width:width/1.4,borderRadius:5}}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Hall Number:',
                                        value: null,
                                    }}
                                    textStyle={{fontSize:14}}
                                    onValueChange={(value) => {this.setState({hallnumber:value})}}
                                    items={[
                                        { label: 'Hall 1', value: 'Hall 1' },
                                        { label: 'Hall 2', value: 'Hall 2' },
                                        { label: 'Hall 3', value: 'Hall 3' },
                                        { label: 'Hall 4', value: 'Hall 4' },
                                        { label: 'Hall 5', value: 'Hall 5' },
                                        { label: 'Hall 6', value: 'Hall 6' },
                                    ]}
                                />
                            </Container>
                            <Container ContainerStyle={{alignItems:'center',justifyContent:'center',height:35,backgroundColor:'white',width:width/1.4,borderRadius:5,marginTop:5}}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Stall Number:',
                                        value: null,
                                    }}
                                    textStyle={{fontSize:14}}
                                    onValueChange={(value) => {this.setState({stallnumber:value})}}
                                    items={[
                                        { label: 'Stall 1', value: 'Stall 1' },
                                        { label: 'Stall 2', value: 'Stall 2' },
                                        { label: 'Stall 3', value: 'Stall 3' },
                                        { label: 'Stall 4', value: 'Stall 4' },
                                        { label: 'Stall 5', value: 'Stall 5' },
                                        { label: 'Stall 6', value: 'Stall 6' },
                                        { label: 'Stall 7', value: 'Stall 7' },
                                        { label: 'Stall 8', value: 'Stall 8' },
                                        { label: 'Stall 9', value: 'Stall 9' },
                                    ]}
                                />
                            </Container>
                            </Container>     
                        <Container ContainerStyle={{position:'absolute',right:20,marginLeft:10}}>
                            <Button onPress={()=>{this.onOnderPressed()}} style={{marginLeft:10,backgroundColor:'#3F3F3F', borderRadius:5, height:70,width:60,justifyContent:'center', alignItems:'center'}} textStyle={{fontSize:18, color:'#F5F5F5'}}>
                                    <AwesomeIcon name="md-arrow-round-forward" size={30} color={'white'}/>
                            </Button>
                        </Container>
                    </Container>
                </Container>
            )
        }
        
    }
}