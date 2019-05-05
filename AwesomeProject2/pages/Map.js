import React, { Component } from 'react';
import { Text, View,StyleSheet,Alert } from 'react-native';
var Geolocation = require('Geolocation');
//监听定位的id
var watchID = null
export default class Map extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.item} onPress={this.beginWatch.bind(this)}>开始监听</Text>
                <Text style={styles.item} onPress={this.stopWatch.bind(this)}>停止监听</Text>
            </View>
        );
    }

    //开始监听位置变化
    beginWatch() {
        watchID = Geolocation.watchPosition(
            location => {
                var result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;
                Alert.alert(result);
            },
            error => {
                Alert.alert("获取位置失败："+ error)
            }
        );
    }

    //停止监听位置变化
    stopWatch() {
        Geolocation.clearWatch(watchID);
    }
}

//样式定义
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop:25
    },
    item:{
        margin:15,
        height:30,
        borderWidth:1,
        padding:6,
        borderColor:'#ddd',
        textAlign:'center'
    },
});
