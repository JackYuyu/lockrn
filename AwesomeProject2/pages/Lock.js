import React, {Component} from 'react';
import {DeviceEventEmitter, SafeAreaView, StyleSheet, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Apply from "../pages/Apply"
import Authorize from "../pages/Authorize"


export default class Lock extends Component {
    static navigationOptions = {
        title: "dsfsfdi"
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar/>}
                        tabBarUnderlineStyle={{
                            backgroundColor: '#0499FF',
                            height: 2
                        }}
                        tabBarBackgroundColor='#FFFFFF'
                        tabBarActiveTextColor='#0499FF'
                        tabBarInactiveTextColor='#0499FF'
                        tabBarTextStyle={{fontSize: 14}}
                        locked={false}
                        onChangeTab={(obj) => {
                            console.log('current index ： ' + obj.i)
                            if (obj.i === 1)
                                DeviceEventEmitter.emit("StartAnswer")
                        }}
                    >
                        <View tabLabel='访客邀约'>
                            <Apply navigation={this.props.navigation}/>
                        </View>
                        <View tabLabel='访客授权'>
                            <Authorize navigation={this.props.navigation}/>
                        </View>
                    </ScrollableTabView>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    }
});
