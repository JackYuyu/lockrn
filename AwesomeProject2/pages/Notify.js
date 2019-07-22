import React, {Component} from 'react';
import {DeviceEventEmitter, FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as Global from "./Global";
import moment from 'moment'

export default class Notify extends Component {
    state = {
        data: []
    };

    componentWillMount() {
        this.loadData();
    }

    // 页面销毁时发送通知
    componentWillUnmount() {
        DeviceEventEmitter.emit('TNBackFromShopNotification', {});
    }
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        style={styles.list}
                        keyExtractor={item => item.id}
                    />
                </View>
            </SafeAreaView>
        );
    }

    contentView({item}) {
        let time = moment(item.createTime).startOf('hour').fromNow();
        return (
            <View style={styles.card}>
                <View style={styles.towSide}>
                    <Text style={{color: "#333", fontSize: 16, fontWeight: "bold"}}>{item.remark}</Text>
                    <Text>{time}</Text>
                </View>
                <View style={styles.bgw}>
                    <Text>{`${item.sname} | ${item.cname}`}</Text>
                </View>
            </View>
        )
    }

    loadData() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/news/queryNewsList`;
        fetch(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': Global.token,
            },
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            this.setState({data:json.list});
        }).catch((error) => {
            console.error(error);
        });
    }

    updateMsg() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/news/updateNewsList`;
        fetch(REQUEST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': Global.token,
            },
        }).then((response) => {
            if (response.ok) {
                console.log(response);
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
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingTop: 20,
    },
    card: {
        marginHorizontal: 20,
        backgroundColor: "#fff",
        marginBottom: 15,
        shadowColor: '#ccc',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderRadius: 5,
        padding: 15
    },
    towSide: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#f0f0f0",
        borderBottomWidth: 2,
        paddingBottom: 5,
    },
    bgw: {
        backgroundColor: "#f1f1f1",
        flexDirection: "row"
    },
    list: {
        backgroundColor: "#F5FCFF"
    }
});
