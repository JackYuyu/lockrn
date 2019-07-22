/**
 * Created by zhuoy on 2017/6/27.
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 * 这个工具类主要是用来做屏幕适配的
 *
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */
import React from 'react';
import {Dimensions, PixelRatio,} from 'react-native';

export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例
let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例
// 高保真的宽度和告诉
const designWidth = 750.0;
const designHeight = 1334.0;

// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(deviceWidth);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(deviceHeight);

/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
export function setSpText(size: Number) {
    console.log("screenW======" + deviceWidth);
    console.log("screenPxW======" + screenPxW);
    let scaleWidth = deviceWidth / designWidth;
    let scaleHeight = deviceHeight / designHeight;
    let scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round(size * scale / fontScale + 0.5);
    return size;
}

export function scaleSize(size) {

    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}

