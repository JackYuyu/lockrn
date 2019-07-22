import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native-elements';


export default class About extends Component {
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Image
                        source={require("../static/icon_logo.png")}
                        style={{width: 150, height: 150, marginTop: 60}}
                    />
                    <Text style={{fontSize: 16, marginVertical: 10, color: "#999"}}>版本：5.0.1</Text>
                    <View style={{paddingHorizontal: 15}}>
                        <Text style={{fontSize: 16, lineHeight: 24, textIndent: 25}}>
                            云邻通讯技术有限公司成立于2012 年2月，经过七年多的发展，公司拥有一支经验丰富的方案设计、研发、 实施团队，
                            致力于为大中小企业提供全方位的IT产品、方案和服务。
                            公司主要的业务方向有云计算解决方案集成服务、软件开发与解决方案服务及Saas h云平台三个方向。
                        </Text>
                    </View>

                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    }
});
