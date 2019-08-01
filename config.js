var host = "yun.pfan123.com"

var config = {

    host,

    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/testRequest`,

    // 上传文件接口
    uploadFileUrl: `https://${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `https://${host}/static/weapp.jpg`
};

module.exports = config
