import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Input} from 'react-native-elements'
import * as ScreenUtil from "../utils/ScreenUtil"
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'
import * as Global from "./Global";

import {Loading} from '../utils/Loading';

export default class Personal extends Component {

    state = {
        name: "",
        company: "",
        mobile: "",
        address: "",
        avatar: "",
    };

    selectPhotoTapped() {
        var photoOptions = {
            //底部弹出框选项
            title: '请选择',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 0.75,
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    avatar:source
                });
            }
        });
    }

    componentWillMount() {
        const {navigation} = this.props;
        this.setState({
            name: navigation.getParam('name', ''),
            company: navigation.getParam('company', ''),
            mobile: navigation.getParam('mobile', ''),
            address: navigation.getParam('address', ''),
            // avatar: {uri: navigation.getParam('avatar', '')},
            avatar: {uri: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1479419211,3323294303&fm=27&gp=0.jpg"}
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.wapper}>
                            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                <Avatar
                                    size="xlarge"
                                    rounded
                                    source={this.state.avatar}
                                    showEditButton
                                    avatarStyle={styles.avatar}
                                />
                            </TouchableOpacity>
                            <Input
                                editable={false}
                                inputStyle={styles.input}
                                value={this.state.name}
                                leftIcon={
                                    <Text style={styles.text}>姓名: </Text>
                                }
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            />
                            <Input
                                editable={true}
                                inputStyle={styles.inputPhone}
                                value={this.state.mobile}
                                onChangeText={(text) => this.setState({mobile: text})}
                                leftIcon={
                                    <Text style={styles.text}>手机: </Text>
                                }
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            />
                            <Input
                                editable={false}
                                inputStyle={styles.input}
                                value={this.state.company}
                                leftIcon={
                                    <Text style={styles.text}>公司: </Text>
                                }
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            />
                            <Input
                                editable={false}
                                inputStyle={styles.input}
                                value="技术部（python）"
                                leftIcon={
                                    <Text style={styles.text}>部门: </Text>
                                }
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            />
                            <Input
                                editable={false}
                                inputStyle={styles.input}
                                multiline={true}
                                value={this.state.address}
                                leftIcon={
                                    <Text style={styles.text}>地址: </Text>
                                }
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            />
                            <TouchableOpacity onPress={this.updateInfo.bind(this)}>
                                <LinearGradient colors={["#023AFC", "#0499FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                locations={[0, 0.75]} style={styles.linearGradient}>
                                    <Text style={styles.buttonText}>
                                        保存
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    updateInfo() {
        Loading.show();
        if (this.state.avatarSource !== undefined) {
            this.updateAvatar()
        } else {
            this.updatePhone()
        }
    }

    updatePhone() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/user/updateUser`;
        let params = {"mobile": this.state.mobile};
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
            Loading.hidden();
            this.props.navigation.state.params.refresh();
            this.props.navigation.goBack();
        }).catch((error) => {
            Loading.hidden();
            console.error(error);
        });
    }

    updateAvatar() {
        let REQUEST_URL = `${Global.baseUrl}lock/app/user/saveHeadpicture`;
        let formData = new FormData();
        let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: 'image.png'};
        formData.append("file",file);
        fetch(REQUEST_URL,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'token': Global.token,
            },
            body:formData,
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        }).then((json) => {
            console.log(json);
            this.updatePhone();
        }).catch((error) => {
            Loading.hidden();
            console.error(error);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    input: {
        color: "#666",
        borderColor: "#fff",
        fontSize: 17,
        lineHeight: 22

    },
    inputPhone: {
        color: "blue",
        borderColor: "#fff",
        fontSize: 17,
        lineHeight: 22

    },
    avatar: {
        marginBottom: 15
    },
    wapper: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 20
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
    linearGradient: {
        marginTop: 30,
        width: ScreenUtil.deviceWidth - 80,
        height: 50,
        borderRadius: 5,
        left: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
});
