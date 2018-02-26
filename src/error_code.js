const DEFAULT_MESSAGE = '网络错误，请重试';
const errorCode = {};
const codeInfoMap = [];

/**
 * 定义一个错误码
 * @param {number} code 错误码，必须唯一
 * @param {null | string?} message 错误描述，会下发给浏览器端让用户看见。若不填则使用默认值。
 *                                   通过特殊标志${1}或${2}等，配合MError的setMessageTemplateData方法可以嵌入变量
 * @param {boolean?} fatal 是否是致命错误，默认为true。致命错误在测试环境会显示大红条提示
 * @return {number}
 */
function defineCode(code, message, fatal) {
    if (codeInfoMap[code]) {
        throw new Error(`重复的错误码:${code}`);
    }
    codeInfoMap[code] = {
        message: message || `(${code})${DEFAULT_MESSAGE}`,
        fatal: fatal === undefined || fatal
    };
    return code;
}

/**
 * 获取错误码对应的错误信息
 * @param {number} code
 * @returns {{message: string, fatal: boolean}}
 */
errorCode.getCodeData = function getCodeData(code) {
    if (codeInfoMap[code]) {
        return codeInfoMap[code];
    }
    console.error(`未知的错误码:${code}`);
    return {
        message: DEFAULT_MESSAGE,
        fatal: true
    };
};

/* eslint-disable no-template-curly-in-string */
/** 无错误 */
errorCode.SUCCESS = defineCode(0, '');

/** 不知名错误 */
errorCode.UNKNOWN = defineCode(1, '未知错误');

/** **********************************以下前端相关的错误码*********************************** */

/** 401未授权 */
errorCode.HTTP_UNAUTHORIZED = defineCode(1001, '请求未授权');

/** 前端请求超时 */
errorCode.HTTP_TIME_OUT = defineCode(1002, '网络超时，请重试');

/** 403禁止访问 */
errorCode.HTTP_FORBIDDEN = defineCode(1003, '禁止访问');

/** 404找不到 */
errorCode.HTTP_NOT_FOUND = defineCode(1004, '请求的网址不存在');

/** 其它前端请求网络错误 */
errorCode.HTTP_NETWORK_ERR = defineCode(1005, '网络连接错误，请重试');

/** 微信支付错误 */
errorCode.WECHAT_PAY_ERROR = defineCode(1006, '微信支付遇到问题，请重新支付');

/** 还没回包，又发送了相同的请求 */
errorCode.DUPLICATE_REQUEST = defineCode(1007, '操作过于频繁，请稍候再试', false);

/** **********************************以下发包相关的错误码*********************************** */

/** 域名被墙 */
errorCode.HOST_UNRESOLVED = defineCode(2001);

/** 还未连接上 */
errorCode.NOT_CONNECTED = defineCode(2002);

/** 服务器断开连接 */
errorCode.SERVER_CLOSED = defineCode(2003);

/** 发包超时 */
errorCode.TIME_OUT = defineCode(2004, '网络超时，请重试');

/** 已达到最大重发次数 */
errorCode.MAX_RETRY = defineCode(2005);

/** 解析包错误 */
errorCode.PARSE_ERROR = defineCode(2006);

/** 无法创建请求包 */
errorCode.PACKET_ERROR = defineCode(2008);

/** 指定的地址在远程机器上不可用 */
errorCode.ADDRESS_NOT_AVAILABLE = defineCode(2009);

/** socket连接尝试超时 */
errorCode.CONNCTION_TIMEDOUT = defineCode(2010);

/** 服务器主动拒绝建立连接 */
errorCode.CONNCTION_REFUSED = defineCode(2011);

/** 连接已被重置 */
errorCode.CONNCTION_RESET = defineCode(2012);

/** 从本机到给定addr的网络不通 */
errorCode.NETWORK_UNREACHABLE = defineCode(2013);

/** socket 已经连接 */
errorCode.IS_CONNECTED = defineCode(2014);

/** 端口号被占用 */
errorCode.ADDRESS_IN_USE = defineCode(2015);

/** socket 发送数据返回错误 */
errorCode.SOCKET_SEND_ERROR = defineCode(2016);

/** 参数错误 */
errorCode.PARAMETER_ERROR = defineCode(2017, '参数错误');

/** 服务器操作数据时返回错误 */
errorCode.SERVER_PROCESSCE_ERROR = defineCode(2018);

/** 服务器返回数据为空 */
errorCode.SERVER_RETURN_EMPTY_DATA = defineCode(2019);

/** 不允许把数据库中查出的数据直接下发到浏览器 */
errorCode.CANNOT_SEND_NATIVE_DATA = defineCode(2020);

/** 请求包过大 */
errorCode.REQUEST_TOO_LARGE = defineCode(2021, '数据量过大，发送失败');

/** 禁止访问该端口 */
errorCode.FORBIDDEN_PORT = defineCode(2022, '禁止访问该端口');

/** 被拦截的攻击请求 */
errorCode.HACK_DETECTED = defineCode(2023);

/** 已经回过包了，不能多次回包 */
errorCode.HAS_RESPONSED = defineCode(2024);

/** 服务器端向第三方服务器请求数据时错误 */
errorCode.THIRD_SEVER_ERROR = defineCode(2025);

/** 微信服务器返回的错误 */
errorCode.WX_SERVER_ERROR = defineCode(2026, '微信访问错误');

/** 微信服务器返回的系统繁忙错误 */
errorCode.WX_SERVER_BUSY = defineCode(2027, '微信服务器繁忙');

/** 微信服务器返回的accessToken错误 */
errorCode.WX_ACCESS_TOKEN_INVALID = defineCode(2028, '微信AccessToken错误');

/** 微信服务器返回的accessToken过期 */
errorCode.WX_ACCESS_TOKEN_EXPIRED = defineCode(2029, '微信AccessToken已过期');

/** 微信服务器返回的openId错误 */
errorCode.WX_OPENID_INVALID = defineCode(2030, '微信openId错误');

/** 向微信获取openId时返回的错误 */
errorCode.WX_GET_OPENID_ERROR = defineCode(2031, '获取微信openId错误');

/** 向微信获取jsapiTicket时返回的错误 */
errorCode.WX_GET_JS_API_TICKET_ERROR = defineCode(2032, '获取微信jsapiTicket错误');


/** **********************************以下是微服务间请求用的错误码*********************************** */

/** 未知的微服务地址 */
errorCode.UNKNOWN_INNER_SERVER_NAME = defineCode(4001, '无法连接到服务器');

/** 向微服务发请求失败，连接建立不成功 */
errorCode.INNER_SERVER_REQUEST_FAIL = defineCode(4002, '服务器连接失败');

/** 向微服务发请求，收到了非200的状态码 */
errorCode.INNER_SERVER_REQUEST_ERROR = defineCode(4003, '服务器连接错误');

/** **********************************以下是各业务用的错误码*********************************** */
/** 未登录，请求中没有找到自己的sessionKey */
errorCode.NOT_SIGNIN = defineCode(3001, '未登录，请登录后再试', false);

/** 登录态已过期，需要重新登录 */
errorCode.NEED_RELOGIN = defineCode(3002, '登录态已过期，请重新登录后再试', false);

module.exports = errorCode;
