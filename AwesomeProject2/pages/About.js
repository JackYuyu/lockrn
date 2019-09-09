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
                            {"\t\t云管家是将传统智能锁终端接入IoT终端网络，相对传统智能锁具有、深度覆盖、大量连接、数据传输速度快、超低功耗、更加安全、更加稳定等优势，实现电子锁电脑远程开锁、手机APP开锁、小程序开锁、门锁状态监测的智能管理。\n\n" +
                            "\t\t云管家通过基站持续和服务器互传数据，用户可以实时获取锁的任何状态信息，例如若出现电量低、用户开锁验证失败等情况时，会主动上报，向门锁管理者报警;即便是地下室或封闭的楼道内，其使用信号强度依然高;电池寿命可以提高一倍以上;基于基站的云服务器可以多协议互联;用户APP需登录实名制开锁易于管控，并支持自动登记设备和空中升级等功能;具有整个城市一张网，便于维护管理，与物业分离更易寻址安装等优势。"}
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
