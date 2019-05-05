import React, {Component} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';

import {Button} from 'react-native-elements';
import * as ScreenUtil from "../utils/ScreenUtil";
import Global from './Global';

export default class UselessTextInputMultiline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 100
        }
    }

    // 你可以试着输入一种颜色，比如red，那么这个red就会作用到View的背景色样式上
    render() {

        return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <View style={styles.msgbox}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.TextInput.focus()}
                        style={{height: 260,padding: 10}}
                    >
                        <TextInput
                            placeholder={'请输入您宝贵的意见'}
                            placeholderTextColor={'#bbbbbb'}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            ref={textInput => this.TextInput = textInput}
                            style={[{paddingVertical: 0, paddingLeft: 5, fontSize: 16, maxHeight: 240,color:"#666"}]}
                        />
                    </TouchableOpacity>

                    <View style={styles.btns}>
                        <Button
                            title="取消"
                            buttonStyle={styles.butn1}
                        />
                        <Button
                            title="提交"
                            buttonStyle={styles.butn2}
                            onPress={() => {
                                this.loadSave()
                                // this.props.navigation.navigate('Main')
                            }}
                        />

                    </View>

                </View>
            </View>
        </SafeAreaView>
        );
    }
    loadSave(){

        let REQUEST_URL = `${Global.baseUrl}lock/app/feedback/save`;
        let params = {"text":"1asdfasdfdsf"};
        console.log(params)
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': Global.token,
            },
            body: JSON.stringify(params)
        }).then((response) => {
            if (response.ok) {
                console.log(response)
                return response.json();
            }
        }).then((json) => {
            console.log(json)

        }).catch((error) => {
            console.error(error);
        });

    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f4f4f4",
        padding:20
    },
    msgbox:{
        backgroundColor: "#fff",
        borderRadius:10
    },
    btns:{
        flexDirection:"row"
    },
    butn1:{
        width:(ScreenUtil.deviceWidth-40)/2,
        backgroundColor:"#D3E2F1",
        color:"#4B4D68",
        borderBottomLeftRadius:10

    },
    butn2:{
        width:(ScreenUtil.deviceWidth-40)/2,
        borderBottomRightRadius:10
    },

});


