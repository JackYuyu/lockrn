import React, {Component} from 'react';
import {AsyncStorage, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import * as Global from "./Global";


export default class Setuppage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 1,
        };
        this.animate = this.animate.bind(this)
    }

    componentDidMount() {
        this.animate();
        // Global.baseUrl = "http://192.168.0.137:8085/";
        AsyncStorage.getItem("token", (error, result) => {
            console.log(error);
            console.log(`token === ${result}`);
            Global.token = result;
            // Global.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0ZGMwYThkMDY1YTkxMWU5YTUxOGZhMDMwMGJiODZmOSIsImlhdCI6MTU1NjA3Nzc4NSwiZXhwIjoxNTU2NjgyNTg1fQ.VXhKwBY3bSKikWSTzMXlU8DLqyaA4rTNEzr90kxhhplNz817Xdsq_xl7xDBFdsjlH2TVMp0SGvtmbd3DZhPtSg";
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    animate() {
        this.timerID = setInterval(() => {
                let {time} = this.state;
                if (time === 0) {
                    clearInterval(this.timerID);
                    if (Global.token === undefined || Global.token === null || Global.token === "") {
                        this.props.navigation.navigate('Login')
                    } else {
                        this.props.navigation.navigate('Main')
                    }
                }
                time = time - 1;
                this.setState({time})
            }, 1000
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>

                <View style={styles.container}>
                    <StatusBar hidden={true}/>
                    <ImageBackground source={require("../static/setup.png")} style={{width: '100%', height: '100%'}}>

                        {/*<View style={styles.progress}>*/}
                            {/*<Text style={styles.text}>{this.state.time} s</Text>*/}
                        {/*</View>*/}

                    </ImageBackground>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    progress: {

        justifyContent: "flex-end",
        flexDirection: "row",

    },
    text: {
        fontSize: 14,
        color: "#fff",
        padding: 5,
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        width: 50,
        borderRadius: 5,
        marginTop: 15,
        marginRight: 15,
        fontWeight: "200"
    }
});
