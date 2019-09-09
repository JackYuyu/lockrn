import React, {Component} from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import {Image, ListItem} from 'react-native-elements'
import * as Global from "./Global";
import {Toast} from "../utils/Toast";

export default class UserLock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            showFoot: 1,
            refreshing: true,
        };
    }

    componentDidMount() {
        this.queryLock(1);
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.contentView}
                        refreshControl={this._refreshControlView()}
                        getItemLayout={(data, index) => this._getItemLayout(data, index)}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={1}
                        ItemSeparatorComponent={this._separator}
                        keyExtractor={item => item.id}/>
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
        this.queryLock(this.state.page + 1);
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
                    this.queryLock(1)
                }}
                colors={['#ff0000', '#00ff00', '#0000ff']}
            />
        )
    }

    contentView({item}) {
        return (
            <View style={styles.wrapper}>
                <ListItem
                    title={item.houseName}
                    subtitle={item.intoTime}
                    rightAvatar={
                        <Image
                            source={require("../static/my/lock.png")}
                            style={{width: 60, height: 60}}/>
                    }
                    titleStyle={{color: "#444662 ", fontSize: 18, marginBottom: 5}}
                    subtitleStyle={{color: "#8D8FA0 ", fontSize: 12}}
                    bottomDivider={true}/>
            </View>
        )
    }

    queryLock(page) {
        let REQUEST_URL = `${Global.baseUrl}lock/app/longOpen/queryLongOpenListPage`;
        let params = {
            "userId": "",
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
                })
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
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    wrapper: {
        paddingHorizontal: 10,
        backgroundColor: "#fff"
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});
