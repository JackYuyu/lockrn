import * as Global from './Global';
import React, {Component} from 'react';
import {Alert, AsyncStorage, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Image} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient'
import {scaleSize, setSpText} from "../utils/ScreenUtil";
import {Toast} from "../utils/Toast";


export default class Login extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            canClick: true,
            time: 60,
            timing: 60,
            mobile: "",
            password: ""
        };
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Image
                        source={require("../static/icon_logo.png")}
                        style={{
                            width: scaleSize(250),
                            height: scaleSize(250),
                            marginTop: scaleSize(100)
                        }}
                    />
                    <Text style={{fontSize: 18, marginVertical: 10, color: "#00A7FF"}}>云邻智联</Text>
                    <View style={styles.login}>
                        <TextInput
                            placeholder='手机号'
                            style={styles.input} underlineColorAndroid='transparent'
                            onChangeText={(text) => {
                                this.setState({mobile: text});

                                console.log(text)
                            }}/>
                        <View style={{flexDirection: "row", marginTop: 25}}>
                            <TextInput
                                placeholder='输入验证码'
                                style={[styles.input, {marginRight: 15, flex: 1,}]} underlineColorAndroid='transparent'
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text,
                                    });
                                    console.log(text)
                                }}/>
                            <TouchableOpacity
                                style={{width: scaleSize(200)}}
                                onPress={() => {
                                    if (this.state.canClick) {
                                        this.messagePress()
                                    }
                                }}>
                                <LinearGradient colors={["#6102FC", "#0499FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                locations={[0, 1]} style={styles.yanzhen}>
                                    <Text style={styles.buttonText}>
                                        {this.state.timing === this.state.time ? '获取验证码' : this.state.timing + 's'}
                                    </Text>

                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                this.loginPress()
                            }}>
                            <LinearGradient
                                colors={["#6102FC", "#0499FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                locations={[0, 1]} style={styles.button}>
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
    loginPress() {
        if (this.state.mobile.length !== 11) {
            Toast.show("请输入正确的手机号")
        }
        if (!this.state.password) {
            Alert.alert("请输入验证码");
            return
        }
        let REQUEST_URL = `${Global.baseUrl}lock/app/login`;
        let params = {"mobile": this.state.mobile, "code": this.state.password};
        console.log(params);
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
            if (json.code === 0) {
                let tokens = json.token;
                Global.token = json.token;
                console.log(Global.token);
                //存储token
                AsyncStorage.setItem("token", tokens, (error) => {
                    console.log(error)
                });
                AsyncStorage.getItem("token", (error) => {
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
    messagePress() {
        if (!this.state.mobile) {
            Alert.alert("请输入手机号");
            return
        }
        this.setState({canClick: false});
        let REQUEST_URL = `${Global.baseUrl}lock/app/sendSms?mobile=${this.state.mobile}`;
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.msg === 'success') {
                    this.countDown()
                } else {
                    this.setState({canClick: true});
                    Toast.show(responseJson.msg)
                }
                return responseJson;
            }).catch((error) => {
            console.error(error);
        });

    }

    countDown() {
        if (this.state.timing === 0) {
            this.setState({canClick: true});
            this.setState({
                timing: 60,
            })
        } else {
            this.setState({
                timing: this.state.timing - 1,
            });
            //这里使用 setTimeout 不是因为不知道setInterval 而是因为setInterval 固有的缺陷
            // 相亲请移步到 https://www.jianshu.com/p/db9caa6bd2b1 中的超时调用一节
            setTimeout(this.countDown.bind(this), 1000);
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",

    },
    login: {
        paddingHorizontal: 40,
        width: "100%",
        marginTop: 50
    },
    input: {
        height: 50,
        textAlign: 'left',
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 15,
        width: "100%",
        shadowColor: '#000',
        fontSize: setSpText(25),
        color: "#666",
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: scaleSize(25),
    },
    yanzhen: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
        borderRadius: 5
    },
    button: {
        marginTop: 25,
        height: 50,
        borderRadius: 5,
        left: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    }
});
