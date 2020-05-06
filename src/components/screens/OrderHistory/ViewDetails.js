import React, {Component} from 'react'
import {Textview, Container, Button, Input, Statusbar} from '../../default'
import {Header, Title} from 'native-base'
import {FlatList, Alert,TouchableOpacity, Image,Dimensions,ActivityIndicator} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

var amount = 0;
export default class ViewDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            demand: [],
            loading:true
        }
    }
    componentDidMount(){
        amount=0;
        console.log("component did mount .. ",this.props.navigation.state.params.demand)
        this.setState({demand: this.props.navigation.state.params.demand},()=>{
            for(var i=0;i<this.state.demand.length;i++){
                amount+=this.state.demand[i].productquantity*this.state.demand[i].productprice;
            }
            this.setState({loading:false})
        }) 
        
    }
    render(){
        return(
            <Container ContainerStyle={{flex:1,backgroundColor:'#FEB914'}}>
                <Header style={{height:70, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#3F3F3F'}}>
                    <Statusbar backgroundColor="#3F3F3F"/>
                    <Title style={{fontSize:25, color:'#F5F5F5'}}>View Order Details</Title>
                </Header>
                <ScrollView>
                    <Container ContainerStyle={{ borderRadius:10,alignSelf:'center',width:'90%',marginTop:20,backgroundColor:'#3F3F3F',}}>
                        <FlatList
                            data={this.state.demand}
                            extraData={this.state}
                            refreshing={this.state.refresh}
                            renderItem={({ item, index }) => (   
                                <Container ContainerStyle={{padding:20,alignItems:'center',alignSelf:'center',width:'100%',borderRadius:10,}}>
                                    <Container ContainerStyle={{flexDirection:'row',marginLeft:20,width:'100%'}}>
                                        <Textview textStyle={{fontSize:18,color:'white'}} text={item.productname}/>
                                        <Textview textStyle={{fontSize:18,color:'white',position:'absolute',right:10}} text={item.productquantity+" "}/>
                                    </Container>
                                </Container>
                            )}
                            keyExtractor={(item,index) => index.toString()}                    
                        />
                    </Container>
                    <Container ContainerStyle={{ borderRadius:10,alignSelf:'center',width:'90%',marginTop:20,backgroundColor:'#3F3F3F',padding:20,marginBottom:30}}>
                        <Container ContainerStyle={{flexDirection:'row',marginLeft:15,width:'100%'}}>
                            <Textview textStyle={{fontSize:20,color:'white'}} text={'Amount:'}/>
                            <Textview textStyle={{fontSize:20,color:'white',position:'absolute',right:20}} text={amount+" "}/>
                        </Container>
                    </Container>
                </ScrollView>
            </Container>
        )
    }
}