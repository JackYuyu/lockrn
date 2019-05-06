import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    TouchableHighlight,
    SafeAreaView
} from 'react-native';
import Global from "./Global";

import * as ScreenUtil from "../utils/ScreenUtil"

export default class OpenDoor extends Component {
    static navigationOptions = {
        title: "BHC中环中心",
        headerStyle: {
            backgroundColor: 'transparent',
        },
        headerTransparent: true
    };



    constructor(props) {
        super(props);
        this.queryLock = this.queryLock.bind(this);
        this.openClock = this.openClock.bind(this);

        this.state = {
            doorState: '未开锁',
            times: 0,
        };
    }

    render() {
        return (

            <SafeAreaView style={{flex: 1}}>
                <ImageBackground
                    source={require('../static/detailpage/detail.png')}
                    style={styles.container}>
                    <StatusBar backgroundColor={'#0499FF'} translucent={false}/>
                    <ImageBackground
                        style={styles.open}
                        source={require('../static/detailpage/open.png')}>
                        <TouchableOpacity onPress={this.openClock}
                                          style={styles.buttonOp}>
                            <Text style={styles.txtopen}> 开锁 </Text>
                        </TouchableOpacity>

                    </ImageBackground>

                    <Text style={styles.title}>307室大门 </Text>
                    <Text style={styles.status}> {this.state.doorState} </Text>

                </ImageBackground>
            </SafeAreaView>
        );
    }

    openClock() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/longOpen/saveByLockId`;
        let params = {"lockId": 6};
        console.log(params);
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
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            this.setState({times: 0});

            function sleep(n) {
                let start = new Date().getTime();
                while (true) if (new Date().getTime() - start > n) break;
            }

            for (let i = 0; i < 4; i++) {
                this.queryLock();
                sleep(1000)
            }
        }).catch((error) => {
            console.error(error);
        });

    }

    queryLock() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/longOpenDoor/queryLongOpenDoorList`;
        let params = {"lockId": 6};
        console.log(params);
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
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            if (json.msg === 'success') {
                this.setState({
                    doorState: '已开锁',
                    times: 1
                });
            }

        }).catch((error) => {
            console.error(error);
        });

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        alignItems: "center"

    },
    open: {
        width: ScreenUtil.deviceWidth,
        height: ScreenUtil.deviceWidth,
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",

    },
    buttonOp: {
        borderRadius: 30,


    },

    txtopen: {
        color: "#0090FF",
        fontSize: 18,
        marginTop: 50,
        textAlign: "center",
        fontWeight: "bold"

    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    status: {
        color: "#0090FF",
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 5
    }
});
