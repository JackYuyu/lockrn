import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, ScrollView, SafeAreaView, FlatList} from 'react-native';
import {Divider} from 'react-native-elements'
import {Button} from 'react-native-elements';
import * as ScreenUtil from "../utils/ScreenUtil"
import Global from "./Global";
import {Toast} from "../utils/Toast";


export default class Authorize extends Component {

    componentDidMount() {
        this.loadData();
    }

    state = {
        data: [{
            createTime: "2019-04-18 16:56:50",
            id: 2,
            visitorName: "12312321"
        }]
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        style={styles.list}
                        keyExtractor={item => item.id}
                    />
                </View>
            </ScrollView>
        );
    }

    contentView({item}) {
        let arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push(i)
        }
        let time = item.createTime.substring(0, item.createTime.length - 3);
        return (
            <View style={styles.card}>
                <View style={styles.cardWarper}>
                    <View style={styles.info}>
                        <Text style={styles.visityTitle}>{item.visitorName}正在申请拜访</Text>
                        <Text style={styles.visityTime}>时间：{time}</Text>
                    </View>
                    <View style={{flexDirection: 'row', overflow: "hidden", marginBottom: 15}}>
                        {
                            arr.map(({item, index}) => (
                                <Divider style={{backgroundColor: '#979797', width: 10, marginRight: 5}}
                                         key={index}/>
                            ))
                        }
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.bottomText}>事由：面试</Text>
                        <Text style={styles.bottomText}>届时可能需要使用 <Text
                            style={styles.lock}>307室大门</Text> 的权限是否同意授权 </Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <Button
                        title="拒绝"
                        buttonStyle={styles.butn1}
                        onPress={() => {
                            Authorize.approvalPress(1, 2)
                        }}
                    />
                    <Button
                        title="同意"
                        buttonStyle={styles.butn2}
                        onPress={() => {
                            Authorize.approvalPress(1, 1)
                        }}
                    />
                </View>
            </View>
        )
    }

    loadData() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/visitor/queryVisitorList`;
        let params = {};
        console.log(params);
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
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
            this.setState({data: json.list})
        }).catch((error) => {
            console.error(error);
        });
    }

    static approvalPress(id, approvalState) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/visitor/approvalVisitor`;
        let params = {"id": id, "approvalState": approvalState};
        console.log(params);
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
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
            if (approvalState === 1) {
                Toast.show('已接受拜访申请');
            } else {
                Toast.show('已拒绝拜访申请');
            }
        }).catch((error) => {
            console.error(error);
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 25,

    },
    cardWarper: {
        paddingHorizontal: 15,
        paddingTop: 20
    },
    info: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 2,
        width: 5,
        marginTop: 2,
        flex: 1,
    },
    visityTitle: {
        color: "#4B4D68",
        fontSize: 18
    },
    visityTime: {
        color: "#333",
        fontSize: 14,
        marginTop: 5,
    },
    bottomText: {
        color: "#333",
        fontSize: 14,
        marginTop: 5,
    },
    buttons: {
        flexDirection: "row",
    },
    butn1: {
        width: (ScreenUtil.deviceWidth - 40) / 2,
        backgroundColor: "#D3E2F1",
        color: "#4B4D68",
        borderBottomLeftRadius: 15

    },
    butn2: {
        width: (ScreenUtil.deviceWidth - 40) / 2,
        borderBottomRightRadius: 15
    },
    lock: {
        backgroundColor: "#c3941c",
        padding: 4,
        color: "#fff"
    },
    list: {
        backgroundColor: "#F5FCFF"
    }
});
