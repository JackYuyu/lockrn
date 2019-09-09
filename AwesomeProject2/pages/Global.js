//登录token
export let token ="";
export const baseUrl ="https://door.zhiliaolink.com/";
// export const baseUrl ="http://zeirec.natappfree.cc/";//裴思宇
// export const baseUrl ="http://192.168.0.137:8087/";
export let distance = NaN;
export let needSign = false;
export let lat = NaN;
export let lon = NaN;
export let mylat = 0.0;
export let mylon = 0.0;
export let lockCompany = "";//当前锁名字
export let lockName = "";//当前锁名字
export let lockId = "";//当前锁的id

export function rad(d) {
    return d * Math.PI / 180.0;
}
