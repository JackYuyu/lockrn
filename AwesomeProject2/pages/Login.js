import Global from './Global';
import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, AsyncStorage, DeviceEventEmitter} from 'react-native';
import {Image,Input,Icon,Button} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient'
import * as ScreenUtil from "../utils/ScreenUtil";
import {Toast} from "../utils/Toast";


export default class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state={
            mobile: "",
            password: ""
        };
    }
    render() {
        return (
        <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <Image
                        source={require("../static/icon_logo.png")}
                        style={{ width: 150, height: 150,marginTop:60 }}
                    />
                    <Text style={{fontSize:18,marginVertical:10,color:"#00A7FF"}}>云邻智联</Text>
                <View style={styles.login}>
                    <View style={{flexDirection:"row",marginBottom:25}}>
                        <TextInput
                            placeholder='手机号'
                            style={[styles.input,{marginRight:15, flex:1,}]} underlineColorAndroid='transparent'
                            onChangeText={(text)=>{
                                this.setState({
                                    mobile: text,
                                });

                                console.log(text)
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                this.messagePress()
                            }}

                        >
                        <LinearGradient colors={["#6102FC","#0499FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} locations={[0, 1]} style={styles.yanzhen}>
                            <Text style={styles.buttonText}>
                                获取验证码
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    <TextInput
                        placeholder='输入验证码'
                        style={styles.input} underlineColorAndroid='transparent'
                        onChangeText={(text)=>{
                            this.setState({
                                password: text,
                            });

                            console.log(text)
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            this.loginPress()
                            // this.props.navigation.navigate('Main')
                        }}

                    >
                    <LinearGradient

                        colors={["#6102FC","#0499FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} locations={[0, 1]} style={styles.button}>
                        <Text style={styles.buttonText}>
                            登录
                        </Text>
                    </LinearGradient>
                    </TouchableOpacity>

                </View>
                </View>
        </SafeAreaView>
        );
    }

    //登录请求
    loginPress(){
        if (!this.state.password) {
            Alert.alert("请输入验证码")
            return
        }
        let REQUEST_URL = `${Global.baseUrl}lock/app/login`;
        let params = {"mobile":this.state.mobile,"code":this.state.password};
        console.log(params)
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            if (json.code === 0){
                let tokens=json.token;
                Global.token = json.token;
                // Global.token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0ZGMwYThkMDY1YTkxMWU5YTUxOGZhMDMwMGJiODZmOSIsImlhdCI6MTU1NjA3Nzc4NSwiZXhwIjoxNTU2NjgyNTg1fQ.VXhKwBY3bSKikWSTzMXlU8DLqyaA4rTNEzr90kxhhplNz817Xdsq_xl7xDBFdsjlH2TVMp0SGvtmbd3DZhPtSg"
                console.log(Global.token);
                //存储token
                AsyncStorage.setItem("token",tokens,(error)=>{
                    console.log(error)
                });
                let a=AsyncStorage.getItem("token",(error)=>{
                    console.log(error)
                });
                this.props.navigation.navigate('Main')
            } else {
                Toast.show(`${json.msg}`);
            }
        }).catch((error) => {
            console.error(error);
        });

    }
    //发送短信
    messagePress(){
        if (!this.state.mobile) {
            Alert.alert("请输入手机号")
            return
        }
        var REQUEST_URL = `${Global.baseUrl}lock/app/sendSms?mobile=${this.state.mobile}`;
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",

    },
    login:{
        paddingHorizontal:40,
        width:"100%",
        marginTop:50
    },
    input:{
        height: 50,
        textAlign: 'left',
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius:15,
       width: "100%",
        shadowColor: '#000',
       fontSize: 16,
        color: "#666",
        borderColor:"#ccc",
        borderWidth:1,
        paddingHorizontal:15,

    },
    buttonText:{
        color: "#fff",
        fontSize: 16,
    },
    yanzhen: {
        paddingHorizontal:10,
        paddingVertical:5,
        justifyContent:"center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
        borderRadius: 5
    },
    button:{
        marginTop:25,
        height: 50,
        borderRadius:5,
        left: 0,
        top: 0,
        justifyContent:"center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,

    }

});
