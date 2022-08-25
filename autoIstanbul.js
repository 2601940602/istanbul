const fs = require('fs');
const express = require('express');
const app = express();
const { execSync } = require('child_process');
const liveServer = require('live-server');
const chalk = require('chalk');
const rimraf = require('rimraf');

// 清空文件夹
rimraf.sync('./.nyc_output/');
fs.mkdirSync('./.nyc_output');

// 设置跨域
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
// 设置接收json的大小
app.use(express.json({
  limit: '100mb'
}));
app.use(express.urlencoded({ extended: true }));

// 设置静态页面 自测用的
app.get('*', (req, res) => {
  res.send('autoIstanbul.js');
});

// 接收前端传参
app.post('/istanbulSync', async (req, res) => {
  let parse = JSON.parse(req.body.coverage);
  let date = new Date().getTime();
  fs.writeFileSync(`./.nyc_output/${date}.json`, JSON.stringify(parse));
  let message = '代码覆盖率同步成功!';
  try {
    execSync('nyc report --reporter=html', { encoding: 'utf8' });
  } catch (error) {
    message = '代码覆盖率同步失败!' + error;
  }
  console.log(chalk.green(message));
  res.send(`${message}, 实时预览地址: http://localhost:11119`);
});
// 启动代码覆盖率后端服务
app.listen(11118, () => {
  console.log(chalk.cyan('listening sync: http://localhost:11118'));
});

// 启动代码覆盖率前端标签页自动刷新服务
let params = {
  port: 11119,
  host: '0.0.0.0',
  root: './coverage',
  open: false,
  file: 'index.html',
  logLevel: 0,
  middleware: [
    function(req, res, next) {
      next();
    }
  ]
};
liveServer.start(params);
console.log(chalk.cyan('listening showHtml: http://localhost:11119'));