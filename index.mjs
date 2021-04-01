import fetch from 'node-fetch';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import * as fs from 'fs'

//====================================================================================
// 初期設定
const url = '<スクレイピング先URLを入力>';
const bot_name = '<BOT名称入力>';
const txt_path = '<出力ファイル指定>';
const token = '<Tokenを入力>';
const btn_name = '<スクレイピング先サイトボタン名称>';

//====================================================================================

//------------------------------------------------------------------------------------
//保守用
const ver = "1.0 β";
const admin = "<運営保守担当者入力>";

//------------------------------------------------------------------------------------

(async () => {
  const res = await fetch(url);
  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const data = document.querySelector('#frame-97 > div.panel-body.block > article > div:nth-child(1)');
  const msg = data.textContent;

  if( fs.existsSync(txt_path) ){ // txtファイル存在確認
    let read = fs.readFileSync(txt_path);  // txt読み込み
    if(read == msg){ // データ判定
      console.log("Don't need to renew;");
    }else{ // データに変更があった場合
      fs.writeFile(txt_path, msg ,function(err, result) { // 変更を保存
        if(err) console.log('error', err);
      });
      
      fetch('https://api.line.me/v2/bot/message/broadcast', { // LINEへcurlでpush
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer {${token}}`
        },
        body: JSON.stringify(
            { 
                "messages":[
                    {
                        "type": "flex",
                        "altText": "お知らせ",
                        "contents": 
            
                    {
                        "type": "bubble",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "新着お知らせ",
                              "color": "#ffffff",
                              "align": "center",
                              "weight": "bold",
                              "size": "xl"
                            }
                          ],
                          "background": {
                            "type": "linearGradient",
                            "angle": "62deg",
                            "startColor": "#F091C7",
                            "endColor": "#F7CE68"
                          }
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "text",
                                  "text":  msg,
                                  "wrap": true,
                                  "margin": "none",
                                  "size": "sm"
                                }
                              ],
                              "backgroundColor": "#f6dfeb",
                              "offsetTop": "none",
                              "offsetBottom": "none",
                              "offsetStart": "none",
                              "offsetEnd": "none",
                              "cornerRadius": "md",
                              "paddingAll": "sm"
                            },
                            {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "▶ 詳細は下記のボタンより公式HPをご確認ください。",
                                  "wrap": true,
                                  "size": "sm"
                                },
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "button",
                                      "action": {
                                        "type": "uri",
                                        "label": btn_name,
                                        "uri": url
                                      },
                                      "color": "#ffffff"
                                    }
                                  ],
                                  "backgroundColor": "#addfff",
                                  "cornerRadius": "xxl",
                                  "margin": "sm"
                                }
                              ],
                              "margin": "xxl"
                            }
                          ]
                        },
                        "footer": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "separator"
                            },
                            {
                              "type": "text",
                              "margin": "sm",
                              "size": "xs",
                              "text": bot_name + ver,
                              "align": "end"
                            },
                            {
                              "type": "text",
                              "text": "運営・管理：" + admin,
                              "size": "xxs",
                              "align": "end",
                              "margin": "xs"
                            }
                          ]
                        }
                      }
                    }
                ] 
            }
        )});
      }
  }else{ // txt存在しない場合
    fs.writeFile(txt_path, msg ,function(err, result) { // 変更を保存
      if(err) console.log('error', err);
    });
  }
})();
