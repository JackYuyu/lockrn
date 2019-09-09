import React, {Component} from 'react';
import {
    Alert,
    DeviceEventEmitter,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import * as Global from "./Global";
import moment from 'moment'
import {Toast} from "../utils/Toast";

export default class Notify extends Component {
    state = {
        data: [],
        page: 1,
        showFoot: 1,
        refreshing: true,
    };

    componentWillMount() {
        this.deleteMsg = this.deleteMsg.bind(this);
        this.loadData(1);
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
                        refreshControl={this._refreshControlView()}
                        getItemLayout={(data, index) => this._getItemLayout(data, index)}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={1}
                        ItemSeparatorComponent={this._separator}
                        keyExtractor={item => item.id}
                    />
                </View>
            </SafeAreaView>
        );
    }

    _getItemLayout(data, index) {
        return {length: 200, offset: 200 * index, index}
    }

    _separator() {
        return <View style={{height: 1, backgroundColor: '#999999'}}/>;
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0 || this.state.refreshing) {
            return;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据
        this.loadData(this.state.page + 1);
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text/>
                </View>
            );
        }
    }

    _refreshControlView() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({
                        refreshing: true
                    });
                    this.loadData(1)
                }}
                colors={['#ff0000', '#00ff00', '#0000ff']}
            />
        )
    }

    contentView({item}) {
        let time = moment(item.createTime).startOf('hour').fromNow();
        return (
            <TouchableOpacity
                onLongPress={() => {
                    Alert.alert("温馨提示", "是否删除该消息？", [
                        {
                            text: '取消', onPress: () => {

                            }
                        },
                        {
                            text: '确定', onPress: () => {
                                this.deleteMsg(item)
                            }
                        }
                    ])
                }}>
                <View style={styles.card}>
                    <View style={styles.towSide}>
                        <Text style={{
                            color: "#333",
                            fontSize: 16,
                            fontWeight: "bold"
                        }}>{item.remark} | {item.companyName}</Text>
                        <Text>{time}</Text>
                    </View>
                    <View style={styles.bgw}>
                        <Text>{item.content}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    loadData(page) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/news/queryNewsListPage`;
        let params = {
            'current': page,
            'size': '10'
        };
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
            if (json.code === 0) {
                if (page === 1) {
                    this.setState({data: json.page.records,})
                } else {
                    json.page.records.forEach(value => this.state.data.push(value))
                }
                let showFoot = 0;
                if (json.page.records.length < 10) {
                    showFoot = 1
                }
                this.setState({
                    page: page,
                    showFoot: showFoot,
                    refreshing: false
                });
                this.updateMsg()
            } else {
                this.setState({
                    showFoot: 1,
                    refreshing: false
                });
                Toast.show(json.msg)
            }
        }).catch((error) => {
            this.setState({
                showFoot: 1,
                refreshing: false
            });
            console.error(error);
        });
    }


    deleteMsg(item) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/news/delete`;
        let params = {
            'id': item.id
        };
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
            if (json.code === 0) {
                this.state.data.splice(this.state.data.indexOf(item), 1);
                this.setState({data: this.state.data});
                Toast.show("删除成功")
            } else {
                Toast.show(json.msg)
            }
            this.props.navigation.state.params.refresh();
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
            console.log(json);
            this.props.navigation.state.params.refresh();
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
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});
