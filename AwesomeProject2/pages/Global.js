import {Dimensions,Platform,StatusBar,PixelRatio} from  'react-native';

const {width, height} = Dimensions.get('window');
const  OS = Platform.OS;
const ios = (OS == 'ios');
const android = (OS == 'android');
const  isIPhoneX = (ios && height == 812 && width == 375);
const  statusBarHeight = (ios ? (isIPhoneX ? 44 : 20) : StatusBar.currentHeight);
//登录token
const token ="";
const distance = 0.0;
const mylat = 0.0;
const mylon = 0.0;
